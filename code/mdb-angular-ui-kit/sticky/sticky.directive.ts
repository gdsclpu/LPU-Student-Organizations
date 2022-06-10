import {
  AfterContentInit,
  Directive,
  ElementRef,
  EventEmitter,
  Input,
  NgZone,
  OnDestroy,
  Output,
  Renderer2,
} from '@angular/core';
import { fromEvent, Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import {
  MdbStickyPosition,
  MdbStickyDirection,
  MdbStickyOffset,
  MdbStickyElementStyles,
  MdbStickyStyles,
} from './sticky.types';

@Directive({
  // tslint:disable-next-line: directive-selector
  selector: '[mdbSticky]',
  exportAs: 'mdbSticky',
})
// tslint:disable-next-line:component-class-suffix
export class MdbStickyDirective implements AfterContentInit, OnDestroy {
  @Input()
  get stickyMedia(): number {
    return this._stickyMedia;
  }
  set stickyMedia(value: number) {
    this._stickyMedia = value;
  }

  @Input()
  get stickyDirection(): MdbStickyDirection {
    return this._stickyDirection;
  }
  set stickyDirection(value: MdbStickyDirection) {
    this._stickyDirection = value;
  }

  @Input()
  get stickyDelay(): number {
    return this._stickyDelay;
  }
  set stickyDelay(value: number) {
    this._stickyDelay = value;
  }

  @Input()
  get stickyPosition(): MdbStickyPosition {
    return this._stickyPosition;
  }
  set stickyPosition(value: MdbStickyPosition) {
    this._stickyPosition = value;
  }

  @Input()
  get stickyActiveClass(): string {
    return this._stickyActiveClass;
  }
  set stickyActiveClass(value: string) {
    this._stickyActiveClass = value;
  }

  @Input()
  get stickyOffset(): number {
    return this._stickyOffset;
  }
  set stickyOffset(value: number) {
    this._stickyOffset = value;
  }

  @Input()
  get stickyBoundary(): HTMLElement {
    return this._stickyBoundary;
  }
  set stickyBoundary(value: HTMLElement) {
    this._stickyBoundary = value;
  }

  @Output() active: EventEmitter<void> = new EventEmitter();
  @Output() inactive: EventEmitter<void> = new EventEmitter();
  @Output() startInactive: EventEmitter<void> = new EventEmitter();

  private _stickyMedia = 0;
  private _manuallyDeactivated = false;
  private _stickyDirection: MdbStickyDirection = 'down';
  private _stickyDelay = 0;
  private _stickyPosition: MdbStickyPosition = 'top';
  private _stickyActiveClass: string;
  private _stickyOffset = 0;
  private _stickyBoundary: HTMLElement;

  private _scrollDirection: string;
  private _pushPoint: number;
  private _elementPositionStyles: MdbStickyElementStyles = {};
  private _scrollTop = 0;
  private _hiddenElement: HTMLElement;
  private _elementOffsetTop = 0;

  isSticked = false;

  readonly _destroy$: Subject<void> = new Subject<void>();

  constructor(
    private _elementRef: ElementRef,
    private _renderer: Renderer2,
    private _ngZone: NgZone
  ) {}

  ngAfterContentInit(): void {
    this._ngZone.runOutsideAngular(() => {
      fromEvent(window, 'resize')
        .pipe(takeUntil(this._destroy$))
        .subscribe(() => {
          this._updateElementPosition();
          this._updateElementOffset();
        });
      fromEvent(window, 'scroll')
        .pipe(takeUntil(this._destroy$))
        .subscribe(() => {
          if (window.innerWidth <= this.stickyMedia) {
            return;
          }

          if (this._manuallyDeactivated) {
            return;
          }

          const doc = document.documentElement;
          const scrollTop = window.pageYOffset || doc.scrollTop;

          this._updateElementOffset();
          this._updatePushPoint();
          this._updateScrollDirection(scrollTop);

          const isCorrectScrollDirection = [this._scrollDirection, 'both'].includes(
            this.stickyDirection
          );
          const isPushPointReached = this._pushPoint <= scrollTop;

          const shouldBeSticky = isPushPointReached && !this.isSticked && isCorrectScrollDirection;
          const shouldNotBeSticky =
            (!isPushPointReached || !isCorrectScrollDirection) && this.isSticked;

          if (shouldBeSticky) {
            this._createHiddenElement();
            this._enableSticky();
            this._changeBoundaryPosition();
            this.isSticked = true;
          }

          if (shouldNotBeSticky) {
            this._disableSticky();
            this.isSticked = false;
          }

          if (this.isSticked) {
            this._updatePosition(this._elementPositionStyles);
            this._changeBoundaryPosition();
          }

          this._scrollTop = scrollTop <= 0 ? 0 : scrollTop;
        });
    });
  }

  ngOnDestroy(): void {
    this._destroy$.next();
    this._destroy$.complete();
  }

  private _updateElementOffset(): void {
    if (this._hiddenElement) {
      this._elementOffsetTop = this._hiddenElement.offsetTop;
    } else {
      this._elementOffsetTop = this._elementRef.nativeElement.offsetTop;
    }
  }

  private _updatePushPoint(): void {
    if (this.stickyPosition === 'top') {
      this._pushPoint = this._elementOffsetTop - this.stickyDelay;
    } else {
      this._pushPoint =
        this._elementOffsetTop +
        this._elementRef.nativeElement.height -
        document.body.scrollHeight +
        this.stickyDelay;
    }
  }

  private _updateScrollDirection(scrollTop: number): void {
    if (scrollTop > this._scrollTop) {
      this._scrollDirection = 'down';
    } else {
      this._scrollDirection = 'up';
    }
  }

  private _createHiddenElement(): void {
    if (!this._hiddenElement) {
      this._hiddenElement = this._copyElement(this._elementRef.nativeElement);
    }
  }

  private _copyElement(itemToCopy: HTMLElement): HTMLElement {
    const { height, width } = itemToCopy.getBoundingClientRect();
    const COPIED_ITEM = itemToCopy.cloneNode(false) as HTMLElement;
    COPIED_ITEM.hidden = true;

    this._setStyle(COPIED_ITEM, {
      height: `${height}px`,
      width: `${width}px`,
      opacity: '0',
    });

    itemToCopy.parentElement.insertBefore(COPIED_ITEM, itemToCopy);

    return COPIED_ITEM;
  }

  private _setStyle(element: HTMLElement, styles: MdbStickyStyles): void {
    Object.keys(styles).forEach((style) => {
      this._renderer.setStyle(element, style, styles[style]);
    });
  }

  private _enableSticky(): void {
    const { height, left, width } = this._elementRef.nativeElement.getBoundingClientRect();

    this._toggleClass(this.stickyActiveClass, '', this._elementRef.nativeElement);

    this._setStyle(this._elementRef.nativeElement, {
      top: this.stickyPosition === 'top' && `${0 + this.stickyOffset}px`,
      bottom: this.stickyPosition === 'bottom' && `${0 + this.stickyOffset}px`,
      height: `${height}px`,
      width: `${width}px`,
      left: `${left}px`,
      zIndex: '100',
      position: 'fixed',
    });

    this._hiddenElement.hidden = false;

    this.active.emit();
  }

  private _toggleClass(addClass: string, removeClass: string, target: HTMLElement): void {
    if (addClass) {
      this._renderer.addClass(target, addClass);
    }

    if (removeClass) {
      this._renderer.removeClass(target, removeClass);
    }
  }

  private _changeBoundaryPosition(): void {
    const { height } = this._elementRef.nativeElement.getBoundingClientRect();
    const parentOffset = {
      height: this._elementRef.nativeElement.parentElement.getBoundingClientRect().height,
      ...this._getOffset(this._elementRef.nativeElement.parentElement),
    };

    let stopPoint: number;

    if (this._elementRef.nativeElement.parentElement === this.stickyBoundary) {
      stopPoint =
        parentOffset.height + parentOffset[this.stickyPosition] - height - this.stickyOffset;
    } else {
      stopPoint = this._getOffset(this.stickyBoundary).top - height - this.stickyOffset;
    }

    const isStickyTop = this.stickyPosition === 'top';
    const isStickyBottom = this.stickyPosition === 'bottom';
    const isBelowStopPoint = stopPoint < 0;
    const isBelowParentElementEnd = stopPoint > parentOffset.height - height;
    let elementStyle: MdbStickyStyles;

    if (isStickyTop) {
      if (isBelowStopPoint) {
        elementStyle = { top: `${this.stickyOffset + stopPoint}px` };
      } else {
        elementStyle = { top: `${this.stickyOffset + 0}px` };
      }
    }

    if (isStickyBottom) {
      if (isBelowStopPoint) {
        elementStyle = { bottom: `${this.stickyOffset + stopPoint}px` };
      } else if (isBelowParentElementEnd) {
        elementStyle = { bottom: `${this.stickyOffset + parentOffset.bottom}px` };
      } else {
        elementStyle = { bottom: `${this.stickyOffset + 0}px` };
      }
    }

    this._setStyle(this._elementRef.nativeElement, elementStyle);
  }

  private _getOffset(element: HTMLElement): MdbStickyOffset {
    const rectElement = element.getBoundingClientRect();
    const offsetElement = {
      top: rectElement.top + document.body.scrollTop,
      left: rectElement.left + document.body.scrollLeft,
    };

    const bottom =
      offsetElement.left === 0 && offsetElement.top === 0
        ? 0
        : window.innerHeight - rectElement.bottom;

    return {
      ...offsetElement,
      bottom,
    };
  }

  private _disableSticky(): void {
    this.startInactive.emit();

    const animationDuration = parseFloat(
      getComputedStyle(this._elementRef.nativeElement).animationDuration
    );

    setTimeout(() => {
      this._resetStyles();
      this._removeHiddenElement();
      this._toggleClass('', this.stickyActiveClass, this._elementRef.nativeElement);

      this.inactive.emit();
    }, animationDuration);
  }

  private _resetStyles(): void {
    this._setStyle(this._elementRef.nativeElement, {
      top: null,
      bottom: null,
      position: null,
      left: null,
      zIndex: null,
      width: null,
      height: null,
    });
  }

  private _removeHiddenElement(): void {
    if (!this._hiddenElement) {
      return;
    }

    this._hiddenElement.remove();
    this._hiddenElement = null;
  }

  private _updatePosition(styles: MdbStickyStyles): void {
    this._setStyle(this._elementRef.nativeElement, styles);
  }

  private _updateElementPosition(): void {
    if (this._hiddenElement) {
      const { left } = this._hiddenElement.getBoundingClientRect();

      this._elementPositionStyles = {
        left: `${left}px`,
      };
    } else {
      this._elementPositionStyles = {};
    }

    this._setStyle(this._elementRef.nativeElement, this._elementPositionStyles);
  }
}
