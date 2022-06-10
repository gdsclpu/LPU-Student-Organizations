import { BooleanInput, coerceBooleanProperty } from '@angular/cdk/coercion';
import {
  Component,
  ElementRef,
  Input,
  HostListener,
  InjectionToken,
  Optional,
  Inject,
  OnInit,
  HostBinding,
  ChangeDetectorRef,
  EventEmitter,
  Output,
} from '@angular/core';
import { Subject, Observable } from 'rxjs';
import { MdbOptionGroupComponent } from './option-group.component';

export interface MdbOptionParent {
  optionHeight: number;
  visibleOptions: number;
  multiple: boolean;
}

export interface MdbOptionGroup {
  disabled?: boolean;
}

export const MDB_OPTION_PARENT = new InjectionToken<MdbOptionParent>('MDB_OPTION_PARENT');

export const MDB_OPTION_GROUP = new InjectionToken<MdbOptionGroupComponent>('MDB_OPTION_GROUP');

@Component({
  selector: 'mdb-option',
  templateUrl: 'option.component.html',
})
export class MdbOptionComponent implements OnInit {
  @Input() value: any;

  hidden = false;

  @Input()
  get label(): string {
    return this._label || this._el.nativeElement.textContent;
  }
  set label(newValue: string) {
    this._label = newValue;
  }
  private _label: string;

  @HostBinding('class.hidden')
  get isHidden(): boolean {
    return this.hidden;
  }

  @HostBinding('class.disabled')
  @Input()
  get disabled(): boolean {
    return this._disabled;
  }
  set disabled(value: boolean) {
    this._disabled = coerceBooleanProperty(value);
  }
  private _disabled = false;

  @Output() readonly selectionChange = new EventEmitter<MdbOptionComponent>();

  _optionHeight: number;

  private _selected = false;
  private _active = false;
  _multiple = false;

  clicked = false;

  clickSource: Subject<MdbOptionComponent> = new Subject<MdbOptionComponent>();
  click$: Observable<MdbOptionComponent> = this.clickSource.asObservable();

  constructor(
    private _el: ElementRef,
    private _cdRef: ChangeDetectorRef,
    @Optional() @Inject(MDB_OPTION_PARENT) public _parent: MdbOptionParent,
    @Optional() @Inject(MDB_OPTION_GROUP) public group: MdbOptionGroup
  ) {
    this.clicked = false;
  }

  @HostBinding('class.option')
  option = true;

  @HostBinding('class.active')
  get active(): boolean {
    return this._active;
  }

  @HostBinding('class.selected')
  get selected(): boolean {
    return this._selected;
  }

  @HostBinding('style.height.px')
  get optionHeight(): number {
    return this._optionHeight;
  }

  @HostBinding('attr.role')
  get role(): string {
    return 'option';
  }

  @HostBinding('attr.aria-disabled')
  get isDisabled(): boolean {
    return this.disabled ? true : false;
  }

  @HostBinding('attr.aria-selected')
  get isSelected(): boolean {
    return this.selected;
  }

  @HostListener('click')
  onClick(): void {
    this.clickSource.next(this);
  }

  getLabel(): string {
    return this._el.nativeElement.textContent;
  }

  get offsetHeight(): number {
    return this._el.nativeElement.offsetHeight;
  }

  ngOnInit(): void {
    if (this._parent && this._parent.optionHeight) {
      this._optionHeight = this._parent.optionHeight;
    }

    if (this._parent && this._parent.multiple) {
      this._multiple = true;
    }
  }

  select(): void {
    if (!this._selected) {
      this._selected = this._multiple ? !this._selected : true;
      this.selectionChange.emit(this);
      this._cdRef.markForCheck();
    }
  }

  deselect(): void {
    if (this._selected) {
      this._selected = false;
      this.selectionChange.emit(this);
      this._cdRef.markForCheck();
    }
  }

  setActiveStyles(): void {
    if (!this._active) {
      this._active = true;
      this._cdRef.markForCheck();
    }
  }

  setInactiveStyles(): void {
    if (this._active) {
      this._active = false;
      this._cdRef.markForCheck();
    }
  }

  static ngAcceptInputType_disabled: BooleanInput;
}
