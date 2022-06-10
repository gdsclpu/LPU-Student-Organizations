import PerfectScrollbar from 'perfect-scrollbar';
import {
  Directive,
  ElementRef,
  EventEmitter,
  Inject,
  Input,
  NgZone,
  OnDestroy,
  OnInit,
  Output,
  PLATFORM_ID,
} from '@angular/core';
import { fromEvent, Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { isPlatformBrowser } from '@angular/common';

@Directive({
  // eslint-disable-next-line @angular-eslint/directive-selector
  selector: '[mdbScrollbar]',
  exportAs: 'mdbScrollbar',
})
export class MdbScrollbarDirective implements OnInit, OnDestroy {
  @Input() config: any;

  @Output() scrollY: EventEmitter<any> = new EventEmitter<any>();
  @Output() scrollX: EventEmitter<any> = new EventEmitter<any>();

  @Output() scrollUp: EventEmitter<any> = new EventEmitter<any>();
  @Output() scrollDown: EventEmitter<any> = new EventEmitter<any>();
  @Output() scrollLeft: EventEmitter<any> = new EventEmitter<any>();
  @Output() scrollRight: EventEmitter<any> = new EventEmitter<any>();

  @Output() yReachEnd: EventEmitter<any> = new EventEmitter<any>();
  @Output() yReachStart: EventEmitter<any> = new EventEmitter<any>();
  @Output() xReachEnd: EventEmitter<any> = new EventEmitter<any>();
  @Output() xReachStart: EventEmitter<any> = new EventEmitter<any>();

  constructor(
    private _elementRef: ElementRef,
    private _ngZone: NgZone,
    // eslint-disable-next-line @typescript-eslint/ban-types
    @Inject(PLATFORM_ID) private platformId: Object
  ) {}

  private readonly _destroy: Subject<void> = new Subject();

  private _scrollbar: any | null = null;

  private _events = [
    { ps: 'ps-scroll-y', mdb: 'scrollY' },
    { ps: 'ps-scroll-x', mdb: 'scrollX' },
    { ps: 'ps-scroll-up', mdb: 'scrollUp' },
    { ps: 'ps-scroll-down', mdb: 'scrollDown' },
    { ps: 'ps-scroll-left', mdb: 'scrollLeft' },
    { ps: 'ps-scroll-right', mdb: 'scrollRight' },
    { ps: 'ps-y-reach-end', mdb: 'yReachEnd' },
    { ps: 'ps-y-reach-start', mdb: 'yReachStart' },
    { ps: 'ps-x-reach-end', mdb: 'xReachEnd' },
    { ps: 'ps-x-reach-start', mdb: 'xReachStart' },
  ];

  private _defaultConfig = {
    handlers: ['click-rail', 'drag-thumb', 'keyboard', 'wheel', 'touch'],
    wheelSpeed: 1,
    wheelPropagation: true,
    swipeEasing: true,
    minScrollbarLength: null,
    maxScrollbarLength: null,
    scrollingThreshold: 1000,
    useBothWheelAxes: false,
    suppressScrollX: false,
    suppressScrollY: false,
    scrollXMarginOffset: 0,
    scrollYMarginOffset: 0,
  };

  ngOnInit(): void {
    if (isPlatformBrowser(this.platformId)) {
      this._initScrollbar();
      this._bindEvents();
    }
  }

  ngOnDestroy(): void {
    this._destroyScrollbar();
    this._destroy.next();
    this._destroy.complete();
  }

  private _initScrollbar(): void {
    const config = this.config
      ? Object.assign(this._defaultConfig, this.config)
      : this._defaultConfig;

    this._ngZone.runOutsideAngular(() => {
      this._scrollbar = new PerfectScrollbar(this._elementRef.nativeElement, config);
    });
  }

  private _bindEvents(): void {
    this._ngZone.runOutsideAngular(() => {
      this._events.forEach((eventName: any) => {
        fromEvent<Event>(this._elementRef.nativeElement, eventName.ps)
          .pipe(takeUntil(this._destroy))
          .subscribe((event: Event) => {
            this[eventName.mdb].emit(event);
          });
      });
    });
  }

  private _destroyScrollbar(): void {
    this._ngZone.runOutsideAngular(() => {
      if (this._scrollbar) {
        this._scrollbar.destroy();
      }
    });
    this._scrollbar = null;
  }
}
