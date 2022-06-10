import {
  Component,
  AfterContentInit,
  ContentChildren,
  QueryList,
  ComponentRef,
  ChangeDetectionStrategy,
  ViewContainerRef,
  OnDestroy,
  ViewEncapsulation,
  Input,
  Output,
  EventEmitter,
} from '@angular/core';
import { MdbLightboxItemDirective } from './lightbox-item.directive';
import { OverlayRef, Overlay, OverlayConfig } from '@angular/cdk/overlay';
import { ComponentPortal } from '@angular/cdk/portal';
import { MdbLightboxModalComponent } from './lightbox-modal.component';
import { merge, Subject } from 'rxjs';
import { filter, startWith, switchMap, takeUntil } from 'rxjs/operators';

@Component({
  selector: 'mdb-lightbox',
  template: '<ng-content></ng-content>',
  encapsulation: ViewEncapsulation.None,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class MdbLightboxComponent implements AfterContentInit, OnDestroy {
  @Input() zoomLevel = 1;
  @Input() fontAwesome = 'free';

  @Output() lightboxOpen: EventEmitter<void> = new EventEmitter();
  @Output() lightboxOpened: EventEmitter<void> = new EventEmitter();
  @Output() lightboxSlide: EventEmitter<void> = new EventEmitter();
  @Output() lightboxSlided: EventEmitter<void> = new EventEmitter();
  @Output() lightboxZoomIn: EventEmitter<void> = new EventEmitter();
  @Output() lightboxZoomedIn: EventEmitter<void> = new EventEmitter();
  @Output() lightboxZoomOut: EventEmitter<void> = new EventEmitter();
  @Output() lightboxZoomedOut: EventEmitter<void> = new EventEmitter();
  @Output() lightboxClose: EventEmitter<void> = new EventEmitter();
  @Output() lightboxClosed: EventEmitter<void> = new EventEmitter();

  @ContentChildren(MdbLightboxItemDirective, { descendants: true })
  lightboxItems: QueryList<MdbLightboxItemDirective>;

  private _destroy$: Subject<void> = new Subject();

  private _contentRef: ComponentRef<MdbLightboxModalComponent>;
  private _overlayRef: OverlayRef | null;
  private _portal: ComponentPortal<MdbLightboxModalComponent>;

  constructor(private _overlay: Overlay, private _vcr: ViewContainerRef) {}

  ngAfterContentInit(): void {
    this.lightboxItems.changes
      .pipe(
        startWith(this.lightboxItems),
        switchMap((items: QueryList<MdbLightboxItemDirective>) => {
          return merge(...items.map((item: MdbLightboxItemDirective) => item.click$));
        }),
        takeUntil(this._destroy$)
      )
      .subscribe((clickedItem: MdbLightboxItemDirective) => {
        this.open(clickedItem);
      });
  }

  private _patchInputValues(lightboxItem: MdbLightboxItemDirective) {
    this._contentRef.instance.lightboxItems = this.lightboxItems;
    this._contentRef.instance.activeLightboxItem = lightboxItem;
    this._contentRef.instance.zoomLevel = this.zoomLevel;
  }

  open(lightboxItem: MdbLightboxItemDirective): void {
    let overlayRef = this._overlayRef;
    if (!overlayRef) {
      this.lightboxOpen.emit();

      this._portal = new ComponentPortal(MdbLightboxModalComponent, this._vcr);
      overlayRef = this._overlay.create(this._getOverlayConfig());

      this._overlayRef = overlayRef;
    }

    if (overlayRef && this._overlayRef && !overlayRef.hasAttached()) {
      this._contentRef = this._overlayRef.attach(this._portal);
      this._patchInputValues(lightboxItem);
      this._listenToOutsideClick();

      this.lightboxOpened.emit();
    }
  }

  close(): void {
    if (this._overlayRef && this._overlayRef.backdropElement) {
      this.lightboxClose.emit();

      const cssTransitionDuration =
        parseFloat(getComputedStyle(this._overlayRef.backdropElement).transitionDuration) * 1000;

      setTimeout(() => {
        this._destroyOverlay();
        this.lightboxClosed.emit();
      }, cssTransitionDuration);
    }
  }

  slide(direction: 'right' | 'left' | 'first' | 'last'): void {
    this._contentRef.instance.slide(direction);
  }

  zoomIn(): void {
    this._contentRef.instance.zoomIn();
  }

  zoomOut(): void {
    this._contentRef.instance.zoomOut();
  }

  toggleFullscreen(): void {
    this._contentRef.instance.toggleFullscreen();
  }

  reset(): void {
    this._contentRef.instance.reset();
  }

  private _getOverlayConfig(): OverlayConfig {
    const positionStrategy = this._overlay
      .position()
      .global()
      .centerHorizontally()
      .centerVertically();
    const overlayConfig = new OverlayConfig({
      hasBackdrop: true,
      scrollStrategy: this._overlay.scrollStrategies.noop(),
      positionStrategy,
      backdropClass: 'lightbox-gallery',
    });
    return overlayConfig;
  }

  private _destroyOverlay() {
    if (this._overlayRef) {
      this._overlayRef.dispose();
      this._overlayRef = null;
    }
  }

  private _listenToOutsideClick(): void {
    if (this._overlayRef) {
      merge(
        this._overlayRef.backdropClick(),
        this._overlayRef.detachments(),
        this._overlayRef.keydownEvents().pipe(
          filter((event: KeyboardEvent) => {
            return event.key === 'escape';
          })
        )
      ).subscribe((event) => {
        if (event) {
          event.preventDefault();
        }
        this.close();
      });
    }
  }

  ngOnDestroy(): void {
    this._destroy$.next();
    this._destroy$.complete();
    this._destroyOverlay();
  }
}
