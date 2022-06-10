import { CdkPortalOutlet, ComponentPortal, TemplatePortal } from '@angular/cdk/portal';
import {
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  ComponentRef,
  ElementRef,
  EmbeddedViewRef,
  Inject,
  OnDestroy,
  OnInit,
  Renderer2,
  ViewChild,
} from '@angular/core';
import { Subject } from 'rxjs';
import { MdbNotificationConfig } from './notification.config';
import { animate, state, style, transition, trigger, AnimationEvent } from '@angular/animations';
import { DOCUMENT } from '@angular/common';

@Component({
  selector: 'mdb-notification-container',
  templateUrl: 'notification-container.component.html',
  changeDetection: ChangeDetectionStrategy.Default,
  animations: [
    trigger('fade', [
      state('visible', style({ opacity: 1 })),
      state('hidden', style({ opacity: 0 })),
      transition('visible => hidden', animate('150ms linear')),
      transition(':enter', [style({ opacity: 0 }), animate('150ms linear')]),
    ]),
  ],
})
export class MdbNotificationContainerComponent implements OnInit, OnDestroy {
  @ViewChild(CdkPortalOutlet, { static: true }) _portalOutlet: CdkPortalOutlet;

  readonly _destroy$: Subject<void> = new Subject<void>();
  readonly _hidden: Subject<void> = new Subject<void>();

  animationState = 'visible';

  _config: MdbNotificationConfig;

  constructor(
    @Inject(DOCUMENT) private _document,
    public _elementRef: ElementRef,
    private _renderer: Renderer2,
    private _cdRef: ChangeDetectorRef
  ) {}

  ngOnInit(): void {
    this._renderer.addClass(this._document.body, 'notification-open');
  }

  ngOnDestroy(): void {
    this._renderer.removeClass(this._document.body, 'notification-open');
  }

  attachComponentPortal<T>(portal: ComponentPortal<T>): ComponentRef<T> {
    return this._portalOutlet.attachComponentPortal(portal);
  }

  attachTemplatePortal<C>(portal: TemplatePortal<C>): EmbeddedViewRef<C> {
    return this._portalOutlet.attachTemplatePortal(portal);
  }

  detectChanges(): void {
    this._cdRef.detectChanges();
  }

  onAnimationEnd(event: AnimationEvent): void {
    if (event.toState === 'hidden') {
      this._hidden.next();
    }
  }
}
