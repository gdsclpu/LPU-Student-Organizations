import {
  ComponentType,
  Overlay,
  OverlayConfig,
  OverlayRef,
  PositionStrategy,
} from '@angular/cdk/overlay';
import {
  ComponentFactoryResolver,
  Injectable,
  Injector,
  StaticProvider,
  TemplateRef,
} from '@angular/core';
import { MdbNotificationConfig } from './notification.config';
import { MdbNotificationRef } from './notification-ref';
import { MdbNotificationContainerComponent } from './notification-container.component';
import { ComponentPortal, TemplatePortal } from '@angular/cdk/portal';
import { first } from 'rxjs/operators';

@Injectable()
export class MdbNotificationService {
  timeout: any;
  toasts: MdbNotificationRef<[]>[] = [];
  config: MdbNotificationConfig;

  constructor(
    private _overlay: Overlay,
    private _injector: Injector,
    private _cfr: ComponentFactoryResolver
  ) {}

  open<T, D = any>(
    componentOrTemplateRef: ComponentType<T> | TemplateRef<T>,
    newConfig?: MdbNotificationConfig<D>
  ): MdbNotificationRef<T> {
    const defaultConfig = new MdbNotificationConfig();
    this.config = newConfig ? Object.assign(defaultConfig, newConfig) : defaultConfig;

    const overlayRef = this._createOverlay(this.config);
    const container = this._createContainer(overlayRef, this.config);
    const toastRef = this._createContent(
      componentOrTemplateRef,
      container,
      overlayRef,
      this.config
    );

    if (this.config.stacking) {
      this.toasts.push(toastRef);
    }

    if (this.config.autohide) {
      this.timeout = setTimeout(() => {
        container._hidden.pipe(first()).subscribe(() => {
          if (this.config.stacking) {
            this.updateToast(toastRef);
          }
          overlayRef.detach();
          overlayRef.dispose();
        });

        container.animationState = 'hidden';
        container.detectChanges();
      }, this.config.delay);
    }

    return toastRef;
  }

  updateToast(toastRef): void {
    const toastIndex = this.toasts.indexOf(toastRef);
    this.toasts.splice(toastIndex, 1);

    this.toasts.forEach((toast, index) => {
      toast.overlayRef.updatePositionStrategy(this._getPositionStrategy(this.config, index - 1));
    });
  }

  private _createOverlay(config: MdbNotificationConfig): OverlayRef {
    const overlayConfig = this._getOverlayConfig(config);
    return this._overlay.create(overlayConfig);
  }
  private _setOffset(config: MdbNotificationConfig, index?: number): number {
    const verticalDirection = config.position.startsWith('top') ? 'bottom' : 'top';
    const shouldCalculateFromTop = verticalDirection === 'top' ? false : true;
    const calculationAdjustment = shouldCalculateFromTop ? 0 : window.innerHeight;

    if (this.toasts.length === 0 || index <= -1) {
      return config.offset;
    } else if (index || index === 0) {
      return Math.abs(calculationAdjustment - this.toasts[index].getPosition()[verticalDirection]);
    } else {
      return Math.abs(
        calculationAdjustment - this.toasts[this.toasts.length - 1].getPosition()[verticalDirection]
      );
    }
  }

  private _getOverlayConfig(notificationConfig: MdbNotificationConfig): OverlayConfig {
    const width = notificationConfig.width;

    const config = new OverlayConfig({
      positionStrategy: this._getPositionStrategy(notificationConfig),
      scrollStrategy: this._overlay.scrollStrategies.reposition(),
      hasBackdrop: false,
      height: 'fit-content',
      width,
    });

    return config;
  }

  private _getPositionStrategy(
    notificationConfig: MdbNotificationConfig,
    index?: number
  ): PositionStrategy {
    const offset = `${this._setOffset(notificationConfig, index)}px`;
    let positionStrategy;

    switch (notificationConfig.position) {
      case 'top-left':
        positionStrategy = this._overlay
          .position()
          .global()
          .top(offset)
          .left(`${notificationConfig.offset}px`);
        break;
      case 'bottom-left':
        positionStrategy = this._overlay
          .position()
          .global()
          .bottom(offset)
          .left(`${notificationConfig.offset}px`);
        break;
      case 'bottom-right':
        positionStrategy = this._overlay
          .position()
          .global()
          .bottom(offset)
          .right(`${notificationConfig.offset}px`);
        break;
      case 'bottom-center':
        positionStrategy = this._overlay.position().global().bottom(offset).centerHorizontally();
        break;
      case 'top-center':
        positionStrategy = this._overlay.position().global().top(offset).centerHorizontally();
        break;
      default:
        positionStrategy = this._overlay
          .position()
          .global()
          .top(offset)
          .right(`${notificationConfig.offset}px`);
        break;
    }

    return positionStrategy;
  }

  private _createContainer(
    overlayRef: OverlayRef,
    config: MdbNotificationConfig
  ): MdbNotificationContainerComponent {
    const portal = new ComponentPortal(
      MdbNotificationContainerComponent,
      null,
      this._injector,
      this._cfr
    );
    const containerRef = overlayRef.attach(portal);
    containerRef.instance._config = config;
    return containerRef.instance;
  }

  private _createContent<T>(
    componentOrTemplate: ComponentType<T> | TemplateRef<T>,
    container: MdbNotificationContainerComponent,
    overlayRef: OverlayRef,
    config: MdbNotificationConfig
  ): MdbNotificationRef<T> {
    const notificationRef = new MdbNotificationRef(overlayRef, this, container);

    if (componentOrTemplate instanceof TemplateRef) {
      container.attachTemplatePortal(
        new TemplatePortal<T>(componentOrTemplate, null, {
          $implicit: config.data,
          notificationRef,
        } as any)
      );
    } else {
      const injector = this._createInjector<T>(config, notificationRef, container);
      const contentRef = container.attachComponentPortal<T>(
        new ComponentPortal(componentOrTemplate, config.viewContainerRef, injector)
      );

      if (config.data) {
        Object.assign(contentRef.instance, { ...config.data });
      }
    }

    return notificationRef;
  }

  private _createInjector<T>(
    config: MdbNotificationConfig,
    notificationRef: MdbNotificationRef<T>,
    container: MdbNotificationContainerComponent
  ): Injector {
    const userInjector = config && config.viewContainerRef && config.viewContainerRef.injector;
    const providers: StaticProvider[] = [
      { provide: MdbNotificationContainerComponent, useValue: container },
      { provide: MdbNotificationRef, useValue: notificationRef },
    ];

    return Injector.create({ parent: userInjector || this._injector, providers });
  }
}
