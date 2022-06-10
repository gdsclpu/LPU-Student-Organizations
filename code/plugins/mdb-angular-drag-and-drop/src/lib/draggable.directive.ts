import {
  Directive,
  Input,
  EventEmitter,
  Output,
  NgZone,
  ElementRef,
  OnInit,
  Optional,
  SkipSelf,
  Inject,
  InjectionToken,
  OnDestroy,
  HostBinding,
} from '@angular/core';
import { fromEvent, merge, Subject, Observable } from 'rxjs';
import { takeUntil, tap, first, filter, switchMap } from 'rxjs/operators';
import { Position, Boundaries } from './types';
import { MdbSortableContainerDirective } from './sortable-container.directive';
import { cloneNode, destroyNode } from './utilities';

export const MDB_DRAGGABLE_PARENT = new InjectionToken<{}>('MDB_DRAGGABLE_PARENT');

@Directive({
  // eslint-disable-next-line @angular-eslint/directive-selector
  selector: '[mdbDraggable]',
  providers: [{ provide: MDB_DRAGGABLE_PARENT, useExisting: MdbDraggableDirective }],
})
export class MdbDraggableDirective implements OnInit, OnDestroy {
  @Input() copy = false;
  @Input() data: any;

  @HostBinding('class.draggable-disabled')
  @Input()
  disabled = false;
  @Input()
  get boundaryElement() {
    return this._boundaryElement;
  }
  set boundaryElement(value: any) {
    if (typeof value === 'string') {
      this._boundaryElement = this._getHtmlElement(value);
    } else {
      this._boundaryElement = value;
    }
  }
  private _boundaryElement: HTMLElement;
  @Input()
  get handle() {
    return this._handle;
  }
  set handle(value: any) {
    if (typeof value === 'string') {
      this._handle = this._getHtmlElement(value);
    } else {
      this._handle = value;
    }
  }
  private _handle: HTMLElement;

  @Input() lockAxis: 'x' | 'y' | null = null;
  @Input() autoScroll = false;
  @Input() scrollSpeed = 25;
  @Input() scrollSensitivity = 30;
  @Input() delay = 0;
  @Input() threshold = 0;

  @Output() dragStart = new EventEmitter<HTMLElement>();
  @Output() dragEnd = new EventEmitter<HTMLElement>();

  // @HostBinding('class.draggable') draggable = true;
  @HostBinding('class.draggable-dragging')
  get isMoving() {
    return this._isMoving;
  }

  private _placeholder: HTMLElement;
  private _helper: HTMLElement;
  private _tempElement: HTMLElement;

  private _hostPosition: Position = { x: 0, y: 0 };
  private _startPosition: Position = { x: 0, y: 0 };
  private _startTransform: Position = { x: 0, y: 0 };
  private _pickUpPosition: Position;

  private _draggingStartTime: number;

  private _isDragging = false;
  private _isMoving = false;

  private _pointerDown$: Observable<any>;
  private _pointerMove$: Observable<any>;
  private _pointerUp$: Observable<any>;

  private _boundaries: Boundaries | null = null;

  private _destroy$ = new Subject<void>();

  _sortableContainer: MdbSortableContainerDirective | null = null;
  _originalContainer: MdbSortableContainerDirective | null = null;
  private _originalContainerRect: any;
  private _startIndex: number;

  constructor(
    private _elementRef: ElementRef,
    private _ngZone: NgZone,
    @Optional()
    @SkipSelf()
    @Inject(MDB_DRAGGABLE_PARENT)
    private _draggableParent?: MdbDraggableDirective
  ) {}

  ngOnInit(): void {
    const target = this.handle ? this.handle : this._elementRef.nativeElement;
    this._setupEvents(target);
    this._subscribeToEvents();
  }

  ngOnDestroy(): void {
    this._destroy$.next();
    this._destroy$.complete();
  }

  private _setupEvents(element: HTMLElement) {
    this._pointerDown$ = merge(
      fromEvent(element, 'mousedown', { passive: false }),
      fromEvent(element, 'touchstart', { passive: false })
    );

    this._pointerMove$ = merge(
      fromEvent(document, 'mousemove', { passive: false }),
      fromEvent(document, 'touchmove', { passive: false })
    );

    this._pointerUp$ = merge(
      fromEvent(document, 'mouseup', { passive: false }),
      fromEvent(document, 'touchend', { passive: false })
    );
  }

  _getHost(): HTMLElement {
    return this._elementRef.nativeElement;
  }

  _getPlaceholder(): HTMLElement {
    return this._placeholder;
  }

  private _subscribeToEvents() {
    this._ngZone.runOutsideAngular(() => {
      const drag$ = this._pointerDown$.pipe(
        filter((startEvent: any) => startEvent.button !== 2 && !this.disabled),
        switchMap((event: any) => {
          this._handleDragStart(event);
          return this._pointerMove$.pipe(
            tap((moveEvent: any) => {
              this._handleDragMove(moveEvent);
            }),
            takeUntil(this._pointerUp$)
          );
        }),
        takeUntil(this._destroy$)
      );

      const drop$ = this._pointerDown$.pipe(
        switchMap(() => {
          return this._pointerUp$.pipe(
            first(),
            tap(() => {
              this._handleDragEnd();
            })
          );
        }),
        takeUntil(this._destroy$)
      );

      drag$.subscribe();
      drop$.subscribe();
    });
  }

  private _handleDragStart(event: any): void {
    if (this._isDragging || this._isMoving) {
      return;
    }

    if (this._draggableParent) {
      event.stopPropagation();
    }

    this._isDragging = true;
    this._draggingStartTime = Date.now();

    const hostRect = this._elementRef.nativeElement.getBoundingClientRect();

    this._pickUpPosition = this._getPosition(event);
    this._startPosition.x = this._pickUpPosition.x - hostRect.left;
    this._startPosition.y = this._pickUpPosition.y - hostRect.top;

    if (this._boundaryElement) {
      this._measureBoundaries();
    }

    if (this._sortableContainer) {
      this._sortableContainer._onDragStart();
      this._originalContainer = this._sortableContainer;
      this._originalContainerRect = this._originalContainer.element.getBoundingClientRect();
      this._startIndex = this._sortableContainer._getDraggableIndex(this);
    }
  }

  private _getHtmlElement(selector: string): HTMLElement {
    return document.querySelector(selector);
  }

  private _measureBoundaries() {
    const viewRect = this._boundaryElement.getBoundingClientRect();
    const hostRect = this._elementRef.nativeElement.getBoundingClientRect();

    this._boundaries = {
      minX: viewRect.left - hostRect.left + this._hostPosition.x,
      maxX: viewRect.right - hostRect.right + this._hostPosition.x,
      minY: viewRect.top - hostRect.top + this._hostPosition.y,
      maxY: viewRect.bottom - hostRect.bottom + this._hostPosition.y,
    };
  }

  private _handleDragMove(event: any): void {
    const currentPosition = this._getPosition(event);
    const distanceX = Math.abs(currentPosition.x - this._pickUpPosition.x);
    const distanceY = Math.abs(currentPosition.y - this._pickUpPosition.y);

    if (!this._isMoving) {
      const isOverThreshold = distanceX + distanceY >= this.threshold;

      if (this._pickUpPosition && isOverThreshold) {
        const isAfterDelay = Date.now() - this._draggingStartTime >= this.delay;

        if (!isAfterDelay) {
          return;
        }

        event.preventDefault();

        this._ngZone.run(() => {
          this._isMoving = true;
        });

        if (this._sortableContainer) {
          this._ngZone.run(() => {
            this._initSortableElements();
          });
        }
      }

      return;
    }

    event.preventDefault();

    this._hostPosition.x = currentPosition.x - this._pickUpPosition.x + this._startTransform.x;
    this._hostPosition.y = currentPosition.y - this._pickUpPosition.y + this._startTransform.y;

    if (this._boundaries) {
      this._applyBoundaries(this._boundaries);
    }

    if (this.lockAxis === 'x') {
      this._hostPosition.x = 0;
    }

    if (this.lockAxis === 'y') {
      this._hostPosition.y = 0;
    }

    if (this.autoScroll && !this._sortableContainer) {
      this._updateScrollPosition();
    }

    if (this._sortableContainer) {
      const originalContainer = this._originalContainer;
      const currentContainer = this._sortableContainer;
      const { x, y } = currentPosition;

      let newContainer = originalContainer._getContainerFromCoordinates(this, x, y);

      const isPointerOverOriginalContainer =
        !newContainer &&
        this._sortableContainer !== originalContainer &&
        originalContainer._isPointerOverItem(this._originalContainerRect, x, y);

      if (isPointerOverOriginalContainer) {
        newContainer = originalContainer;
      }

      if (newContainer && newContainer !== this._sortableContainer) {
        currentContainer._handleItemLeave(this);
        newContainer._handleItemEnter(this, currentPosition.x, currentPosition.y);

        this._sortableContainer = newContainer;
      }

      if (!this.copy) {
        originalContainer._initSortingEvents(this);
      }

      this._updatePosition(
        this._helper,
        currentPosition.x - this._startPosition.x,
        currentPosition.y - this._startPosition.y
      );
    } else {
      this._updatePosition(
        this._elementRef.nativeElement,
        this._hostPosition.x,
        this._hostPosition.y
      );
    }
  }

  private _initSortableElements() {
    const tempElement = this._createTempElement();
    const host = this._elementRef.nativeElement;
    const hostParent = this._elementRef.nativeElement.parentNode;

    hostParent.insertBefore(tempElement, host);

    const placeholder = (this._placeholder = this._createPlaceholder());
    const helper = (this._helper = this._createHelper());

    this._elementRef.nativeElement.style.display = 'none';
    document.body.appendChild(hostParent.replaceChild(placeholder, host));
    document.body.appendChild(helper);
  }

  private _createTempElement(): HTMLElement {
    const tempElement = (this._tempElement = this._tempElement || document.createElement('div'));
    tempElement.style.display = 'none';

    return tempElement;
  }

  private _getPosition(event: any) {
    const point = this._isTouchEvent(event) ? event.touches[0] || event.changedTouches[0] : event;
    const scrollPosition = this._getDocumentScrollPosition();

    return {
      x: point.pageX - scrollPosition.left,
      y: point.pageY - scrollPosition.top,
    };
  }

  private _isTouchEvent(event: MouseEvent | TouchEvent): boolean {
    return event.type.startsWith('touch');
  }

  private _getDocumentScrollPosition() {
    const documentElement = document.documentElement;
    const body = document.body;

    const top = documentElement.scrollTop || body.scrollTop;
    const left = documentElement.scrollLeft || body.scrollLeft;

    return { top, left };
  }

  private _applyBoundaries(boundaries: Boundaries) {
    this._hostPosition.x = Math.max(boundaries.minX, this._hostPosition.x);
    this._hostPosition.x = Math.min(boundaries.maxX, this._hostPosition.x);
    this._hostPosition.y = Math.max(boundaries.minY, this._hostPosition.y);
    this._hostPosition.y = Math.min(boundaries.maxY, this._hostPosition.y);
  }

  private _updateScrollPosition() {
    const hostRect = this._elementRef.nativeElement.getBoundingClientRect();

    const height = document.documentElement.clientHeight;
    const width = document.documentElement.clientWidth;

    if (hostRect.top < this.scrollSensitivity) {
      document.documentElement.scrollTop -= this.scrollSpeed;
    }

    if (hostRect.top + hostRect.height > height - this.scrollSensitivity) {
      document.documentElement.scrollTop += this.scrollSpeed;
    }

    if (hostRect.left < this.scrollSensitivity) {
      document.documentElement.scrollLeft -= this.scrollSpeed;
    }

    if (hostRect.left + hostRect.width > width - this.scrollSensitivity) {
      document.documentElement.scrollLeft += this.scrollSpeed;
    }
  }

  private _updatePosition(element: HTMLElement, x: number, y: number) {
    const position = this._getTransform(x, y);
    element.style.transform = position;
  }

  private _getTransform(x: number, y: number): string {
    return `translate3d(${Math.round(x)}px, ${Math.round(y)}px, 0)`;
  }

  private _handleDragEnd(): void {
    if (!this._isMoving) {
      return;
    }

    if (this._sortableContainer) {
      const placeholderRect = this._placeholder.getBoundingClientRect();
      this._helper.classList.add('draggable-animating');
      this._updatePosition(this._helper, placeholderRect.left, placeholderRect.top);

      setTimeout(() => {
        this._elementRef.nativeElement.style.display = '';
        this._tempElement.parentNode.replaceChild(
          this._elementRef.nativeElement,
          this._tempElement
        );
        this._destroyHelper();
        this._destroyPlaceholder();

        this._ngZone.run(() => {
          const previousIndex = this._startIndex;
          const newIndex = this._sortableContainer._getDraggableIndex(this);
          const previousContainer = this._originalContainer;
          const newContainer = this._sortableContainer;

          this._sortableContainer._onDragEnd();
          this._originalContainer._onDragEnd();
          this._originalContainer._emitDropEvent(
            this,
            previousContainer,
            newContainer,
            previousIndex,
            newIndex
          );
          this._sortableContainer = this._originalContainer;
        });
      }, 351);
    } else {
      this._startTransform.x = this._hostPosition.x;
      this._startTransform.y = this._hostPosition.y;
    }

    this._ngZone.run(() => {
      this._isMoving = false;
      this._isDragging = false;
    });
  }

  private _destroyHelper() {
    if (this._helper) {
      destroyNode(this._helper);
    }

    this._helper = null;
  }

  private _destroyPlaceholder() {
    if (this._placeholder) {
      destroyNode(this._placeholder);
    }

    this._placeholder = null;
  }

  private _createPlaceholder(): HTMLElement {
    const placeholder = cloneNode(this._elementRef.nativeElement);
    placeholder.style.visibility = 'hidden';
    placeholder.classList.add('draggable-placeholder');
    return placeholder;
  }

  private _createHelper(): HTMLElement {
    const helper = cloneNode(this._elementRef.nativeElement);
    const hostRect = this._elementRef.nativeElement.getBoundingClientRect();

    if (this.copy) {
      helper.style.opacity = '0.5';
    }

    helper.style.pointerEvents = 'none';
    helper.style.position = 'fixed';
    helper.style.top = '0';
    helper.style.left = '0';
    helper.style.margin = '0';
    helper.style.width = `${hostRect.width}px`;
    helper.style.height = `${hostRect.height}px`;
    helper.style.transform = this._getTransform(hostRect.left, hostRect.top);
    helper.classList.add('draggable-helper');

    return helper;
  }
}
