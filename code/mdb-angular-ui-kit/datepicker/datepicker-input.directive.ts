import { Directive, ElementRef, forwardRef, HostListener, Input, OnInit } from '@angular/core';
import { NG_VALUE_ACCESSOR, ControlValueAccessor } from '@angular/forms';
import { fromEvent, Subject } from 'rxjs';
import { isSameDate } from './datepicker-utils';
import { MdbDatepickerComponent } from './datepicker.component';

export const MDB_DATEPICKER_VALUE_ACCESSOR: any = {
  provide: NG_VALUE_ACCESSOR,
  // eslint-disable-next-line no-use-before-define, @typescript-eslint/no-use-before-define
  useExisting: forwardRef(() => MdbDatepickerInputDirective),
  multi: true,
};

@Directive({
  // eslint-disable-next-line @angular-eslint/directive-selector
  selector: 'input[mdbDatepicker]',
  exportAs: 'mdbDatepickerInput',
  providers: [MDB_DATEPICKER_VALUE_ACCESSOR],
})
export class MdbDatepickerInputDirective implements OnInit, ControlValueAccessor {
  selectionChange: Subject<Date> = new Subject();

  @Input() disabled = false;
  @Input() mdbDatepicker: MdbDatepickerComponent;

  @HostListener('blur')
  onBlur(): void {
    this.onTouched();
  }

  constructor(private _elementRef: ElementRef) {}

  ngOnInit(): void {
    this.mdbDatepicker._input = this._elementRef.nativeElement;
    this.mdbDatepicker._inputDirective = this;

    fromEvent(this._elementRef.nativeElement, 'input').subscribe((event: any) => {
      this.mdbDatepicker._handleUserInput(event.target.value);
    });
  }

  onChange: (_: any) => void = () => {};
  onTouched: () => void = () => {};

  writeValue(value: Date): void {
    Promise.resolve().then(() => {
      this.selectionChange.next(value);
    });
  }

  registerOnChange(fn: any): void {
    this.onChange = fn;
  }

  registerOnTouched(fn: any): void {
    this.onTouched = fn;
  }
}
