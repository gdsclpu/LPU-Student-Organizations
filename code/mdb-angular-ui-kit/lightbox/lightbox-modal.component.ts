import { animate, keyframes, style, transition, trigger } from '@angular/animations';
import { ConfigurableFocusTrap, ConfigurableFocusTrapFactory } from '@angular/cdk/a11y';
import { DOCUMENT } from '@angular/common';
import {
  Component,
  AfterViewInit,
  ChangeDetectionStrategy,
  ViewChild,
  QueryList,
  Renderer2,
  Inject,
  forwardRef,
  ElementRef,
  ChangeDetectorRef,
  HostListener,
  OnDestroy,
} from '@angular/core';
import { fromEvent } from 'rxjs';
import { take } from 'rxjs/operators';
import { MdbLightboxItemDirective } from './lightbox-item.directive';
import { MdbLightboxComponent } from './lightbox.component';

@Component({
  selector: 'mdb-lightbox-modal',
  templateUrl: './lightbox-modal.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  animations: [
    trigger('fade', [
      transition(':enter', [
        style({ opacity: 0 }),
        animate(
          '1500ms',
          keyframes([
            style({ opacity: 0, transform: 'scale3d(0.3, 0.3, 0.3)', offset: 0, easing: 'ease' }),
            style({ opacity: 1, transform: 'scale3d(1, 1, 1)', offset: 0.5, easing: 'ease' }),
          ])
        ),
      ]),
      transition(':leave', [
        style({ opacity: 1 }),
        animate(
          '1500ms',
          keyframes([
            style({ opacity: 1, offset: 0 }),
            style({ opacity: 0, transform: 'scale3d(0.3, 0.3, 0.3)', offset: 0.5 }),
            style({ opacity: 0, offset: 1 }),
          ])
        ),
      ]),
    ]),
  ],
})
export class MdbLightboxModalComponent implements AfterViewInit, OnDestroy {
  @ViewChild('activeItem') activeItem: ElementRef;
  @ViewChild('activeItemWrapper') activeItemWrapper: ElementRef;
  @ViewChild('galleryToolbar') galleryToolbar: ElementRef;
  @ViewChild('btnPrevious') btnPrevious: ElementRef;
  @ViewChild('btnNext') btnNext: ElementRef;
  @ViewChild('rightArrow') rightArrow: ElementRef;
  @ViewChild('leftArrow') leftArrow: ElementRef;
  @ViewChild('btnFullsreen') btnFullsreen: ElementRef;
  @ViewChild('btnZoom') btnZoom: ElementRef;
  @ViewChild('loader') loader: ElementRef;

  @HostListener('mousemove')
  onHostMousemove(): void {
    this._resetToolsToggler();
  }

  @HostListener('keyup', ['$event'])
  onHostKeyup(event: KeyboardEvent): void {
    this._onKeyup(event);
  }

  @HostListener('click', ['$event.target'])
  onHostClick(target: HTMLElement): void {
    this._resetToolsToggler();

    if (target.tagName !== 'DIV') {
      return;
    }

    this.close();
  }

  lightbox: MdbLightboxComponent;
  lightboxItems: QueryList<MdbLightboxItemDirective>;
  activeLightboxItem: MdbLightboxItemDirective;
  zoomLevel: number;
  index: number;
  total: number;
  animationState = '';
  slideRight: boolean;

  private _slideTimer: ReturnType<typeof setTimeout>;
  private _toolsToggleTimer: ReturnType<typeof setTimeout>;
  private _zoomTimer: ReturnType<typeof setTimeout>;
  private _doubleTapTimer: ReturnType<typeof setTimeout>;
  private _focusTrap: ConfigurableFocusTrap;
  private _previouslyFocusedElement: HTMLElement;
  private _fullscreen = false;
  private _scale = 1;
  private _mousedown = false;
  private _positionX: number;
  private _positionY: number;
  private _mousedownPositionX: number;
  private _mousedownPositionY: number;
  private _originalPositionX: number;
  private _originalPositionY: number;
  private _tapCounter = 0;
  private _tapTime = 0;
  private _toolsTimeout = 4000;
  private _doubleTapTimeout = 300;

  constructor(
    private _renderer: Renderer2,
    private _elementRef: ElementRef,
    private _cdRef: ChangeDetectorRef,
    private _focusTrapFactory: ConfigurableFocusTrapFactory,
    @Inject(DOCUMENT) private _document,
    @Inject(forwardRef(() => MdbLightboxComponent)) _lightbox: MdbLightboxComponent
  ) {
    this.lightbox = _lightbox;
  }

  ngAfterViewInit(): void {
    this.index = this.lightboxItems.toArray().indexOf(this.activeLightboxItem);
    this.total = this.lightboxItems.toArray().length;
    this._setToolsToggleTimeout();
    this._disableScroll();
    this._previouslyFocusedElement = this._document.activeElement as HTMLElement;
    this._focusTrap = this._focusTrapFactory.create(this._elementRef.nativeElement);
    this._focusTrap.focusInitialElementWhenReady();
  }

  ngOnDestroy(): void {
    this._previouslyFocusedElement.focus();
    this._focusTrap.destroy();
    this._enableScroll();
  }

  onMousedown(event): void {
    const touch = event.touches;
    const x = touch ? touch[0].clientX : event.clientX;
    const y = touch ? touch[0].clientY : event.clientY;

    this._originalPositionX = parseFloat(this.activeItem.nativeElement.style.left) || 0;
    this._originalPositionY = parseFloat(this.activeItem.nativeElement.style.top) || 0;
    this._positionX = this._originalPositionX;
    this._positionY = this._originalPositionY;
    this._mousedownPositionX = x * (1 / this._scale) - this._positionX;
    this._mousedownPositionY = y * (1 / this._scale) - this._positionY;
    this._mousedown = true;
  }

  onMousemove(event): void {
    if (!this._mousedown) return;

    const touch = event.touches;
    const x = touch ? touch[0].clientX : event.clientX;
    const y = touch ? touch[0].clientY : event.clientY;

    if (touch) this._resetToolsToggler();

    if (this._scale !== 1) {
      this._positionX = x * (1 / this._scale) - this._mousedownPositionX;
      this._positionY = y * (1 / this._scale) - this._mousedownPositionY;

      this._renderer.setStyle(this.activeItem.nativeElement, 'left', `${this._positionX}px`);
      this._renderer.setStyle(this.activeItem.nativeElement, 'top', `${this._positionY}px`);
    } else {
      if (this.total <= 1) return;

      this._positionX = x * (1 / this._scale) - this._mousedownPositionX;
      this._renderer.setStyle(this.activeItem.nativeElement, 'left', `${this._positionX}px`);
    }
  }

  onMouseup(event: MouseEvent): void {
    this._mousedown = false;
    this._moveImg(event.target as HTMLElement);
    this._checkDoubleTap(event);
  }

  zoom(): void {
    if (this._scale === 1) {
      this.zoomIn();
    } else {
      this.zoomOut();
    }
  }

  close(): void {
    this._renderer.setStyle(this.activeItemWrapper.nativeElement, 'transform', 'scale(0.25)');
    this._renderer.setStyle(this.activeItemWrapper.nativeElement, 'opacity', 0);
    this.lightbox.close();
  }

  toggleFullscreen(): void {
    if (this._fullscreen === false) {
      this._renderer.addClass(this.btnFullsreen.nativeElement, 'active');

      if (this._elementRef.nativeElement.requestFullscreen) {
        this._elementRef.nativeElement.requestFullscreen();
      }

      this._fullscreen = true;
    } else {
      this._renderer.removeClass(this.btnFullsreen.nativeElement, 'active');

      if (this._document.exitFullscreen) {
        this._document.exitFullscreen();
      }

      this._fullscreen = false;
    }
  }

  private _onKeyup(event: KeyboardEvent): void {
    this._resetToolsToggler();
    switch (event.key) {
      case 'ArrowRight':
        this.slide();
        break;
      case 'ArrowLeft':
        this.slide('left');
        break;
      case 'Escape':
        this.close();
        break;
      case 'Home':
        this.slide('first');
        break;
      case 'End':
        this.slide('last');
        break;
      case 'ArrowUp':
        this.zoomIn();
        break;
      case 'ArrowDown':
        this.zoomOut();
        break;
      default:
        break;
    }
  }

  private _moveImg(target: HTMLElement): void {
    if (
      this._scale !== 1 ||
      target !== this.activeItem.nativeElement ||
      this.lightboxItems.length <= 1
    ) {
      return;
    }

    const movement = this._positionX - this._originalPositionX;

    if (movement > 0) {
      this.slide('left');
    } else if (movement < 0) {
      this.slide();
    }
  }

  private _setNewPositionOnZoomIn(event: WheelEvent): void {
    clearTimeout(this._zoomTimer);
    this._positionX = window.innerWidth / 2 - event.offsetX - 50;
    this._positionY = window.innerHeight / 2 - event.offsetY - 50;

    this._renderer.setStyle(this.activeItem.nativeElement, 'transition', 'all 0.5s ease-out');
    this._renderer.setStyle(this.activeItem.nativeElement, 'left', `${this._positionX}px`);
    this._renderer.setStyle(this.activeItem.nativeElement, 'top', `${this._positionY}px`);

    this._zoomTimer = setTimeout(() => {
      this._renderer.setStyle(this.activeItem.nativeElement, 'transition', 'none');
    }, 500);
  }

  private _resetToolsToggler(): void {
    this.toggleToolbar(1);
    clearTimeout(this._toolsToggleTimer);
    this._setToolsToggleTimeout();
  }

  toggleToolbar(opacity: number): void {
    this._renderer.setStyle(this.galleryToolbar.nativeElement, 'opacity', opacity);
    this._renderer.setStyle(this.leftArrow.nativeElement, 'opacity', opacity);
    this._renderer.setStyle(this.rightArrow.nativeElement, 'opacity', opacity);
  }

  private _setToolsToggleTimeout(): void {
    this._toolsToggleTimer = setTimeout(() => {
      this.toggleToolbar(0);
      clearTimeout(this._toolsToggleTimer);
    }, this._toolsTimeout);
  }

  onWheel(event: WheelEvent): void {
    if (event.deltaY > 0) {
      this.zoomOut();
    } else {
      if (this._scale >= 3) return;
      this._setNewPositionOnZoomIn(event);
      this.zoomIn();
    }
  }

  zoomIn(): void {
    if (this._scale >= 3) {
      return;
    }

    this.lightbox.lightboxZoomIn.emit();

    this._scale += this.zoomLevel;
    this._renderer.setStyle(
      this.activeItemWrapper.nativeElement,
      'transform',
      `scale(${this._scale})`
    );
    this._updateZoomBtn();

    this.lightbox.lightboxZoomedIn.emit();
  }

  zoomOut(): void {
    if (this._scale <= 1) {
      return;
    }

    this.lightbox.lightboxZoomOut.emit();

    this._scale -= this.zoomLevel;
    this._renderer.setStyle(
      this.activeItemWrapper.nativeElement,
      'transform',
      `scale(${this._scale})`
    );

    this._updateZoomBtn();
    this._updateImgPosition();

    this.lightbox.lightboxZoomedOut.emit();
  }

  slide(target = 'right'): void {
    this.lightbox.lightboxSlide.emit();

    if (this.lightboxItems.length <= 1) {
      return;
    }

    switch (target) {
      case 'right':
        this.slideRight = true;
        this.index + 1 === this.total ? (this.index = 0) : (this.index += 1);
        break;
      case 'left':
        this.slideRight = false;
        this.index - 1 < 0 ? (this.index = this.total - 1) : (this.index -= 1);
        break;
      case 'first':
        this.slideRight = true;
        this.index = 0;
        break;
      case 'last':
        this.slideRight = false;
        this.index = this.lightboxItems.length - 1;
        break;
      default:
        break;
    }

    clearTimeout(this._slideTimer);

    this._renderer.setStyle(this.activeItemWrapper.nativeElement, 'transform', 'scale(0.25)');
    this._renderer.setStyle(
      this.activeItemWrapper.nativeElement,
      'left',
      this.slideRight ? '-100%' : '100%'
    );

    fromEvent(this.activeItemWrapper.nativeElement, 'transitionend')
      .pipe(take(1))
      .subscribe(() => {
        this._showLoader();
        this._updateActiveLightboxItem();
      });
  }

  reset(): void {
    if (this._fullscreen) {
      this.toggleFullscreen();
    }

    this._restoreDefaultPosition();
    this._restoreDefaultZoom();
    clearTimeout(this._toolsToggleTimer);
    clearTimeout(this._doubleTapTimer);
  }

  private _disableScroll(): void {
    this._renderer.addClass(this._document.body, 'disabled-scroll');

    if (this._document.documentElement.scrollHeight > this._document.documentElement.clientHeight) {
      this._renderer.addClass(this._document.body, 'replace-scrollbar');
    }
  }

  private _enableScroll(): void {
    this._renderer.removeClass(this._document.body, 'disabled-scroll');
    this._renderer.removeClass(this._document.body, 'replace-scrollbar');
  }

  private _restoreDefaultZoom(): void {
    if (this._scale !== 1) {
      this._scale = 1;

      this._renderer.setStyle(
        this.activeItemWrapper.nativeElement,
        'transform',
        `scale(${this._scale})`
      );

      this._updateZoomBtn();
      this._updateImgPosition();
    }
  }

  private _updateImgPosition(): void {
    if (this._scale === 1) {
      this._restoreDefaultPosition();
    }
  }

  private _checkDoubleTap(event: MouseEvent): void {
    clearTimeout(this._doubleTapTimer);
    const currentTime = new Date().getTime();
    const tapLength = currentTime - this._tapTime;

    if (this._tapCounter > 0 && tapLength < 500) {
      this._onDoubleClick(event);
      this._doubleTapTimer = setTimeout(() => {
        this._tapTime = new Date().getTime();
        this._tapCounter = 0;
      }, this._doubleTapTimeout);
    } else {
      this._tapCounter++;
      this._tapTime = new Date().getTime();
    }
  }

  private _onDoubleClick(event: MouseEvent | TouchEvent): void {
    const touchEvent = event as TouchEvent;

    if (touchEvent.touches) {
      this._setNewPositionOnZoomIn(event as WheelEvent);
    }

    if (this._scale !== 1) {
      this._restoreDefaultZoom();
    } else {
      this.zoomIn();
    }
  }

  private _updateZoomBtn(): void {
    if (this._scale > 1) {
      this._renderer.addClass(this.btnZoom.nativeElement, 'active');
      this._renderer.setAttribute(this.btnZoom.nativeElement, 'aria-label', 'Zoom out');
    } else {
      this._renderer.removeClass(this.btnZoom.nativeElement, 'active');
      this._renderer.setAttribute(this.btnZoom.nativeElement, 'aria-label', 'Zoom in');
    }
  }

  private _restoreDefaultPosition(): void {
    clearTimeout(this._zoomTimer);

    this._renderer.setStyle(this.activeItem.nativeElement, 'left', 0);
    this._renderer.setStyle(this.activeItem.nativeElement, 'top', 0);
    this._renderer.setStyle(this.activeItem.nativeElement, 'transition', 'all 0.5s ease-out');

    this._calculateImgSize();

    setTimeout(() => {
      this._renderer.setStyle(this.activeItem.nativeElement, 'transition', 'none');
    }, 500);
  }

  private _updateActiveLightboxItem(): void {
    this.activeLightboxItem = this.lightboxItems.toArray()[this.index];
    this._cdRef.markForCheck();
  }

  load(): void {
    this._hideLoader();

    if (this.activeItemWrapper.nativeElement.style.transform == 'scale(0.25)') {
      this._renderer.setStyle(this.activeItemWrapper.nativeElement, 'transition', 'none');
      this._renderer.setStyle(
        this.activeItemWrapper.nativeElement,
        'left',
        this.slideRight ? '100%' : '-100%'
      );

      this._slideTimer = setTimeout(() => {
        this._renderer.setStyle(this.activeItemWrapper.nativeElement, 'transition', '');
        this._renderer.setStyle(this.activeItemWrapper.nativeElement, 'left', '0');
        this._renderer.setStyle(this.activeItemWrapper.nativeElement, 'transform', 'scale(1)');

        this.lightbox.lightboxSlided.emit();
      }, 0);
    }

    this._calculateImgSize();
  }

  private _showLoader(): void {
    this._renderer.setStyle(this.loader.nativeElement, 'opacity', 1);
  }

  private _hideLoader(): void {
    this._renderer.setStyle(this.loader.nativeElement, 'opacity', 0);
  }

  private _calculateImgSize(): void {
    if (this.activeItem.nativeElement.width >= this.activeItem.nativeElement.height) {
      this._renderer.setStyle(this.activeItem.nativeElement, 'width', '100%');
      this._renderer.setStyle(this.activeItem.nativeElement, 'maxWidth', '100%');
      this._renderer.setStyle(this.activeItem.nativeElement, 'height', 'auto');

      const top = `${
        (this.activeItemWrapper.nativeElement.offsetHeight - this.activeItem.nativeElement.height) /
        2
      }px`;

      this._renderer.setStyle(this.activeItem.nativeElement, 'top', top);
      this._renderer.setStyle(this.activeItem.nativeElement, 'left', 0);
    } else {
      this._renderer.setStyle(this.activeItem.nativeElement, 'height', '100%');
      this._renderer.setStyle(this.activeItem.nativeElement, 'maxHeight', '100%');
      this._renderer.setStyle(this.activeItem.nativeElement, 'width', 'auto');

      const left = `${
        (this.activeItemWrapper.nativeElement.offsetWidth - this.activeItem.nativeElement.width) / 2
      }px`;

      this._renderer.setStyle(this.activeItem.nativeElement, 'left', left);
      this._renderer.setStyle(this.activeItem.nativeElement, 'top', 0);
    }

    if (this.activeItem.nativeElement.width >= this.activeItemWrapper.nativeElement.offsetWidth) {
      this._renderer.setStyle(
        this.activeItem.nativeElement,
        'width',
        `${this.activeItemWrapper.nativeElement.offsetWidth}px`
      );
      this._renderer.setStyle(this.activeItem.nativeElement, 'height', 'auto');
      this._renderer.setStyle(this.activeItem.nativeElement, 'height', 'auto');

      const top = `${
        (this.activeItemWrapper.nativeElement.offsetHeight - this.activeItem.nativeElement.height) /
        2
      }px`;

      this._renderer.setStyle(this.activeItem.nativeElement, 'top', top);
      this._renderer.setStyle(this.activeItem.nativeElement, 'left', 0);
    }

    if (this.activeItem.nativeElement.height >= this.activeItemWrapper.nativeElement.offsetHeight) {
      this._renderer.setStyle(
        this.activeItem.nativeElement,
        'height',
        `${this.activeItemWrapper.nativeElement.offsetHeight}px`
      );
      this._renderer.setStyle(this.activeItem.nativeElement, 'width', 'auto');
      this._renderer.setStyle(this.activeItem.nativeElement, 'top', 0);

      const left = `${
        (this.activeItemWrapper.nativeElement.offsetWidth - this.activeItem.nativeElement.width) / 2
      }px`;

      this._renderer.setStyle(this.activeItem.nativeElement, 'left', left);
    }
  }
}
