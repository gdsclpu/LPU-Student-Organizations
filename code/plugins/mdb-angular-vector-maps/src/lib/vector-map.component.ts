import { Overlay, OverlayRef, PositionStrategy } from '@angular/cdk/overlay';
import { TemplatePortal } from '@angular/cdk/portal';
import {
  Component,
  ElementRef,
  EventEmitter,
  Input,
  NgZone,
  OnDestroy,
  OnInit,
  Output,
  TemplateRef,
  ViewChild,
  ViewContainerRef,
} from '@angular/core';
import { fromEvent, Subscription } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { maps } from './maps';
import { Pinch } from './pinch';
import {
  getDisplacement,
  getElementCenter,
  getEventCoordinates,
  getVector,
  parseToHTML,
} from './utilts';

const TOOLTIP_OFFSET_X = -25;
const TOOLTIP_OFFSET_Y = 20;

export interface MdbMapUnit {
  element: HTMLElement;
  d: string;
  id: string;
  title: string;
  fill: string;
  selected: boolean;
  tooltip: string;
}

export interface MdbMapMarker {
  type: 'pin' | 'bullet';
  x: number;
  y: number;
  label: string;
  radius?: number;
  fill?: string;
  stroke?: string;
  strokeWidth?: string;
  innerFill?: string;
}

@Component({
  // eslint-disable-next-line @angular-eslint/component-selector
  selector: 'mdb-vector-map',
  templateUrl: './vector-map.component.html',
})
export class MdbVectorMapComponent implements OnInit, OnDestroy {
  @ViewChild('wrapper', { static: true }) wrapper: ElementRef;
  @ViewChild('svgElement', { static: true }) svgElement: ElementRef;
  @ViewChild('tooltipTemplate', { read: TemplateRef }) tooltipTemplate: TemplateRef<any>;
  @ViewChild('mapContentTemplate', { static: true }) mapContentTemplate: any;

  @Input() btnClass = 'btn-dark';
  @Input()
  get colorMap(): any {
    return this._colorMap;
  }
  set colorMap(colorMap: any) {
    this._colorMap = colorMap;

    if (this._componentInitialized) {
      this._setupUnitsParameters();
    }
  }
  private _colorMap: any[] = [];
  @Input() customMapContent: HTMLElement;
  @Input() viewBox: string;
  @Input() fill = '#E0E0E0';
  @Input() fillOpacity = 1;
  @Input() height: number;
  @Input() hover = true;
  @Input() hoverFill = '#BDBDBD';

  @Input()
  get map(): string {
    return this._map;
  }
  set map(value: string) {
    this._map = value;

    if (this._componentInitialized) {
      this._updateMap();
    }
  }
  private _map = 'world';

  @Input()
  get markers(): MdbMapMarker[] {
    return this._markers;
  }
  set markers(value: MdbMapMarker[]) {
    this._markers = value;

    if (this._componentInitialized) {
      this._setupMarkers();
    }
  }
  private _markers: MdbMapMarker[] = [];
  @Input() markerFill = '#757575';
  @Input() markerStroke = '#000';
  @Input() markerInnerFill = 'rgba(0, 0, 0, 0.3)';
  @Input() markerStrokeWidth = 1.2;
  @Input() readonly = false;
  @Input() scale = 1;
  @Input() selectFill = '#B23CFD';
  @Input() selectRegion = null;
  @Input() stroke = '#000';
  @Input() strokeLinejoin = 'round';
  @Input() strokeOpacity = 1;
  @Input() strokeWidth = 0.5;
  @Input() selectedRegion: string;
  @Input() tooltips = true;
  @Input() width: number;
  @Input() zoomEvents = true;
  @Input() zoomMax: number;
  @Input() zoomMin = 1;
  @Input() zoomStep = 0.5;

  @Output() selected: EventEmitter<MdbMapUnit> = new EventEmitter<MdbMapUnit>();
  @Output() markerClick: EventEmitter<MdbMapMarker> = new EventEmitter<MdbMapMarker>();

  _mapUnits: MdbMapUnit[];

  _mapViewBox: string | null = null;

  private _componentInitialized = false;

  private _pinch: Pinch;

  _scale: number;
  private _mapRect: any;
  private _elementRect: any;
  private _origin = { x: 0, y: 0 };
  private _x = 0;
  private _y = 0;
  private _vector: any;
  private _prevPosition: any = null;

  private _mouseDownHandler = this._handleDragStart.bind(this);
  private _mouseMoveHandler = this._handleDragMove.bind(this);
  private _mouseEndHandler = this._handleDragEnd.bind(this);

  private _touchStartHandler = this._handleTouchStart.bind(this);
  private _touchMoveHandler = this._handleTouchMove.bind(this);
  private _touchEndHandler = this._handleTouchEnd.bind(this);

  private _wheelEventSubscription: Subscription | null = null;
  private _pinchEventSubscription: Subscription | null = null;

  _zoomInButtonDisabled = false;
  _zoomOutButtonDisabled = false;

  _pins: any[] = [];
  _bullets: any[] = [];

  private _currentSelectedUnit: MdbMapUnit;

  private _overlayRef: OverlayRef | null = null;
  private _portal: TemplatePortal;
  _currentTooltipTitle = '';
  _currentTooltipContent = '';
  get _dragging(): boolean {
    return this._prevPosition !== null;
  }

  constructor(
    private _elementRef: ElementRef,
    private _overlay: Overlay,
    private _vcr: ViewContainerRef,
    private _zone: NgZone
  ) {}

  ngOnInit(): void {
    this._componentInitialized = true;
    this._initMap();

    if (this.selectedRegion) {
      this.select(this.selectedRegion);
    }
  }

  private _setupDragEvents() {
    this.svgElement.nativeElement.addEventListener('mousedown', this._mouseDownHandler);
    document.addEventListener('mouseup', this._mouseEndHandler);

    this.svgElement.nativeElement.addEventListener('touchstart', this._touchStartHandler);
    document.addEventListener('touchend', this._touchEndHandler);
  }

  private _initMap() {
    this._scale = this.scale;

    if (!this.customMapContent) {
      this._renderMap(this.map);
    } else {
      this.mapContentTemplate.nativeElement.innerHTML = this.customMapContent.innerHTML;
      this.customMapContent.parentNode!.removeChild(this.customMapContent);
    }

    this._cacheRectPositions();

    this._mapUnits = this._getMapUnits();

    this._setupUnitsParameters();
    this._setupUnitsEvents();

    this._setupMapPosition();
    this._setupMarkers();
    this._toggleZoomBtns();

    if (this.zoomEvents) {
      this._pinch = new Pinch(this.svgElement.nativeElement);
      this._pinch.init();
      this._setupWheelEvent();
      this._setupPinchEvent();
    }

    this._setupDragEvents();
  }

  private _updateMap() {
    this._removeEvents();

    if (this.mapContentTemplate) {
      // this.mapContentTemplate.nativeElement.innerHTML = '';
    }
    this._initMap();
  }

  private _renderMap(name: string) {
    const map = maps[name];

    if (!map) {
      throw new TypeError(`Map "${name}" is not available`);
    }

    const mapNode = parseToHTML(map).querySelector('svg');
    this._mapViewBox = mapNode.getAttribute('viewBox');

    this.mapContentTemplate.nativeElement.innerHTML = mapNode.innerHTML;
  }

  private _cacheRectPositions() {
    this._elementRect = this.wrapper.nativeElement.getBoundingClientRect();
    this._mapRect = this.svgElement.nativeElement.getBoundingClientRect();
  }

  private _getMapUnits() {
    return Array.from(this.svgElement.nativeElement.querySelectorAll('path')).map((path: any) => {
      const id = path.getAttribute('id');
      const title = path.getAttribute('title') || path.getAttribute('name');
      const d = path.getAttribute('d');
      const fill = path.getAttribute('fill');

      return {
        element: path,
        d,
        id,
        title,
        fill,
        selected: false,
        tooltip: '',
      };
    });
  }

  private _setupUnitsParameters() {
    this._mapUnits.forEach((unit) => {
      unit.fill = null;
      unit.element.removeAttribute('fill');
    });

    if (!this.colorMap.length) {
      return;
    }

    this.colorMap.forEach((map) => {
      map.regions.forEach((region) => {
        const tooltip = region.tooltip || '';
        const unit = this._mapUnits.find((unit) => {
          if (typeof region === 'string') {
            return unit.id === region;
          }

          return unit.id === region.id;
        });

        if (!unit) {
          return;
        }

        unit.fill = map.fill;
        unit.tooltip = tooltip;

        if (!unit.selected) {
          unit.element.setAttribute('fill', unit.fill);
        }
      });
    });
  }

  private _setupUnitsEvents() {
    this._mapUnits.forEach((unit) => {
      if (!this.readonly) {
        unit.element.addEventListener('click', () => this._handleUnitSelection(unit));
      }

      if (this.hover || this.tooltips) {
        unit.element.addEventListener('mouseover', (event) =>
          this._handleUnitMouseover(event, unit)
        );
        unit.element.addEventListener('mouseout', () => this._handleUnitMouseout(unit));
      }
    });
  }

  private _setupMapPosition() {
    this._origin = getElementCenter(this._mapRect);

    this._updateTransformOrigin();

    this._setInitialMapPosition();

    this._updateMapTransform();
  }

  private _setupMarkers() {
    const pins = [];
    const bullets = [];

    this.markers.forEach((marker) => {
      if (marker.type === 'pin') {
        const pin = this._getPin(marker);
        pins.push(pin);
      }

      if (marker.type === 'bullet') {
        const bullet = this._getBullet(marker);
        bullets.push(bullet);
      }
    });

    this._pins = [...pins];
    this._bullets = [...bullets];
  }

  private _getPin(pin: MdbMapMarker) {
    const innerRadius = (14 / this._scale) * 0.5;

    return {
      label: pin.label,
      x: pin.x,
      y: pin.y,
      d: this._getPinPath(pin.x, pin.y),
      radius: innerRadius / 2,
      innerRadius: innerRadius,
      innerY: pin.y - 54 / 2,
      circleFill: 'rgba(0, 0, 0, 0.2)',
      strokeWidth: pin.strokeWidth || this.strokeWidth,
      fill: pin.fill || this.markerFill,
      innerFill: pin.innerFill || this.markerInnerFill,
    };
  }

  private _getPinPath(x: number, y: number) {
    const height = 40;
    const radius = 14;
    const dyAC = height - radius;
    const alpha = Math.acos(radius / dyAC);
    const deltaX = radius * Math.sin(alpha);
    const deltaY = (height * (height - radius * 2)) / dyAC;
    return `M ${x},${y} l ${-deltaX},${-deltaY} A ${radius} ${radius} 1 1 1 ${x + deltaX},${
      y - deltaY
    } l 0,0 z`;
  }

  private _getBullet(bullet: MdbMapMarker) {
    const radius = bullet.radius || 5;

    return {
      label: bullet.label,
      radius: radius,
      strokeWidth: 0,
      fill: bullet.fill,
      x: bullet.x,
      y: bullet.y,
      opacity: 0.3,
      innerOpacity: 1,
    };
  }

  private _setupWheelEvent() {
    this._zone.runOutsideAngular(() => {
      fromEvent(this._elementRef.nativeElement, 'wheel').subscribe((event: any) => {
        event.preventDefault();

        const mousePosition = getEventCoordinates(event);

        const direction = event.deltaY < 0 ? 1 : -1;
        const factor = direction * this.zoomStep;

        if (!this._allowZoom(factor)) {
          return;
        }

        this._origin = this._getOrigin(mousePosition);

        this._updateTransformOrigin();

        this._setInitialMapPosition();

        this._updateMapTransform();

        this._zone.run(() => {
          this._zoom(factor);
        });
      });
    });
  }

  private _setupPinchEvent() {
    fromEvent(this._elementRef.nativeElement, 'pinch').subscribe((event: any) => {
      event.preventDefault();
      const factor = this._scale * (event.ratio - 1);
      if (!this._allowZoom(factor)) {
        return;
      }
      this._origin = this._getOrigin(event.origin);
      this._updateTransformOrigin();
      this._setInitialMapPosition();
      this._updateMapTransform();
      this._zoom(factor);
    });
  }

  _handlePinch(event: any) {
    const factor = this._scale * (event.overallVelocity + 1);

    if (!this._allowZoom(factor)) {
      return;
    }

    this._origin = this._getOrigin(event.target);

    this._updateTransformOrigin();

    this._setInitialMapPosition();

    this._updateMapTransform();

    this._zoom(factor);
  }

  private _allowZoom(factor: number) {
    return (
      !(this._scale === this.zoomMax && factor > 0) && !(this._scale === this.zoomMin && factor < 0)
    );
  }

  private _getOrigin(point) {
    const rect = this.svgElement.nativeElement.getBoundingClientRect();

    const position = {
      x: (point.x - rect.x) / this._scale,
      y: (point.y - rect.y) / this._scale,
    };

    const dx = (position.x - this._origin.x - this._x) / this._scale;
    const dy = (position.y - this._origin.y - this._y) / this._scale;

    const origin = {
      x: this._origin.x + dx,
      y: this._origin.y + dy,
    };

    return origin;
  }

  private _updateTransformOrigin() {
    this.svgElement.nativeElement.style.transformOrigin = `${this._origin.x}px ${this._origin.y}px`;
  }

  private _updateMapTransform() {
    this.svgElement.nativeElement.style.transform = `matrix(${this._scale}, 0, 0, ${this._scale}, ${this._x}, ${this._y})`;
  }

  _zoom(factor: number) {
    const value = this._scale + factor;

    if (value <= this.zoomMin) {
      this._scale = this.zoomMin;

      this._origin = this._getValueInMapBoundry(getElementCenter(this._elementRect));

      this._updateTransformOrigin();

      this._updateMapTransform();

      this._setInitialMapPosition();
    } else if (this.zoomMax !== null && value >= this.zoomMax) {
      this._scale = this.zoomMax;
    } else {
      this._scale = value;
    }

    this._toggleZoomBtns();

    this._updateMapTransform();

    // this._updateMarkers();

    this.svgElement.nativeElement.style.strokeWidth = this.strokeWidth / this._scale;
  }

  _getValueInMapBoundry({ x, y }) {
    this._cacheRectPositions();
    const margins = this._getMapMargins();

    let xPosition = this._x;
    let yPosition = this._y;

    if ((x < 0 && margins.right > 0) || (x > 0 && margins.left > 0)) {
      xPosition += x;
    }

    if ((y > 0 && margins.top > 0) || (y < 0 && margins.bottom > 0)) {
      yPosition += y;
    }

    return {
      x: xPosition,
      y: yPosition,
    };
  }

  _getMapMargins() {
    return {
      left: this._elementRect.left - this._mapRect.left,
      top: this._elementRect.top - this._mapRect.top,
      right: this._mapRect.right - this._elementRect.right,
      bottom: this._mapRect.bottom - this._elementRect.bottom,
    };
  }

  select(region: string) {
    const correspondingUnit = this._mapUnits.find((unit) => unit.id === region);

    if (correspondingUnit) {
      this._selectUnit(correspondingUnit);
    }
  }

  private _setInitialMapPosition() {
    this._x = 0;
    this._y = 0;
  }

  private _toggleZoomBtns() {
    if (this._scale === this.zoomMin) {
      this._zoomOutButtonDisabled = true;
    } else {
      this._zoomOutButtonDisabled = false;
    }

    if (this._scale === this.zoomMax) {
      this._zoomInButtonDisabled = true;
    } else {
      this._zoomInButtonDisabled = false;
    }
  }

  _selectUnit(unit: MdbMapUnit) {
    const selection = this._currentSelectedUnit;

    if (selection) {
      selection.selected = false;

      if (selection.fill) {
        selection.element.setAttribute('fill', selection.fill);
      } else {
        selection.element.removeAttribute('fill');
      }
    }

    unit.selected = true;
    unit.element.setAttribute('fill', this.selectFill);
    this._currentSelectedUnit = unit;
  }

  private _handleUnitSelection(unit: MdbMapUnit) {
    this._selectUnit(unit);
    this.selected.emit(unit);
  }

  _handleUnitMouseover(event: any, unit: MdbMapUnit) {
    if (this._dragging) {
      return;
    }

    if (this.hover) {
      unit.element.setAttribute('fill', this.hoverFill);
    }

    if (this.tooltips) {
      this._currentTooltipTitle = unit.title;
      this._currentTooltipContent = unit.tooltip !== '' ? unit.tooltip : null;
      this._showUnitTooltip(event, unit);
    }
  }

  _handleUnitMouseout(unit: MdbMapUnit) {
    if (this.hover) {
      if (unit.selected) {
        unit.element.setAttribute('fill', this.selectFill);
      } else if (unit.fill) {
        unit.element.setAttribute('fill', unit.fill);
      } else {
        unit.element.removeAttribute('fill');
      }
    }

    if (this.tooltips) {
      this._hideUnitTooltip();
    }
  }

  private _showUnitTooltip(event: any, unit: MdbMapUnit) {
    if (this._overlayRef) {
      this._overlayRef.dispose();
      this._overlayRef = null;
    }

    this._portal = new TemplatePortal(this.tooltipTemplate, this._vcr);

    this._overlayRef = this._overlay.create({
      positionStrategy: this._getOverlayPosition(event),
      panelClass: 'vector-map-pane',
    });

    this._overlayRef.attach(this._portal);
    const ref = this._overlayRef;

    this._zone.runOutsideAngular(() => {
      fromEvent(unit.element, 'mousemove')
        .pipe(takeUntil(ref.detachments()))
        .subscribe((event: any) => {
          const positionStrategy = this._overlay
            .position()
            .global()
            .left(event.clientX + TOOLTIP_OFFSET_X + 'px')
            .top(event.clientY + TOOLTIP_OFFSET_Y + 'px');
          this._overlayRef.updatePositionStrategy(positionStrategy);
        });
    });
  }

  private _hideUnitTooltip() {
    if (this._overlayRef) {
      this._overlayRef.detach();
      this._overlayRef.dispose();
      this._overlayRef = null;
    }
  }

  private _getOverlayPosition(event: any): PositionStrategy {
    const x = event.clientX + 'px';
    const y = event.clientY + 'px';
    const positionStrategy = this._overlay.position().global().left(x).top(y);

    return positionStrategy;
  }

  _handleDragStart(event: any) {
    if ((event.touches && event.touches.length > 1) || event.button === 2) {
      return;
    }

    this._prevPosition = getEventCoordinates(event);
    this.wrapper.nativeElement.classList.add('dragged');

    this._zone.runOutsideAngular(() => {
      document.addEventListener('mousemove', this._mouseMoveHandler);
    });
  }

  _handleDragMove(event: any) {
    if (event.touches && event.touches.length > 1) {
      return;
    }

    if (!this._prevPosition) {
      return;
    }

    event.preventDefault();

    const mousePosition = getEventCoordinates(event);
    const displacement = this._getValueInMapBoundry(
      getDisplacement(mousePosition, this._prevPosition)
    );

    this._x = displacement.x;
    this._y = displacement.y;

    this._prevPosition = mousePosition;

    this._updateMapTransform();

    // this._updateMarkerTooltips();
  }

  _handleDragEnd() {
    this._prevPosition = null;

    this.wrapper.nativeElement.classList.remove('dragged');
  }

  _handleTouchStart(event: any) {
    if (event.touches.length > 1) {
      this._vector = getVector(event);

      this._origin = { ...this._vector.center };

      this._updateTransformOrigin();

      return;
    }

    this._handleDragStart(event);

    this.svgElement.nativeElement.addEventListener('touchmove', this._touchMoveHandler);
  }

  _handleTouchMove(event: any) {
    if (event.touches.length > 1 && this._vector) {
      event.preventDefault();
      event.stopPropagation();

      const vector = getVector(event);

      const ratio = vector.length / this._vector.length;
      const scaleFactor = this._scale * (ratio - 1);

      this._zoom(scaleFactor);

      this._vector = vector;
      return;
    }
    this._handleDragMove(event);
  }

  _handleTouchEnd(event: any) {
    if (event.touches.length > 1) {
      this._vector = null;
      return;
    }
    this._handleDragEnd();
  }

  ngOnDestroy() {
    this._removeEvents();

    if (this._pinch) {
      this._pinch.dispose();
    }

    if (this._overlayRef) {
      this._overlayRef.detach();
      this._overlayRef.dispose();
      this._overlayRef = null;
    }
  }

  private _removeEvents() {
    if (this.svgElement) {
      this.svgElement.nativeElement.removeEventListener('mousedown', this._mouseDownHandler);
      document.removeEventListener('mousemove', this._mouseMoveHandler);
      document.removeEventListener('mouseup', this._mouseEndHandler);

      this.svgElement.nativeElement.removeEventListener('touchstart', this._touchStartHandler);
      document.removeEventListener('touchmove', this._touchMoveHandler);
      document.removeEventListener('touchend', this._touchEndHandler);
    }

    if (this._wheelEventSubscription) {
      this._wheelEventSubscription.unsubscribe();
    }

    if (this._pinchEventSubscription) {
      this._pinchEventSubscription.unsubscribe();
    }
  }

  _getAnimateValue(radius: number) {
    return `${radius / this._scale}; ${(radius / this._scale) * 5}; ${radius / this._scale}`;
  }

  _emitMarkerClick(type: 'pin' | 'bullet', x: number, y: number, label: string) {
    this.markerClick.emit({
      type: type,
      x: x,
      y: y,
      label: label,
    });
  }
}
