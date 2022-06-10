import {
  ChangeDetectionStrategy,
  Component,
  ViewContainerRef,
  OnDestroy,
  ComponentRef,
  Input,
  EventEmitter,
  Output,
  ChangeDetectorRef,
  OnInit,
  Renderer2,
  Inject,
} from '@angular/core';
import { Overlay, OverlayRef, OverlayConfig, ConnectionPositionPair } from '@angular/cdk/overlay';
import { ComponentPortal } from '@angular/cdk/portal';
import { MdbDatepickerContentComponent } from './datepicker-content.component';
import { filter, take, takeUntil } from 'rxjs/operators';
import { fromEvent, merge } from 'rxjs';
import {
  addMonths,
  addYears,
  createDate,
  getDate,
  getDayNumber,
  getDaysInMonth,
  getMonth,
  getToday,
  getYear,
  getYearsOffset,
  isDateDisabled,
  isMonthDisabled,
  isNextDateDisabled,
  isPreviousDateDisabled,
  isValidDate,
  isYearDisabled,
} from './datepicker-utils';
import { MdbDatepickerToggleComponent } from './datepicker-toggle.component';
import { DOCUMENT } from '@angular/common';
import { YEARS_IN_VIEW } from './datepicker-const';
import { MdbDatepickerInputDirective } from './datepicker-input.directive';
import { BooleanInput, coerceBooleanProperty } from '@angular/cdk/coercion';

export type MdbDatepickerView = 'days' | 'months' | 'years';

@Component({
  selector: 'mdb-datepicker',
  exportAs: 'mdbDatepicker',
  template: '',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class MdbDatepickerComponent implements OnInit, OnDestroy {
  defaultOptions = {
    title: 'Select date',
    monthsFull: [
      'January',
      'February',
      'March',
      'April',
      'May',
      'June',
      'July',
      'August',
      'September',
      'October',
      'November',
      'December',
    ],
    monthsShort: [
      'Jan',
      'Feb',
      'Mar',
      'Apr',
      'May',
      'Jun',
      'Jul',
      'Aug',
      'Sep',
      'Oct',
      'Nov',
      'Dec',
    ],
    weekdaysFull: ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'],
    weekdaysShort: ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'],
    weekdaysNarrow: ['S', 'M', 'T', 'W', 'T', 'F', 'S'],
    okBtnText: 'Ok',
    clearBtnText: 'Clear',
    cancelBtnText: 'Cancel',

    okBtnLabel: 'Confirm selection',
    clearBtnLabel: 'Clear selection',
    cancelBtnLabel: 'Cancel selection',
    nextMonthLabel: 'Next month',
    prevMonthLabel: 'Previous month',
    nextYearLabel: 'Next year',
    prevYearLabel: 'Previous year',
    nextMultiYearLabel: 'Next 24 years',
    prevMultiYearLabel: 'Previous 24 years',
    switchToMultiYearViewLabel: 'Choose year and month',
    switchToDayViewLabel: 'Choose date',
  };

  @Input()
  get disabled(): boolean {
    return this._disabled;
  }
  set disabled(value: boolean) {
    this._disabled = coerceBooleanProperty(value);
  }
  private _disabled = false;

  @Input()
  get inline(): boolean {
    return this._inline;
  }
  set inline(value: boolean) {
    this._inline = coerceBooleanProperty(value);
  }
  private _inline = false;

  @Input() format = 'dd/mm/yyyy';
  @Input() filter: (date: Date) => boolean;

  @Input()
  get openOnInputClick(): boolean {
    return this._openOnInputClick;
  }
  set openOnInputClick(value: boolean) {
    this._openOnInputClick = coerceBooleanProperty(value);
  }
  private _openOnInputClick = false;

  @Input() options: any;
  @Input() startDate: null | Date;
  @Input() startDay = 0;
  @Input() startView: MdbDatepickerView = 'days';
  @Input() minDate: Date;
  @Input() maxDate: Date;

  @Output() readonly dateChanged: EventEmitter<Date> = new EventEmitter();
  @Output() readonly viewChanged: EventEmitter<string> = new EventEmitter<any>();
  @Output() readonly clearButtonClicked: EventEmitter<null> = new EventEmitter<null>();
  @Output() readonly cancelButtonClicked: EventEmitter<null> = new EventEmitter<null>();
  @Output() readonly confirmButtonClicked: EventEmitter<null> = new EventEmitter<null>();
  @Output() readonly opened: EventEmitter<null> = new EventEmitter<null>();
  @Output() readonly closed: EventEmitter<null> = new EventEmitter<null>();

  private _overlayRef: OverlayRef;
  private _portal: ComponentPortal<MdbDatepickerContentComponent>;
  private _pickerRef: ComponentRef<MdbDatepickerContentComponent>;

  _activeDate = new Date();
  _selectedDate: null | Date;
  _selectedYear: null | number;
  _selectedMonth: null | number;

  _prevBtnDisabled = false;
  _nextBtnDisabled = false;

  _currentView: MdbDatepickerView;

  _input: HTMLInputElement;
  _inputDirective: MdbDatepickerInputDirective;
  _toggle: MdbDatepickerToggleComponent;
  _headerDate: string;

  _isOpen = false;

  get activeDay(): number {
    return getDate(this._activeDate);
  }

  get activeMonth(): number {
    return getMonth(this._activeDate);
  }

  get activeYear(): number {
    return getYear(this._activeDate);
  }

  get firstYearInView(): number {
    return (
      this.activeYear - getYearsOffset(this._activeDate, YEARS_IN_VIEW, this.minDate, this.maxDate)
    );
  }

  get lastYearInView(): number {
    return this.firstYearInView + YEARS_IN_VIEW - 1;
  }

  get viewChangeButtonText(): string {
    if (this._currentView === 'days') {
      return `${this.options.monthsFull[this.activeMonth]} ${this.activeYear}`;
    }

    if (this._currentView === 'years') {
      return `${this.firstYearInView} - ${this.lastYearInView}`;
    }

    if (this._currentView === 'months') {
      return `${this.activeYear}`;
    }
  }

  get viewChangeButtonLabel(): string {
    if (this._currentView === 'days') {
      return this.options.switchToMultiYearViewLabel;
    } else if (this._currentView === 'years' || this._currentView === 'months') {
      return this.options.switchToDayViewLabel;
    }
  }

  get nextButtonLabel(): string {
    if (this._currentView === 'days') {
      return this.options.nextMonthLabel;
    } else if (this._currentView === 'years') {
      return this.options.nextMultiYearLabel;
    } else {
      return this.options.nextYearLabel;
    }
  }

  get prevButtonLabel(): string {
    if (this._currentView === 'days') {
      return this.options.prevMonthLabel;
    } else if (this._currentView === 'years') {
      return this.options.prevMultiYearLabel;
    } else {
      return this.options.prevYearLabel;
    }
  }

  constructor(
    @Inject(DOCUMENT) private _document,
    private _overlay: Overlay,
    private _vcr: ViewContainerRef,
    private _renderer: Renderer2,
    private _cdRef: ChangeDetectorRef
  ) {}

  ngOnInit(): void {
    this._inputDirective.selectionChange.subscribe((date) => {
      this._applyInputDate(date);
    });
    this.options = this.options
      ? Object.assign(this.defaultOptions, this.options)
      : this.defaultOptions;

    const headerDate = this._selectedDate || this._activeDate;
    this._updateHeaderDate(headerDate);
  }

  _updateHeaderDate(date: Date): void {
    const day = getDayNumber(date);
    const dayNumber = getDate(date);
    const month = getMonth(date);
    const options = this.options;

    this._headerDate = `${options.weekdaysShort[day]}, ${options.monthsShort[month]} ${dayNumber}`;
  }

  open(): void {
    if (this._isOpen) {
      return;
    }

    this._currentView = this.startView;
    this._setInitialDate();

    let overlayRef = this._overlayRef;

    if (!overlayRef) {
      this._portal = new ComponentPortal<MdbDatepickerContentComponent>(
        MdbDatepickerContentComponent,
        this._vcr
      );
      overlayRef = this._overlay.create(this._getOverlayConfig());
      this._overlayRef = overlayRef;
    }

    if (overlayRef && !overlayRef.hasAttached()) {
      this._pickerRef = this._overlayRef.attach(this._portal);
      this._pickerRef.instance.datepicker = this;

      this._listenToOutsideClick();
    }

    if (!this.inline && this._hasVerticalScroll()) {
      this._renderer.setStyle(this._document.body, 'overflow', 'hidden');
      this._renderer.setStyle(this._document.body, 'padding-right', '15px');
    }

    this._isOpen = true;
    this.opened.emit();
    this._cdRef.markForCheck();
  }

  private _getOverlayConfig(): OverlayConfig {
    const inlinePositionStrategy = this._overlay
      .position()
      .flexibleConnectedTo(this._input)
      .withPositions(this._getPositions())
      .withFlexibleDimensions(false);

    const dialogPositionStrategy = this._overlay
      .position()
      .global()
      .centerHorizontally()
      .centerVertically();

    const inlineScrollStrategy = this._overlay.scrollStrategies.reposition();
    const dialogScrollStrategy = this._overlay.scrollStrategies.noop();

    const positionStrategy = this.inline ? inlinePositionStrategy : dialogPositionStrategy;
    const scrollStrategy = this.inline ? inlineScrollStrategy : dialogScrollStrategy;

    const overlayConfig = new OverlayConfig({
      hasBackdrop: this.inline ? false : true,
      backdropClass: 'mdb-backdrop',
      scrollStrategy,
      positionStrategy,
    });
    return overlayConfig;
  }

  private _getPositions(): ConnectionPositionPair[] {
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
        overlayX: 'start',
        overlayY: 'bottom',
      },
    ];
  }

  private _hasVerticalScroll(): boolean {
    return this._document.body.scrollHeight > this._document.documentElement.clientHeight;
  }

  private _listenToOutsideClick(): void {
    merge(
      this._overlayRef.keydownEvents().pipe(
        filter((event) => {
          return event.key === 'Escape';
        })
      ),
      fromEvent(document, 'click').pipe(
        takeUntil(this.closed),
        filter((event: MouseEvent) => {
          const toggleButton = this._toggle && this._toggle.button.nativeElement;
          const target = event.target as HTMLElement;
          const notToggle =
            toggleButton && target !== toggleButton && !toggleButton.contains(target);
          const notOrigin = target !== this._input;
          const notOverlay =
            !!this._overlayRef &&
            this._overlayRef.overlayElement &&
            !this._overlayRef.overlayElement.contains(target);
          return notToggle && notOrigin && notOverlay;
        })
      )
    ).subscribe(() => {
      this.close();
    });
  }

  close(): void {
    if (!this._isOpen) {
      return;
    }

    this._pickerRef.instance._startHideAnimation();
    if (this._overlayRef.backdropElement) {
      this._renderer.setStyle(this._overlayRef.backdropElement, 'opacity', '0');
    }

    this._pickerRef.instance._hideAnimationDone.pipe(take(1)).subscribe(() => {
      if (this._overlayRef && this._overlayRef.hasAttached()) {
        this._overlayRef.dispose();
        this._overlayRef = null;
        this._isOpen = false;
      }
      if (!this.inline) {
        this._renderer.removeStyle(this._document.body, 'overflow');
        this._renderer.removeStyle(this._document.body, 'padding-right');
      }

      this.closed.emit();

      if (this._toggle) {
        this._toggle.button.nativeElement.focus();
      } else {
        this._input.focus();
      }
    });

    this._cdRef.markForCheck();
  }

  toggle(): void {
    this._isOpen ? this.close() : this.open();
  }

  viewChange(): void {
    this._currentView = this._currentView === 'days' ? 'years' : 'days';
    this._updateControlsDisabledState();
  }

  _handlePreviousButtonClick(): void {
    if (this._currentView === 'days') {
      this._previousMonth();
    } else if (this._currentView === 'years') {
      this._previousYears();
    } else {
      this._previousYear();
    }

    this._updateControlsDisabledState();
  }

  _handleNextButtonClick(): void {
    if (this._currentView === 'days') {
      this._nextMonth();
    } else if (this._currentView === 'years') {
      this._nextYears();
    } else {
      this._nextYear();
    }

    this._updateControlsDisabledState();
  }

  _updateControlsDisabledState(): void {
    if (
      isNextDateDisabled(
        this._activeDate,
        this._currentView,
        YEARS_IN_VIEW,
        this.minDate,
        this.maxDate
      )
    ) {
      this._nextBtnDisabled = true;
    } else {
      this._nextBtnDisabled = false;
    }

    if (
      isPreviousDateDisabled(
        this._activeDate,
        this._currentView,
        YEARS_IN_VIEW,
        this.minDate,
        this.maxDate
      )
    ) {
      this._prevBtnDisabled = true;
    } else {
      this._prevBtnDisabled = false;
    }
  }

  _nextMonth(): void {
    this._activeDate = addMonths(this._activeDate, 1);
  }

  _previousMonth(): void {
    this._activeDate = addMonths(this._activeDate, -1);
  }

  _nextYear(): void {
    this._activeDate = addYears(this._activeDate, 1);
  }

  _previousYear(): void {
    this._activeDate = addYears(this._activeDate, -1);
  }

  _nextYears(): void {
    this._activeDate = addYears(this._activeDate, 24);
  }

  _previousYears(): void {
    this._activeDate = addYears(this._activeDate, -24);
  }

  _handleUserInput(input: string, emitChanges = true): void {
    const delimeters = this._getDelimeters(this.format);
    const date = this._parseDate(input, this.format, delimeters);

    if (isValidDate(date) && !isDateDisabled(date, this.minDate, this.maxDate, this.filter)) {
      this._activeDate = date;
      this._selectedDate = date;
    } else {
      this._activeDate = new Date();
      this._selectedDate = null;
      this._selectedMonth = null;
      this._selectedYear = null;
    }

    if (emitChanges) {
      const valueToEmit = isValidDate(date) ? date : null;
      this._inputDirective.onChange(valueToEmit);
    }
  }

  _getDelimeters(format: string): any {
    return format.match(/[^(dmy)]{1,}/g);
  }

  _parseDate(dateString: string, format: string, delimeters: any): Date {
    let delimeterPattern: string;

    if (delimeters[0] !== delimeters[1]) {
      delimeterPattern = delimeters[0] + delimeters[1];
    } else {
      delimeterPattern = delimeters[0];
    }

    const regExp = new RegExp(`[${delimeterPattern}]`);
    const dateParts = dateString.split(regExp);
    const formatParts = format.split(regExp);
    const isMonthString = format.indexOf('mmm') !== -1;

    const datesArray = [];

    for (let i = 0; i < formatParts.length; i++) {
      if (formatParts[i].indexOf('yy') !== -1) {
        datesArray[0] = { value: dateParts[i], format: formatParts[i] };
      }
      if (formatParts[i].indexOf('m') !== -1) {
        datesArray[1] = { value: dateParts[i], format: formatParts[i] };
      }
      if (formatParts[i].indexOf('d') !== -1 && formatParts[i].length <= 2) {
        datesArray[2] = { value: dateParts[i], format: formatParts[i] };
      }
    }

    let monthsNames: string[];

    if (format.indexOf('mmmm') !== -1) {
      monthsNames = this.options.monthsFull;
    } else {
      monthsNames = this.options.monthsShort;
    }

    const year = Number(datesArray[0].value);
    const month = isMonthString
      ? this._getMonthNumberByMonthName(datesArray[1].value, monthsNames)
      : Number(datesArray[1].value) - 1;
    const day = Number(datesArray[2].value);

    const parsedDate = createDate(year, month, day);

    if (month > 11 || month < 0 || day > getDaysInMonth(createDate(year, month, 1)) || day < 1) {
      return getToday();
    }

    return parsedDate;
  }

  private _getMonthNumberByMonthName(monthValue: string, monthLabels: string[]): number {
    return monthLabels.findIndex((monthLabel: string) => monthLabel === monthValue);
  }

  _applyInputDate(date: Date | null): void {
    if (!date) {
      this._clearDate();
      return;
    }

    if (isDateDisabled(date, this.minDate, this.maxDate, this.filter)) {
      return;
    }

    this._selectedDate = date;
    this._activeDate = date;
    this._updateHeaderDate(date);

    const dateString = this._formatDate(date);
    this._input.value = dateString;
    this._renderer.addClass(this._input, 'active');

    if (this._pickerRef) {
      this._pickerRef.instance.detectChanges();
    }

    this.dateChanged.emit(this._selectedDate);
  }

  _selectDate(date: Date): void {
    if (isDateDisabled(date, this.minDate, this.maxDate, this.filter)) {
      return;
    }

    this._selectedDate = date;
    this._activeDate = date;
    this._updateHeaderDate(date);

    if (this.inline) {
      this._confirmSelection(this._selectedDate);
      this.close();
    }
  }

  _confirmSelection(date: Date): void {
    if (date) {
      const dateString = this._formatDate(date);
      this._input.value = dateString;
      this._renderer.addClass(this._input, 'active');
      this._inputDirective.onChange(date);
      this.dateChanged.emit(this._selectedDate);
    }
  }

  _formatDate(date: Date): string {
    const d = getDate(date);
    const dd = this._addLeadingZero(getDate(date));
    const ddd = this.options.weekdaysShort[getDayNumber(date)];
    const dddd = this.options.weekdaysFull[getDayNumber(date)];
    const m = getMonth(date) + 1;
    const mm = this._addLeadingZero(getMonth(date) + 1);
    const mmm = this.options.monthsShort[getMonth(date)];
    const mmmm = this.options.monthsFull[getMonth(date)];
    const yy =
      getYear(date).toString().length === 2 ? getYear(date) : getYear(date).toString().slice(2, 4);
    const yyyy = getYear(date);

    const preformatted = this.format.split(/(d{1,4}|m{1,4}|y{4}|yy|!.)/g);
    let formatted = '';
    preformatted.forEach((datePart) => {
      switch (datePart) {
        case 'dddd':
          datePart = datePart.replace(datePart, dddd.toString());
          break;
        case 'ddd':
          datePart = datePart.replace(datePart, ddd.toString());
          break;
        case 'dd':
          datePart = datePart.replace(datePart, dd.toString());
          break;
        case 'd':
          datePart = datePart.replace(datePart, d.toString());
          break;
        case 'mmmm':
          datePart = datePart.replace(datePart, mmmm.toString());
          break;
        case 'mmm':
          datePart = datePart.replace(datePart, mmm.toString());
          break;
        case 'mm':
          datePart = datePart.replace(datePart, mm.toString());
          break;
        case 'm':
          datePart = datePart.replace(datePart, m.toString());
          break;
        case 'yyyy':
          datePart = datePart.replace(datePart, yyyy.toString());
          break;
        case 'yy':
          datePart = datePart.replace(datePart, yy.toString());
          break;
        default:
      }
      formatted += datePart;
    });

    return formatted;
  }

  private _addLeadingZero(value: any): string | number {
    return parseInt(value, 10) < 10 ? `0${value}` : value;
  }

  _selectYear(year: number): void {
    if (isYearDisabled(year, this.minDate, this.maxDate)) {
      return;
    }

    const daysInMonth = getDaysInMonth(createDate(year, this.activeMonth, 1));
    const day = Math.min(this.activeDay, daysInMonth);

    const newDate = createDate(year, this.activeMonth, day);

    this._activeDate = newDate;
    this._selectedYear = year;
    this._currentView = 'months';

    this._updateHeaderDate(newDate);
    this._updateControlsDisabledState();
  }

  _selectMonth(month: number): void {
    const year = this.activeYear;

    if (
      isMonthDisabled(month, year, this.minDate, this.maxDate) ||
      isYearDisabled(year, this.minDate, this.maxDate)
    ) {
      return;
    }

    const daysInMonth = getDaysInMonth(createDate(year, month, 1));
    const day = Math.min(this.activeDay, daysInMonth);

    const newDate = createDate(year, month, day);

    this._activeDate = newDate;
    this._selectedMonth = month;
    this._currentView = 'days';

    this._updateHeaderDate(newDate);
    this._updateControlsDisabledState();
  }

  _handleOkClick(): void {
    this._confirmSelection(this._selectedDate);
    this.close();
  }

  _handleCancelClick(): void {
    this._selectedDate = null;
    this._selectedMonth = null;
    this._selectedYear = null;
    this.close();
  }

  _handleClearClick(): void {
    this._clearDate();
    this._inputDirective.onChange(null);
  }

  private _clearDate(): void {
    this._selectedDate = null;
    this._selectedMonth = null;
    this._selectedYear = null;
    this._input.value = '';
    this._renderer.removeClass(this._input, 'active');
    this._setInitialDate();
    this._updateHeaderDate(this._activeDate);
    this._currentView = 'days';
  }

  private _setInitialDate(): void {
    if (this._input.value) {
      this._handleUserInput(this._input.value, false);
    } else if (this.startDate) {
      this._activeDate = this.startDate;
    } else {
      this._activeDate = new Date();
    }

    this._updateHeaderDate(this._activeDate);
    this._updateControlsDisabledState();
  }

  ngOnDestroy(): void {
    if (this._overlayRef) {
      this.close();
      this._overlayRef.dispose();
    }
  }

  static ngAcceptInputType_disabled: BooleanInput;
  static ngAcceptInputType_inline: BooleanInput;
  static ngAcceptInputType_openOnInputClick: BooleanInput;
}
