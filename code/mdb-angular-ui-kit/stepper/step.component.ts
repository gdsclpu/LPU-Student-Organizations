import { BooleanInput, coerceBooleanProperty } from '@angular/cdk/coercion';
import { TemplatePortal } from '@angular/cdk/portal';
import {
  Component,
  Input,
  ViewChild,
  TemplateRef,
  ElementRef,
  ChangeDetectionStrategy,
  OnChanges,
  SimpleChanges,
  ContentChild,
  ViewContainerRef,
  AfterContentInit,
} from '@angular/core';
import { FormGroup } from '@angular/forms';
import { Subject } from 'rxjs';
import { MDB_STEP_ICON } from './step-icon.directive';

@Component({
  // tslint:disable-next-line: component-selector
  selector: 'mdb-step',
  exportAs: 'mdbStep',
  template: '<ng-template><ng-content></ng-content></ng-template>',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class MdbStepComponent implements OnChanges, AfterContentInit {
  @ContentChild(MDB_STEP_ICON, { read: TemplateRef, static: true }) _icon: TemplateRef<any>;

  @ViewChild(TemplateRef, { static: true }) content: TemplateRef<any>;

  @Input()
  get editable(): boolean {
    return this._editable;
  }
  set editable(value: boolean) {
    this._editable = coerceBooleanProperty(value);
  }
  private _editable = true;
  @Input() name: string;
  @Input() label: string;

  @Input()
  get optional(): boolean {
    return this._optional;
  }
  set optional(value: boolean) {
    this._optional = coerceBooleanProperty(value);
  }
  private _optional = false;

  @Input() stepForm: FormGroup;

  _onChanges: Subject<void> = new Subject();

  constructor(public el: ElementRef, private _vcr: ViewContainerRef) {}

  get isCompleted(): boolean {
    return this._isCompleted;
  }
  set isCompleted(value: boolean) {
    this._isCompleted = value;
  }
  private _isCompleted: boolean;

  get isInvalid(): boolean {
    return this._isInvalid;
  }
  set isInvalid(value: boolean) {
    this._isInvalid = value;
    this._onChanges.next();
  }
  private _isInvalid: boolean;

  get isActive(): boolean {
    return this._isActive;
  }
  set isActive(value: boolean) {
    this._isActive = value;
  }
  private _isActive = false;

  get icon(): TemplatePortal | null {
    return this._iconPortal;
  }

  private _iconPortal: TemplatePortal | null = null;

  private _removeClasses(): void {
    this.isActive = false;
    this.isCompleted = false;
    this.isInvalid = false;
  }

  reset(): void {
    if (this.stepForm) {
      this.stepForm.reset();
    }
    this._removeClasses();
  }

  ngAfterContentInit(): void {
    if (this._icon) {
      this._createIconPortal();
    }
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes.name && !changes.name.isFirstChange()) {
      this._onChanges.next();
    }

    if (changes.label && !changes.label.isFirstChange()) {
      this._onChanges.next();
    }

    if (changes.editable && !changes.editable.isFirstChange()) {
      this._onChanges.next();
    }

    if (changes.optional && !changes.optional.isFirstChange()) {
      this._onChanges.next();
    }

    if (changes.stepForm && !changes.stepForm.isFirstChange()) {
      this._onChanges.next();
    }
  }

  private _createIconPortal(): void {
    this._iconPortal = new TemplatePortal(this._icon, this._vcr);
  }

  static ngAcceptInputType_editable: BooleanInput;
  static ngAcceptInputType_optional: BooleanInput;
}
