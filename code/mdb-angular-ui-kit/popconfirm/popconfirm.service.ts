import {
  ComponentType,
  ConnectedPosition,
  Overlay,
  OverlayConfig,
  OverlayPositionBuilder,
  OverlayRef,
  PositionStrategy,
  ScrollStrategy,
} from '@angular/cdk/overlay';
import {
  ComponentFactoryResolver,
  Injectable,
  Injector,
  StaticProvider,
  TemplateRef,
} from '@angular/core';
import { MdbPopconfirmConfig } from './popconfirm.config';
import { MdbPopconfirmRef } from './popconfirm-ref';
import { MdbPopconfirmContainerComponent } from './popconfirm-container.component';
import { ComponentPortal, TemplatePortal } from '@angular/cdk/portal';
import { merge } from 'rxjs';
import { filter } from 'rxjs/operators';

@Injectable()
export class MdbPopconfirmService {
  private _element: HTMLElement;
  private _overlayRef: OverlayRef;
  private _config: MdbPopconfirmConfig;

  constructor(
    private _overlay: Overlay,
    private _injector: Injector,
    private _cfr: ComponentFactoryResolver,
    private _overlayPositionBuilder: OverlayPositionBuilder
  ) {}

  open<T, D = any>(
    componentRef: ComponentType<T>,
    element?: HTMLElement,
    config?: MdbPopconfirmConfig<D>
  ): MdbPopconfirmRef<T> {
    this._element = element;

    const defaultConfig = new MdbPopconfirmConfig();
    this._config = config ? Object.assign(defaultConfig, config) : defaultConfig;

    if (!element && this._config.popconfirmMode === 'inline') {
      throw Error('Target element is required in inline mode');
    }

    this._overlayRef = this._createOverlay();
    const container = this._createContainer();
    const popconfirmRef = this._createContent(componentRef, container);

    this._listenToOutsideClick(popconfirmRef);

    return popconfirmRef;
  }

  private _createOverlay(): OverlayRef {
    const overlayConfig = this._getOverlayConfig();
    return this._overlay.create(overlayConfig);
  }

  private _getOverlayConfig(): OverlayConfig {
    const overlayConfig = new OverlayConfig({
      scrollStrategy: this._getScrollStrategy(),
      positionStrategy: this._getPositionStrategy(),
      hasBackdrop: this._getBackdropConfig(),
      backdropClass: this._getBackdropClass(),
    });

    return overlayConfig;
  }

  private _getBackdropClass(): string {
    if (this._config.popconfirmMode === 'modal') {
      return 'mdb-backdrop';
    } else {
      return '';
    }
  }

  private _getBackdropConfig(): boolean {
    if (this._config.popconfirmMode === 'modal') {
      return true;
    } else {
      return false;
    }
  }

  private _getScrollStrategy(): ScrollStrategy {
    if (this._config.popconfirmMode === 'modal') {
      return this._overlay.scrollStrategies.noop();
    } else {
      return this._overlay.scrollStrategies.reposition();
    }
  }

  private _getPositionStrategy(): PositionStrategy {
    if (this._config.popconfirmMode === 'modal') {
      return this._overlay.position().global().centerVertically().centerHorizontally();
    }

    const positionStrategy = this._overlayPositionBuilder
      .flexibleConnectedTo(this._element)
      .withPositions(this._getPosition());

    return positionStrategy;
  }

  private _getPosition(): ConnectedPosition[] {
    let position;

    const positionTopLeft = {
      originX: 'end',
      originY: 'top',
      overlayX: 'end',
      overlayY: 'bottom',
      offsetY: 0,
    };

    const positionTop = {
      originX: 'center',
      originY: 'top',
      overlayX: 'center',
      overlayY: 'bottom',
      offsetY: 0,
    };

    const positionTopRight = {
      originX: 'start',
      originY: 'top',
      overlayX: 'start',
      overlayY: 'bottom',
      offsetY: 0,
    };

    const positionRightTop = {
      originX: 'end',
      originY: 'bottom',
      overlayX: 'start',
      overlayY: 'bottom',
      offsetX: 0,
    };

    const positionRight = {
      originX: 'end',
      originY: 'center',
      overlayX: 'start',
      overlayY: 'center',
      offsetX: 0,
    };

    const positionRightBottom = {
      originX: 'end',
      originY: 'top',
      overlayX: 'start',
      overlayY: 'top',
      offsetX: 0,
    };

    const positionBottomRight = {
      originX: 'start',
      originY: 'bottom',
      overlayX: 'start',
      overlayY: 'top',
      offsetY: 0,
    };

    const positionBottom = {
      originX: 'center',
      originY: 'bottom',
      overlayX: 'center',
      overlayY: 'top',
      offsetY: 0,
    };

    const positionBottomLeft = {
      originX: 'end',
      originY: 'bottom',
      overlayX: 'end',
      overlayY: 'top',
      offsetY: 0,
    };

    const positionLeftBottom = {
      originX: 'start',
      originY: 'top',
      overlayX: 'end',
      overlayY: 'top',
      offsetX: 0,
    };

    const positionLeft = {
      originX: 'start',
      originY: 'center',
      overlayX: 'end',
      overlayY: 'center',
      offsetX: 0,
    };

    const positionLeftTop = {
      originX: 'start',
      originY: 'bottom',
      overlayX: 'end',
      overlayY: 'bottom',
      offsetY: 0,
    };

    switch (this._config.position) {
      case 'top-left':
        position = [positionTopLeft, positionBottomLeft, positionTopRight, positionBottomRight];
        break;
      case 'top':
        position = [positionTop, positionBottom];
        break;
      case 'top-right':
        position = [positionTopRight, positionTopLeft, positionBottomRight, positionBottomLeft];
        break;
      case 'right-top':
        position = [positionRightTop, positionLeftTop, positionRightBottom, positionLeftBottom];
        break;
      case 'right':
        position = [positionRight, positionLeft];
        break;
      case 'right-bottom':
        position = [positionRightBottom, positionLeftBottom, positionRightTop, positionLeftTop];
        break;
      case 'bottom-right':
        position = [positionBottomRight, positionBottomLeft, positionTopRight, positionTopLeft];
        break;
      case 'bottom':
        position = [positionBottom, positionTop];
        break;
      case 'bottom-left':
        position = [positionBottomLeft, positionTopLeft, positionBottomRight, positionTopLeft];
        break;
      case 'left-bottom':
        position = [positionLeftBottom, positionRightBottom, positionLeftTop, positionRightTop];
        break;
      case 'left':
        position = [positionLeft, positionRight];
        break;
      case 'left-top':
        position = [positionLeftTop, positionLeftBottom, positionRightTop, positionRightBottom];
        break;
      default:
        break;
    }

    return position;
  }

  private _createContainer(): MdbPopconfirmContainerComponent {
    const portal = new ComponentPortal(
      MdbPopconfirmContainerComponent,
      null,
      this._injector,
      this._cfr
    );
    const containerRef = this._overlayRef.attach(portal);
    containerRef.instance._config = this._config;
    return containerRef.instance;
  }

  private _createContent<T>(
    componentOrTemplate: ComponentType<T> | TemplateRef<T>,
    container: MdbPopconfirmContainerComponent
  ): MdbPopconfirmRef<T> {
    const popconfirmRef = new MdbPopconfirmRef(this._overlayRef);

    if (componentOrTemplate instanceof TemplateRef) {
      container.attachTemplatePortal(
        new TemplatePortal<T>(componentOrTemplate, null, {
          $implicit: this._config.data,
          popconfirmRef,
        } as any)
      );
    } else {
      const injector = this._createInjector<T>(popconfirmRef, container);
      const contentRef = container.attachComponentPortal<T>(
        new ComponentPortal(componentOrTemplate, this._config.viewContainerRef, injector)
      );

      if (this._config.data) {
        Object.assign(contentRef.instance, { ...this._config.data });
      }
    }

    return popconfirmRef;
  }

  private _createInjector<T>(
    popconfirmRef: MdbPopconfirmRef<T>,
    container: MdbPopconfirmContainerComponent
  ): Injector {
    const userInjector =
      this._config && this._config.viewContainerRef && this._config.viewContainerRef.injector;
    const providers: StaticProvider[] = [
      { provide: MdbPopconfirmContainerComponent, useValue: container },
      { provide: MdbPopconfirmRef, useValue: popconfirmRef },
    ];

    return Injector.create({ parent: userInjector || this._injector, providers });
  }

  private _listenToOutsideClick(popconfirmRef: MdbPopconfirmRef<any>): void {
    if (this._overlayRef) {
      merge(
        this._overlayRef.outsidePointerEvents(),
        this._overlayRef.detachments(),
        this._overlayRef.keydownEvents().pipe(
          filter((event: KeyboardEvent) => {
            return event.key === 'Escape';
          })
        )
      ).subscribe((event) => {
        if (!event) {
          return;
        } else {
          event.preventDefault();
        }

        popconfirmRef.close();
      });
    }
  }
}
