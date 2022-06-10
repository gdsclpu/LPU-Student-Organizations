import {
  Component,
  ChangeDetectionStrategy,
  Input,
  ViewContainerRef,
  ElementRef,
  ViewChild,
  TemplateRef,
  Output,
  EventEmitter,
  ContentChildren,
  QueryList,
  AfterContentInit,
  OnDestroy,
  OnInit,
  ChangeDetectorRef,
  Self,
  Optional,
  HostListener,
  Renderer2,
  ContentChild,
  HostBinding,
} from '@angular/core';
import { dropdownAnimation, dropdownContainerAnimation } from './select-animations';
import { fromEvent, merge, Observable, Subject } from 'rxjs';
import { filter, takeUntil, startWith, switchMap, tap, debounceTime } from 'rxjs/operators';
import { MDB_OPTION_PARENT, MdbOptionComponent } from 'mdb-angular-ui-kit/option';
import { NgControl, ControlValueAccessor, FormControl } from '@angular/forms';
import { MdbOptionGroupComponent } from 'mdb-angular-ui-kit/option';
import { MdbSelectAllOptionComponent } from './select-all-option';
import {
  OverlayRef,
  PositionStrategy,
  Overlay,
  ViewportRuler,
  ConnectionPositionPair,
} from '@angular/cdk/overlay';
import { TemplatePortal } from '@angular/cdk/portal';
import {
  ESCAPE,
  UP_ARROW,
  HOME,
  END,
  ENTER,
  SPACE,
  DOWN_ARROW,
  TAB,
  I,
} from '@angular/cdk/keycodes';
import { ActiveDescendantKeyManager } from '@angular/cdk/a11y';
import { SelectionModel } from '@angular/cdk/collections';
import { MdbAbstractFormControl } from 'mdb-angular-ui-kit/forms';
import { BooleanInput, coerceBooleanProperty } from '@angular/cdk/coercion';

@Component({
  selector: 'mdb-select',
  templateUrl: './select.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  animations: [dropdownAnimation, dropdownContainerAnimation],
  providers: [
    { provide: MdbAbstractFormControl, useExisting: MdbSelectComponent },
    { provide: MDB_OPTION_PARENT, useExisting: MdbSelectComponent },
  ],
})

// eslint-disable-next-line @angular-eslint/component-class-suffix
export class MdbSelectComponent
  implements OnInit, OnDestroy, AfterContentInit, ControlValueAccessor
{
  @ViewChild('input', { static: true }) _input: ElementRef<HTMLInputElement>;
  @ViewChild('dropdownTemplate') _dropdownTemplate: TemplateRef<any>;
  @ViewChild('dropdown') dropdown: ElementRef;
  @ViewChild('optionsWrapper') private _optionsWrapper: ElementRef;
  @ViewChild('customContent') _customContent: ElementRef;
  @ViewChild('filterInput', { static: false }) _filterInput: ElementRef;
  @ContentChild(MdbSelectAllOptionComponent) selectAllOption: MdbSelectAllOptionComponent;
  @ContentChildren(MdbOptionComponent, { descendants: true })
  options: QueryList<MdbOptionComponent>;
  @ContentChildren(MdbOptionGroupComponent) optionGroups: QueryList<MdbOptionGroupComponent>;

  @Input()
  get clearButton(): boolean {
    return this._clearButton;
  }
  set clearButton(value: boolean) {
    this._clearButton = coerceBooleanProperty(value);
  }
  private _clearButton = false;

  @Input() clearButtonTabindex = 0;

  @Input()
  get disabled(): boolean {
    return this._disabled;
  }
  set disabled(value: boolean) {
    this._disabled = coerceBooleanProperty(value);
  }
  private _disabled = false;

  @Input() dropdownClass: string;
  @Input() displayedLabels = 5;

  @Input()
  get highlightFirst(): boolean {
    return this._highlightFirst;
  }
  set highlightFirst(value: boolean) {
    this._highlightFirst = coerceBooleanProperty(value);
  }
  private _highlightFirst = true;

  @Input()
  get multiple(): boolean {
    return this._multiple;
  }
  set multiple(value: boolean) {
    this._multiple = coerceBooleanProperty(value);
  }
  private _multiple = false;

  @Input() notFoundMsg = 'No results found';

  @Input()
  get outline(): boolean {
    return this._outline;
  }
  set outline(value: boolean) {
    this._outline = coerceBooleanProperty(value);
  }
  private _outline = false;

  @Input() optionsSelectedLabel = 'options selected';
  @Input() placeholder = '';
  @Input() tabindex = 0;

  @Input()
  get required(): boolean {
    return this._required;
  }
  set required(value: boolean) {
    this._required = coerceBooleanProperty(value);
  }
  private _required = false;

  @Input()
  get filter(): boolean {
    return this._filter;
  }
  set filter(value: boolean) {
    this._filter = coerceBooleanProperty(value);
  }
  private _filter = false;

  @Input() filterPlaceholder = 'Search...';
  @Input() filterDebounce = 300;
  @Input('aria-label') ariaLabel = '';
  @Input('aria-labelledby') ariaLabelledby: string;

  @Input()
  get visibleOptions(): number {
    return this._visibleOptions;
  }

  set visibleOptions(value: number) {
    if (value !== 0) {
      this._visibleOptions = value;
      this.dropdownHeight = this.visibleOptions * this.optionHeight;
    }
  }
  private _visibleOptions = 5;

  @Input()
  get optionHeight(): any {
    return this._optionHeight;
  }

  set optionHeight(value: any) {
    if (value !== 0) {
      this._optionHeight = value;
      this.dropdownHeight = this.visibleOptions * this.optionHeight;
    }
  }

  private _optionHeight = 38;

  @Input()
  get dropdownHeight(): number {
    return this._dropdownHeight;
  }

  set dropdownHeight(value: number) {
    if (value !== 0) {
      this._dropdownHeight = value;
    }
  }
  protected _dropdownHeight = this.visibleOptions * this.optionHeight;

  @Input()
  @Input()
  get value(): any {
    return this._value;
  }
  set value(newValue: any) {
    if (newValue !== this._value) {
      if (this.options) {
        this._setSelection(newValue);
      }

      this._value = newValue;
    }
  }
  private _value: any;

  @Input()
  // eslint-disable-next-line
  get compareWith() {
    return this._compareWith;
  }
  set compareWith(fn: (o1: any, o2: any) => boolean) {
    if (typeof fn === 'function') {
      this._compareWith = fn;
    }
  }

  @Input() sortComparator: (
    a: MdbOptionComponent,
    b: MdbOptionComponent,
    options: MdbOptionComponent[]
  ) => number;

  @Output() readonly valueChange: EventEmitter<any> = new EventEmitter<any>();
  @Output() opened: EventEmitter<any> = new EventEmitter<any>();
  @Output() closed: EventEmitter<any> = new EventEmitter<any>();
  @Output() selected: EventEmitter<MdbOptionComponent> = new EventEmitter<MdbOptionComponent>();
  // eslint-disable-next-line max-len
  @Output() deselected: EventEmitter<MdbOptionComponent | MdbOptionComponent[]> = new EventEmitter<
    MdbOptionComponent | MdbOptionComponent[]
  >();
  @Output() noOptionsFound: EventEmitter<string> = new EventEmitter<string>();

  readonly stateChanges: Subject<void> = new Subject<void>();

  selectFilter: FormControl = new FormControl();

  get activeOption(): MdbOptionComponent | null {
    if (this._keyManager) {
      return this._keyManager.activeItem;
    }

    return null;
  }

  get selectionView(): string {
    if (
      this.multiple &&
      this.displayedLabels !== -1 &&
      this._selectionModel.selected.length > this.displayedLabels
    ) {
      return `${this._selectionModel.selected.length} ${this.optionsSelectedLabel}`;
    }

    if (this.multiple) {
      const selectedOptions = this._selectionModel.selected.map((option) => option.label.trim());

      return selectedOptions.join(', ');
    }

    if (this._selectionModel.selected[0]) {
      return this._selectionModel.selected[0].label;
    }

    return '';
  }

  get hasSelection(): boolean {
    return this._selectionModel && !this._selectionModel.isEmpty();
  }

  get allChecked(): boolean {
    const selectionsNumber = this._selectionModel.selected.length;
    const optionsNumber = this.options.length;

    return selectionsNumber === optionsNumber;
  }

  private _keyManager: ActiveDescendantKeyManager<MdbOptionComponent | null>;

  private _overlayRef: OverlayRef | null;
  private _portal: TemplatePortal;

  private _selectionModel: SelectionModel<MdbOptionComponent>;

  previousSelectedValues: any;

  private _destroy = new Subject<void>();

  _isOpen = false;

  _hasFocus = false;

  _labelActive = false;

  _showNoResultsMsg = false;

  private _selectAllChecked = false;

  private _compareWith = (o1: any, o2: any) => o1 === o2;

  @HostListener('keydown', ['$event'])
  handleKeydown(event: any): void {
    if (!this.disabled) {
      this._handleClosedKeydown(event);
    }
  }

  @HostBinding('class.select')
  get select(): boolean {
    return true;
  }

  @HostBinding('class.focused')
  get isFocused(): boolean {
    return this._hasFocus || this._isOpen;
  }

  @HostBinding('class.active')
  get isActive(): boolean {
    return this.hasSelected || this.isFocused;
  }

  @HostBinding('attr.aria-multiselectable')
  get isMultiselectable(): boolean {
    return this.multiple;
  }

  @HostBinding('attr.aria-haspopup')
  get hasPopup(): boolean {
    return true;
  }

  @HostBinding('attr.aria-disabled')
  get isDisabled(): boolean {
    return this.disabled;
  }

  @HostBinding('attr.aria-expanded')
  get isExpanded(): boolean {
    return this._isOpen;
  }

  @HostBinding('attr.aria-role')
  get role(): string {
    return this.filter ? 'combobox' : 'listbox';
  }

  constructor(
    private _overlay: Overlay,
    private _viewportRuler: ViewportRuler,
    private _vcr: ViewContainerRef,
    private _cdRef: ChangeDetectorRef,
    private _renderer: Renderer2,
    @Self() @Optional() public ngControl: NgControl
  ) {
    if (this.ngControl) {
      this.ngControl.valueAccessor = this;
    }
  }

  ngAfterContentInit(): void {
    this._initKeyManager(this.options);
    this._setInitialValue();
    this._listenToOptionClick();

    if (this.selectAllOption) {
      this._listenToSelectAllClick();
    }
  }

  private _initKeyManager(viewOptions): void {
    const options = this.selectAllOption ? [this.selectAllOption, ...viewOptions] : viewOptions;

    if (this.filter) {
      this._keyManager = new ActiveDescendantKeyManager<MdbOptionComponent | null>(
        options
      ).withVerticalOrientation();
    } else {
      this._keyManager = new ActiveDescendantKeyManager<MdbOptionComponent | null>(options)
        .withTypeAhead(200)
        .withVerticalOrientation();
    }
  }

  private _listenToOptionClick(): void {
    this.options.changes
      .pipe(
        startWith(this.options),
        tap(() => {
          this._setInitialValue();
          setTimeout(() => {
            this._showNoResultsMsg = this.options.length === 0;
            this._keyManager.setActiveItem(null);
            this._initKeyManager(this.options);

            if (this._isOpen) {
              this._highlightFirstOption();

              if (this._keyManager.activeItem) {
                this._scrollToOption(this._keyManager.activeItem);
              }
            }
          }, 0);
        }),
        switchMap((options: QueryList<MdbOptionComponent>) => {
          return merge(...options.map((option: MdbOptionComponent) => option.click$));
        }),
        takeUntil(this._destroy)
      )
      .subscribe((clickedOption: MdbOptionComponent) => this._handleOptionClick(clickedOption));
  }

  private _listenToSelectAllClick(): void {
    this.selectAllOption.click$
      .pipe(takeUntil(this._destroy))
      .subscribe((option: MdbSelectAllOptionComponent) => {
        this.onSelectAll(option);
      });
  }

  private _updateValue(): void {
    let updatedValue: any = null;

    if (this.multiple) {
      updatedValue = this._selectionModel.selected.map((option) => option.value);
    } else {
      updatedValue = this._selectionModel.selected[0].value;
    }

    this._value = updatedValue;
    this._cdRef.markForCheck();
  }

  private _handleOptionClick(option: MdbOptionComponent): void {
    if (option.disabled) {
      return;
    }

    if (this.multiple) {
      this._handleMultipleSelection(option);
    } else {
      this._handleSingleSelection(option);
    }

    this.stateChanges.next();
    this._cdRef.markForCheck();
  }

  private _handleSingleSelection(option: MdbOptionComponent): void {
    const currentSelection = this._selectionModel.selected[0];

    this._selectionModel.select(option);
    option.select();

    if (currentSelection && currentSelection !== option) {
      this._selectionModel.deselect(currentSelection);
      currentSelection.deselect();
      this.deselected.emit(currentSelection.value);
    }

    if (!currentSelection || (currentSelection && currentSelection !== option)) {
      this._updateValue();
      this.valueChange.emit(this.value);
      this._onChange(this.value);
      this.selected.emit(option.value);
    }

    this.close();
    this._focus();
  }

  private _handleMultipleSelection(option: MdbOptionComponent): void {
    const currentSelections = this._selectionModel.selected;
    if (option.selected) {
      this._selectionModel.deselect(option);
      option.deselect();
      this.deselected.emit(currentSelections);
    } else {
      this._selectionModel.select(option);
      option.select();
      this.selected.emit(option.value);
    }

    this._selectAllChecked = this.allChecked ? true : false;

    if (this.selectAllOption && !this._selectAllChecked) {
      this.selectAllOption.deselect();
    } else if (this.selectAllOption && this._selectAllChecked) {
      this.selectAllOption.select();
    }

    this._updateValue();
    this._sortValues();
    this.valueChange.emit(this.value);
    this._onChange(this.value);
    this._cdRef.markForCheck();
  }

  private _setSelection(selectValue: any | any[]): void {
    const previousSelected = this._selectionModel.selected;

    previousSelected.forEach((selectedOption: MdbOptionComponent) => {
      selectedOption.deselect();
    });
    this._selectionModel.clear();

    if (selectValue != null) {
      if (this.multiple) {
        selectValue.forEach((value: any) => this._selectByValue(value));
        this._sortValues();
      } else {
        this._selectByValue(selectValue);
      }
    }

    if (this.selectAllOption) {
      if (this.allChecked) {
        this.selectAllOption.select();
        this._selectAllChecked = true;
      } else {
        this.selectAllOption.deselect();
        this._selectAllChecked = false;
      }
    }

    this.stateChanges.next();
    this._cdRef.markForCheck();
  }

  private _showFilteredOptions(): void {
    this.options.toArray().forEach((option: MdbOptionComponent) => {
      option.hidden = false;
    });

    this._showNoResultsMsg = false;
  }

  private _selectByValue(value: any): void {
    const matchingOption = this.options
      .toArray()
      .find(
        (option: MdbOptionComponent) =>
          option.value != null && this._compareWith(option.value, value)
      );

    if (matchingOption) {
      this._selectionModel.select(matchingOption);
      matchingOption.select();
      this.selected.emit(matchingOption.value);
    }
  }

  private _setInitialValue(): void {
    Promise.resolve().then(() => {
      const value = this.ngControl ? this.ngControl.value : this._value;
      this._setSelection(value);
    });
  }

  onSelectAll(selectAlloption: MdbSelectAllOptionComponent): void {
    if (selectAlloption.disabled) {
      return;
    }

    if (!selectAlloption.selected && !this._selectAllChecked) {
      this._selectAllChecked = true;
      this.options.forEach((option: MdbOptionComponent) => {
        if (!option.disabled) {
          this._selectionModel.select(option);
          option.select();
        }
      });
      this._updateValue();
      this._sortValues();
      this.valueChange.emit(this.value);
      this._onChange(this.value);
      selectAlloption.select();
    } else {
      this._selectAllChecked = false;
      this._selectionModel.clear();
      this.options.forEach((option: MdbOptionComponent) => {
        option.deselect();
      });
      selectAlloption.deselect();
      this._updateValue();
      this.valueChange.emit(this.value);
      this._onChange(this.value);
    }
  }

  open(): void {
    if (this.disabled) {
      return;
    }

    let overlayRef = this._overlayRef;

    if (!overlayRef) {
      this._portal = new TemplatePortal(this._dropdownTemplate, this._vcr);

      overlayRef = this._overlay.create({
        width: this.input.offsetWidth,
        scrollStrategy: this._overlay.scrollStrategies.reposition(),
        positionStrategy: this._getOverlayPosition(),
      });

      this._overlayRef = overlayRef;

      overlayRef.keydownEvents().subscribe((event: KeyboardEvent) => {
        const key = event.keyCode;

        if (key === ESCAPE || (key === UP_ARROW && event.altKey)) {
          event.preventDefault();
          event.stopPropagation();
          this.close();
          this._focus();
        }
      });
    }

    if (this.filter) {
      this._showFilteredOptions();
      this.selectFilter.setValue('');
      this._initKeyManager(this.options);
    }

    if (overlayRef && !overlayRef.hasAttached()) {
      overlayRef.attach(this._portal);
      this._listenToOutSideClick(overlayRef, this.input).subscribe(() => this.close());

      this._highlightFirstOption();
    }

    if (this._viewportRuler) {
      this._viewportRuler
        .change()
        .pipe(takeUntil(this._destroy))
        .subscribe(() => {
          if (this._isOpen && overlayRef) {
            overlayRef.updateSize({ width: this.input.offsetWidth });
          }
        });
    }

    setTimeout(() => {
      if (this.filter) {
        this._filterInput.nativeElement.focus();

        this.selectFilter.valueChanges
          .pipe(debounceTime(this.filterDebounce), takeUntil(this.closed))
          .subscribe((value: string) => {
            const filterValue = value.toLowerCase();

            const options = this.options.toArray().filter((option: MdbOptionComponent) => {
              if (option.label.toLowerCase().includes(filterValue)) {
                option.hidden = false;
                return option;
              } else {
                option.hidden = true;
                return false;
              }
            });

            this._showNoResultsMsg = options.length === 0;
            this._keyManager.setActiveItem(null);
            this._initKeyManager(options);
            if (filterValue.length === 0) {
              this._highlightFirstOption();
            }
          });
      }
    }, 0);

    setTimeout(() => {
      const firstSelected = this._selectionModel.selected[0];
      if (firstSelected) {
        this._scrollToOption(firstSelected);
      }
    }, 0);

    this.opened.emit();

    setTimeout(() => {
      this._renderer.listen(this.dropdown.nativeElement, 'keydown', (event: KeyboardEvent) => {
        this._handleOpenKeydown(event);
      });
    }, 0);

    if (!this.filter) {
      setTimeout(() => {
        this.dropdown.nativeElement.focus();
      }, 0);
    }

    this._isOpen = true;
    this._cdRef.markForCheck();
  }

  private _sortValues(): void {
    if (this.multiple) {
      const options = this.options.toArray();

      this._selectionModel.sort((a, b) => {
        return this.sortComparator
          ? this.sortComparator(a, b, options)
          : options.indexOf(a) - options.indexOf(b);
      });
    }
  }

  private _listenToOutSideClick(
    overlayRef: OverlayRef,
    origin: HTMLElement
  ): Observable<MouseEvent> {
    return fromEvent(document, 'click').pipe(
      filter((event: MouseEvent) => {
        const target = event.target as HTMLElement;
        const notOrigin = target !== origin;
        // const notValue = !this._selectValue.nativeElement.contains(target);
        const notOverlay = !!overlayRef && overlayRef.overlayElement.contains(target) === false;
        return notOrigin && notOverlay;
      }),
      takeUntil(overlayRef.detachments())
    );
  }

  private _getOverlayPosition(): PositionStrategy {
    const positionStrategy = this._overlay
      .position()
      .flexibleConnectedTo(this.input)
      .withPositions(this._getPositions())
      .withFlexibleDimensions(false);

    return positionStrategy;
  }

  private _getPositions(): ConnectionPositionPair[] {
    const topOffset = this.outline ? -7 : -3;

    return [
      {
        originX: 'start',
        originY: 'bottom',
        overlayX: 'start',
        overlayY: 'top',
      },
      {
        originX: 'start',
        originY: 'top',
        offsetY: topOffset,
        overlayX: 'start',
        overlayY: 'bottom',
      },
    ];
  }

  close(): void {
    if (!this._isOpen) {
      return;
    }

    if (this._overlayRef && this._overlayRef.hasAttached()) {
      this._overlayRef.detach();
      this._isOpen = false;
    }

    this.closed.emit();
    this._keyManager.setActiveItem(null);
    this._onTouched();
    this._cdRef.markForCheck();
  }

  toggle(): void {
    this._isOpen ? this.close() : this.open();
  }

  get hasSelected(): boolean {
    return this._selectionModel.selected.length !== 0;
  }

  get input(): HTMLInputElement {
    return this._input.nativeElement;
  }

  get labelActive(): boolean {
    return this.hasSelected;
  }

  private _scrollToOption(option: MdbOptionComponent): void {
    let optionIndex: number;

    if (this.multiple && this.selectAllOption) {
      optionIndex = this.options.toArray().indexOf(option) + 1;
    } else {
      optionIndex = this.options.toArray().indexOf(option);
    }

    const groupsNumber = this._getNumberOfGroupsBeforeOption(optionIndex);

    const scrollToIndex = optionIndex + groupsNumber;

    const list = this._optionsWrapper.nativeElement;
    const listHeight = list.offsetHeight;

    if (optionIndex > -1) {
      const optionTop = scrollToIndex * this.optionHeight;
      const optionBottom = optionTop + this.optionHeight;

      const viewTop = list.scrollTop;
      const viewBottom = this.dropdownHeight;

      if (optionBottom > viewBottom) {
        list.scrollTop = optionBottom - listHeight;
      } else if (optionTop < viewTop) {
        list.scrollTop = optionTop;
      }
    }
  }

  private _getNumberOfGroupsBeforeOption(optionIndex: number): number {
    if (this.optionGroups.length) {
      const optionsList = this.options.toArray();
      const groupsList = this.optionGroups.toArray();
      const index = this.multiple ? optionIndex - 1 : optionIndex;
      let groupsNumber = 0;

      for (let i = 0; i <= index; i++) {
        if (optionsList[i].group && optionsList[i].group === groupsList[groupsNumber]) {
          groupsNumber++;
        }
      }

      return groupsNumber;
    }

    return 0;
  }

  handleSelectionClear(event?: MouseEvent): void {
    if (event && event.button === 2) {
      return;
    }

    this._selectionModel.clear();
    this.options.forEach((option: MdbOptionComponent) => {
      option.deselect();
    });

    if (this.selectAllOption && this._selectAllChecked) {
      this.selectAllOption.deselect();
      this._selectAllChecked = false;
    }
    this.value = null;
    this.valueChange.emit(null);
    this._onChange(null);
    this._selectAllChecked = false;
  }

  private _handleOpenKeydown(event: any): void {
    const key = event.keyCode;
    const manager = this._keyManager;
    const isUserTyping = manager.isTyping();
    const previousActiveItem = manager.activeItem;
    manager.onKeydown(event);

    if (key === TAB || (key === TAB && event.shiftKey)) {
      this._focus();
      this.close();
    }

    if (key === HOME || key === END) {
      event.preventDefault();
      key === HOME ? manager.setFirstItemActive() : manager.setLastItemActive();
      if (manager.activeItem) {
        this._scrollToOption(manager.activeItem);
      }
    } else if (
      this._overlayRef &&
      this._overlayRef.hasAttached() &&
      !isUserTyping &&
      manager.activeItem &&
      (key === ENTER || (key === SPACE && !this.filter))
    ) {
      event.preventDefault();

      if (this.multiple && this.selectAllOption && manager.activeItemIndex === 0) {
        this.onSelectAll(this.selectAllOption);
      } else {
        this._handleOptionClick(manager.activeItem);
      }
    } else if ((key === UP_ARROW && event.altKey) || key === ESCAPE) {
      event.preventDefault();
      this.close();
      this._focus();
    } else if (key === UP_ARROW || key === DOWN_ARROW) {
      if (manager.activeItem && manager.activeItem !== previousActiveItem) {
        this._scrollToOption(manager.activeItem);
      }
    }
  }

  private _handleClosedKeydown(event: any): void {
    const key = event.keyCode;
    const manager = this._keyManager;

    if ((key === DOWN_ARROW && event.altKey) || key === ENTER) {
      event.preventDefault();
      this.open();
    } else if (!this.multiple && key === DOWN_ARROW) {
      event.preventDefault();
      manager.setNextItemActive();
      if (manager.activeItem) {
        this._handleOptionClick(manager.activeItem);
      }
    } else if (!this.multiple && key === UP_ARROW) {
      event.preventDefault();
      manager.setPreviousItemActive();
      if (manager.activeItem) {
        this._handleOptionClick(manager.activeItem);
      }
    } else if (!this.multiple && key === HOME) {
      event.preventDefault();
      manager.setFirstItemActive();
      if (manager.activeItem) {
        this._handleOptionClick(manager.activeItem);
      }
    } else if (!this.multiple && key === END) {
      event.preventDefault();
      manager.setLastItemActive();
      if (manager.activeItem) {
        this._handleOptionClick(manager.activeItem);
      }
    } else if (this.multiple && (key === DOWN_ARROW || key === UP_ARROW)) {
      event.preventDefault();
      this.open();
    }
  }

  handleOptionsWheel(event: any): void {
    const optionsList = this._optionsWrapper.nativeElement;
    const atTop = optionsList.scrollTop === 0;
    const atBottom = optionsList.offsetHeight + optionsList.scrollTop === optionsList.scrollHeight;

    if (atTop && event.deltaY < 0) {
      event.preventDefault();
    } else if (atBottom && event.deltaY > 0) {
      event.preventDefault();
    }
  }

  private _focus(): void {
    this._hasFocus = true;
    this.input.focus();
  }

  private _highlightFirstOption(): void {
    if (!this.hasSelection) {
      this._keyManager.setFirstItemActive();
    } else if (this.hasSelection && !this._selectionModel.selected[0].disabled) {
      this._keyManager.setActiveItem(this._selectionModel.selected[0]);
    }
  }

  onFocus(): void {
    if (!this.disabled) {
      this._focus();
      this.stateChanges.next();
    }
  }

  onBlur(): void {
    if (!this._isOpen && !this.disabled) {
      this._onTouched();
    }
    this._hasFocus = false;
    this.stateChanges.next();
  }

  ngOnInit(): void {
    this._selectionModel = new SelectionModel<MdbOptionComponent>(this.multiple);
  }

  ngOnDestroy(): void {
    this._destroy.next();
    this._destroy.complete();
    this._destroyDropdown();
  }

  private _destroyDropdown() {
    if (this._overlayRef) {
      this.close();
      this._overlayRef.dispose();
      this._overlayRef = null;
    }
  }

  // ControlValueAccessor interface methods.

  private _onChange = (_: any) => {};
  private _onTouched = () => {};

  writeValue(value: any): void {
    this.value = value;
  }

  setDisabledState(isDisabled: boolean): void {
    this.disabled = isDisabled;
    this._cdRef.markForCheck();
  }

  registerOnChange(fn: (_: any) => void): void {
    this._onChange = fn;
  }

  registerOnTouched(fn: () => void): void {
    this._onTouched = fn;
  }

  static ngAcceptInputType_clearButton: BooleanInput;
  static ngAcceptInputType_disabled: BooleanInput;
  static ngAcceptInputType_highlightFirst: BooleanInput;
  static ngAcceptInputType_multiple: BooleanInput;
  static ngAcceptInputType_outline: BooleanInput;
  static ngAcceptInputType_required: BooleanInput;
  static ngAcceptInputType_filter: BooleanInput;
}
