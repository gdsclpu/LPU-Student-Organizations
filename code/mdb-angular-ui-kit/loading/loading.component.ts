import { BooleanInput, coerceBooleanProperty } from '@angular/cdk/coercion';
import { Overlay, OverlayConfig, OverlayRef } from '@angular/cdk/overlay';
import { TemplatePortal } from '@angular/cdk/portal';
import {
  AfterViewInit,
  Component,
  Input,
  OnChanges,
  OnDestroy,
  OnInit,
  Renderer2,
  SimpleChanges,
  TemplateRef,
  ViewChild,
  ViewContainerRef,
} from '@angular/core';

@Component({
  selector: 'mdb-loading',
  templateUrl: './loading.component.html',
})
export class MdbLoadingComponent implements OnInit, AfterViewInit, OnChanges, OnDestroy {
  @ViewChild('template') template: TemplateRef<any>;

  @Input()
  get show(): boolean {
    return this._show;
  }
  set show(value: boolean) {
    this._show = coerceBooleanProperty(value);
  }
  private _show = false;

  @Input()
  get backdrop(): boolean {
    return this._backdrop;
  }
  set backdrop(value: boolean) {
    this._backdrop = coerceBooleanProperty(value);
  }
  private _backdrop = true;

  @Input() backdropClass: string;
  @Input() container: HTMLElement;

  @Input()
  get fullscreen(): boolean {
    return this._fullscreen;
  }
  set fullscreen(value: boolean) {
    this._fullscreen = coerceBooleanProperty(value);
  }
  private _fullscreen = false;

  private _overlayRef: OverlayRef;

  constructor(
    private _renderer: Renderer2,
    private _overlay: Overlay,
    private _vcr: ViewContainerRef
  ) {}

  ngOnInit(): void {
    if (this.container && !this.fullscreen) {
      this._renderer.addClass(this.container, 'position-relative');
    }
  }

  ngAfterViewInit(): void {
    if (this.show && this.fullscreen) {
      this.showFullscreen();
    }
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (
      changes.show &&
      changes.show.currentValue &&
      !changes.show.isFirstChange() &&
      this.fullscreen
    ) {
      this.showFullscreen();
    } else if (
      changes.show &&
      !changes.show.currentValue &&
      !changes.show.isFirstChange() &&
      this.fullscreen
    ) {
      this.hideFullscreen();
    }
  }

  showFullscreen(): void {
    this._overlayRef = this._createOverlay();
    const templatePortal = new TemplatePortal(this.template, this._vcr);
    this._overlayRef.attach(templatePortal);
  }

  hideFullscreen(): void {
    this._overlayRef.detach();
  }

  private _createOverlay(): OverlayRef {
    const config = this._getOverlayConfig();
    return this._overlay.create(config);
  }

  private _getOverlayConfig(): OverlayConfig {
    const config = new OverlayConfig({
      positionStrategy: this._overlay.position().global(),
      scrollStrategy: this._overlay.scrollStrategies.noop(),
      hasBackdrop: this.backdrop,
      backdropClass: this._getBackdropClass(),
    });

    return config;
  }

  private _getBackdropClass(): string[] {
    const classes = [];

    if (this.backdropClass) {
      this.backdropClass.split(' ').forEach((backdropClass: string) => {
        classes.push(backdropClass);
      });
    }
    return ['loading-backdrop-fullscreen', ...classes];
  }

  ngOnDestroy(): void {
    if (this._overlayRef) {
      this._overlayRef.detach();
      this._overlayRef.dispose();
    }
  }

  static ngAcceptInputType_backdrop: BooleanInput;
  static ngAcceptInputType_fullscreen: BooleanInput;
  static ngAcceptInputType_show: BooleanInput;
}
