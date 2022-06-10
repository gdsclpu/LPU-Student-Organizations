import { CdkPortalOutlet, ComponentPortal, TemplatePortal } from '@angular/cdk/portal';
import {
  ChangeDetectionStrategy,
  Component,
  ComponentRef,
  ElementRef,
  EmbeddedViewRef,
  ViewChild,
} from '@angular/core';
import { Subject } from 'rxjs';
import { MdbPopconfirmConfig } from './popconfirm.config';
import { animate, style, transition, trigger } from '@angular/animations';

@Component({
  selector: 'mdb-popconfirm-container',
  templateUrl: 'popconfirm-container.component.html',
  changeDetection: ChangeDetectionStrategy.Default,
  animations: [
    trigger('fade', [
      transition(':enter', [style({ opacity: 0 }), animate('150ms linear', style({ opacity: 1 }))]),
      transition(':leave', [style({ opacity: 1 }), animate('150ms linear', style({ opacity: 0 }))]),
    ]),
  ],
})
export class MdbPopconfirmContainerComponent {
  @ViewChild(CdkPortalOutlet, { static: true }) _portalOutlet: CdkPortalOutlet;

  readonly _destroy$: Subject<void> = new Subject<void>();

  _config: MdbPopconfirmConfig;

  constructor(public _elementRef: ElementRef) {}

  attachComponentPortal<T>(portal: ComponentPortal<T>): ComponentRef<T> {
    return this._portalOutlet.attachComponentPortal(portal);
  }

  attachTemplatePortal<C>(portal: TemplatePortal<C>): EmbeddedViewRef<C> {
    return this._portalOutlet.attachTemplatePortal(portal);
  }
}
