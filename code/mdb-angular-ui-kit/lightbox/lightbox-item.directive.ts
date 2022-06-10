import { BooleanInput, coerceBooleanProperty } from '@angular/cdk/coercion';
import {
  Directive,
  ElementRef,
  HostBinding,
  HostListener,
  Input,
  OnDestroy,
  OnInit,
} from '@angular/core';
import { Subject } from 'rxjs';

@Directive({
  selector: '[mdbLightboxItem]',
  exportAs: 'mdbLightboxItem',
})
export class MdbLightboxItemDirective implements OnDestroy {
  @Input() caption: string;
  @Input() img: string;

  @Input()
  get disabled(): boolean {
    return this._disabled;
  }
  set disabled(value: boolean) {
    this._disabled = coerceBooleanProperty(value);
  }
  private _disabled = false;

  click$ = new Subject<MdbLightboxItemDirective>();

  @HostListener('click', ['$event.target'])
  onClick(): void {
    if (this.disabled) {
      return;
    }

    this.click$.next(this);
  }

  @HostBinding('class.lightbox-disabled')
  get isDisabled(): boolean {
    return this.disabled;
  }

  constructor(public el: ElementRef) {}

  ngOnDestroy(): void {
    this.click$.complete();
  }

  static ngAcceptInputType_flush: BooleanInput;
}
