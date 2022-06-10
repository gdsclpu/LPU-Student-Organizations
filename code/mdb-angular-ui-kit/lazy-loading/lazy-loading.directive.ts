import {
  Directive,
  ElementRef,
  EventEmitter,
  Input,
  NgZone,
  OnDestroy,
  OnInit,
  Output,
  Renderer2,
} from '@angular/core';
import { fromEvent, Subscription } from 'rxjs';
import { take } from 'rxjs/operators';
import { isImage, isVideo } from './lazy-loading.utils';

@Directive({
  selector: '[mdbLazyLoading]',
})
export class MdbLazyLoadingDirective implements OnInit, OnDestroy {
  @Input() offset = 0;
  @Input() loadingPlaceholder: string;
  @Input() errorPlaceholder: string;
  @Input() container: HTMLElement;
  @Input() delay = 0;

  @Output() loadingStart: EventEmitter<void> = new EventEmitter<void>();
  @Output() loadingEnd: EventEmitter<void> = new EventEmitter<void>();
  @Output() loadingError: EventEmitter<void> = new EventEmitter<void>();

  private _scrollSubscription: Subscription;

  constructor(
    private _elementRef: ElementRef,
    private _renderer: Renderer2,
    private _ngZone: NgZone
  ) {}

  get host(): HTMLElement {
    return this._elementRef.nativeElement;
  }

  ngOnInit(): void {
    this._initObserver();

    if (this.loadingPlaceholder) {
      this._setPlaceholder(this.host, this.loadingPlaceholder);
    }
  }

  ngOnDestroy(): void {
    if (this._scrollSubscription) {
      this._scrollSubscription.unsubscribe();
    }
  }

  private _initObserver(): void {
    const target = this.container || window;

    this._ngZone.runOutsideAngular(() => {
      this._scrollSubscription = fromEvent(target, 'scroll').subscribe(() => {
        this._handleScroll();
      });
    });
  }

  private _handleScroll(): void {
    if (this._isInViewport()) {
      this._ngZone.run(() => {
        this._lazyLoad(this.host);
      });
    }
  }

  private _isInViewport(): boolean {
    const elementRect = this.host.getBoundingClientRect();

    if (this.container) {
      const containerRect = this.container.getBoundingClientRect();
      return (
        containerRect.y > 0 &&
        containerRect.y < window.innerHeight &&
        elementRect.y >= containerRect.y &&
        elementRect.y <= containerRect.y + containerRect.height &&
        elementRect.y <= window.innerHeight
      );
    }

    return elementRect.top + this.offset <= window.innerHeight && elementRect.bottom >= 0;
  }

  private _lazyLoad(element: HTMLElement) {
    this._scrollSubscription.unsubscribe();
    this.loadingStart.emit();

    setTimeout(() => {
      if (isImage(element)) {
        this._loadImage(element as HTMLImageElement);
      } else if (isVideo(element)) {
        this._loadVideo(element as HTMLVideoElement);
      }
    }, this.delay);
  }

  private _loadImage(element: HTMLImageElement) {
    if (!element.dataset.src) {
      this.loadingError.emit();

      if (this.errorPlaceholder) {
        this._setPlaceholder(element, this.errorPlaceholder);
      }

      return;
    }

    this._handleLoadingEvents(element);

    this._renderer.setAttribute(element, 'src', element.dataset.src);
    this._renderer.removeAttribute(element, 'data-src');
  }

  private _loadVideo(element: HTMLVideoElement) {
    if (!element.dataset.src) {
      this.loadingError.emit();

      if (this.errorPlaceholder) {
        this._setPlaceholder(element, this.errorPlaceholder);
      }

      return;
    }

    this._handleLoadingEvents(element);

    this._renderer.setAttribute(element, 'src', element.dataset.src);
    this._renderer.removeAttribute(element, 'data-src');
    this._renderer.removeAttribute(element, 'poster');
  }

  private _handleLoadingEvents(element: HTMLElement) {
    fromEvent(element, 'load')
      .pipe(take(1))
      .subscribe(() => {
        this.loadingEnd.emit();
      });

    fromEvent(element, 'error')
      .pipe(take(1))
      .subscribe(() => {
        this.loadingError.emit();

        if (this.errorPlaceholder) {
          this._setPlaceholder(element, this.errorPlaceholder);
        }
      });
  }

  private _setPlaceholder(element: any, placeholder: string): void {
    if (element.nodeName === 'IMG') {
      this._renderer.setAttribute(element, 'src', placeholder);
    } else if (element.nodeName === 'VIDEO') {
      this._renderer.setAttribute(element, 'poster', placeholder);
    }
  }
}
