import {
  AfterContentInit,
  Component,
  ContentChildren,
  ElementRef,
  EventEmitter,
  Input,
  Output,
  ViewChild,
  ViewEncapsulation,
  QueryList,
  OnDestroy,
  TemplateRef,
  ChangeDetectionStrategy,
  ChangeDetectorRef,
} from '@angular/core';
import { MdbOptionComponent, MDB_OPTION_PARENT } from 'mdb-angular-ui-kit/option';
import { Subject } from 'rxjs';
import { ActiveDescendantKeyManager } from '@angular/cdk/a11y';
import { dropdownAnimation, dropdownContainerAnimation } from './autocomplete.animations';
import { BooleanInput, coerceBooleanProperty } from '@angular/cdk/coercion';

export interface MdbAutocompleteSelectedEvent {
  component: MdbAutocompleteComponent;
  option: MdbOptionComponent;
}

@Component({
  selector: 'mdb-autocomplete',
  templateUrl: 'autocomplete.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  encapsulation: ViewEncapsulation.None,
  exportAs: 'mdbAutocomplete',
  animations: [dropdownAnimation, dropdownContainerAnimation],
  providers: [{ provide: MDB_OPTION_PARENT, useExisting: MdbAutocompleteComponent }],
})
export class MdbAutocompleteComponent implements AfterContentInit, OnDestroy {
  @ContentChildren(MdbOptionComponent, { descendants: true })
  options: QueryList<MdbOptionComponent>;

  @ViewChild('dropdown', { static: false }) dropdown: ElementRef;
  @ViewChild('dropdownTemplate', { static: true }) dropdownTemplate: TemplateRef<any>;

  @Input()
  get disabled(): boolean {
    return this._disabled;
  }
  set disabled(value: boolean) {
    this._disabled = coerceBooleanProperty(value);
  }
  private _disabled: boolean;

  @Input()
  get optionHeight(): any {
    return this._optionHeight;
  }

  set optionHeight(value: any) {
    if (value !== 0) {
      this._optionHeight = value;
    }
  }

  private _optionHeight = 38;

  @Input()
  get listHeight(): number {
    return this._listHeight;
  }

  set listHeight(value: number) {
    if (value !== 0) {
      this._listHeight = value;
    }
  }
  // Equal to 5 * optionHeight (which is 38px by default)
  private _listHeight = 190;

  @Input() displayValue: ((value: any) => string) | null;

  @Output() selected: EventEmitter<MdbAutocompleteSelectedEvent> =
    new EventEmitter<MdbAutocompleteSelectedEvent>();
  @Output() opened: EventEmitter<void> = new EventEmitter<void>();
  @Output() closed: EventEmitter<void> = new EventEmitter<void>();

  private _destroy$ = new Subject<void>();

  _keyManager: ActiveDescendantKeyManager<MdbOptionComponent>;

  private _isOpen = false;
  protected showNoResultText = false;

  constructor(private _cdRef: ChangeDetectorRef) {}

  _getOptionsArray(): MdbOptionComponent[] {
    return this.options.toArray();
  }

  get isOpen(): boolean {
    return this._isOpen;
  }

  _getScrollTop(): number {
    return this.dropdown ? this.dropdown.nativeElement.scrollTop : 0;
  }

  _setScrollTop(scrollPosition: number) {
    if (this.dropdown) {
      this.dropdown.nativeElement.scrollTop = scrollPosition;
    }
  }

  _markForCheck() {
    this._cdRef.markForCheck();
  }

  ngAfterContentInit() {
    this._keyManager = new ActiveDescendantKeyManager<MdbOptionComponent>(this.options);
  }

  ngOnDestroy() {
    this._destroy$.next();
    this._destroy$.complete();
  }

  static ngAcceptInputType_disabled: BooleanInput;
}
