import {
  DOWN_ARROW,
  END,
  ENTER,
  HOME,
  LEFT_ARROW,
  PAGE_DOWN,
  PAGE_UP,
  RIGHT_ARROW,
  SPACE,
  UP_ARROW,
} from '@angular/cdk/keycodes';
import {
  ChangeDetectionStrategy,
  Component,
  ElementRef,
  EventEmitter,
  Input,
  OnInit,
  Output,
  ViewChild,
} from '@angular/core';
import { MONTHS_IN_ROW, YEARS_IN_VIEW } from './datepicker-const';
import {
  addMonths,
  addYears,
  areDatesInSameView,
  getMonth,
  getToday,
  getYear,
  isMonthDisabled,
} from './datepicker-utils';

@Component({
  selector: 'mdb-datepicker-month-view',
  templateUrl: './datepicker-month-view.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class MdbDatepickerMonthViewComponent implements OnInit {
  @ViewChild('monthsContainer', { static: true }) monthsContainer: ElementRef<HTMLElement>;

  @Input() options: any;
  @Input() minDate: null | Date;
  @Input() maxDate: null | Date;

  @Input()
  get activeDate(): Date {
    return this._activeDate;
  }
  set activeDate(date: Date) {
    const oldActiveDate = this._activeDate;
    this._activeDate = date;
    if (this._isInitialized && date) {
      if (
        !areDatesInSameView(
          oldActiveDate,
          date,
          'months',
          YEARS_IN_VIEW,
          this.minDate,
          this.maxDate
        )
      ) {
        this.months = this._generateMonthsView(this.options, MONTHS_IN_ROW);
      }
    }
  }
  private _activeDate: Date;

  @Input() selectedMonth: number;
  @Input() selectedYear: number;

  @Output() monthSelected: EventEmitter<number> = new EventEmitter();
  @Output() activeDateChange: EventEmitter<Date> = new EventEmitter();

  months: any;

  private _isInitialized = false;

  ngOnInit(): void {
    this._init();
  }

  private _init(): void {
    this.months = this._generateMonthsView(this.options, MONTHS_IN_ROW);
    this._isInitialized = true;

    setTimeout(() => {
      this.monthsContainer.nativeElement.focus();
    }, 0);
  }

  private _generateMonthsView(options: any, monthsInRow: number): any {
    const months = [];
    const currentMonth = getMonth(getToday());
    const currentYear = getYear(getToday());
    const activeYear = getYear(this.activeDate);

    let row = [];

    // eslint-disable-next-line @typescript-eslint/prefer-for-of
    for (let i = 0; i < options.monthsShort.length; i++) {
      row.push({
        name: options.monthsShort[i],
        index: i,
        year: activeYear,
        disabled: isMonthDisabled(i, activeYear, this.minDate, this.maxDate),
        current: i === currentMonth && activeYear === currentYear,
        label: `${options.monthsShort[i]}, ${activeYear}`,
      });

      if (row.length === monthsInRow) {
        const monthsRow = row;
        months.push(monthsRow);
        row = [];
      }
    }

    return months;
  }

  _handleMonthsViewKeydown(event: any): void {
    const isRTL = false;

    switch (event.keyCode) {
      case LEFT_ARROW:
        this.activeDate = addMonths(this.activeDate, isRTL ? 1 : -1);
        break;
      case RIGHT_ARROW:
        this.activeDate = addMonths(this.activeDate, isRTL ? -1 : 1);
        break;
      case UP_ARROW:
        this.activeDate = addMonths(this.activeDate, -4);
        break;
      case DOWN_ARROW:
        this.activeDate = addMonths(this.activeDate, 4);
        break;
      case HOME:
        this.activeDate = addMonths(this.activeDate, -getMonth(this.activeDate));
        break;
      case END:
        this.activeDate = addMonths(this.activeDate, 11 - getMonth(this.activeDate));
        break;
      case PAGE_UP:
        this.activeDate = addYears(this.activeDate, -1);
        break;
      case PAGE_DOWN:
        this.activeDate = addYears(this.activeDate, 1);
        break;
      case ENTER:
      case SPACE:
        const activeMonth = getMonth(this.activeDate);
        this._selectMonth(activeMonth);
        return;
      default:
        return;
    }

    this.activeDateChange.emit(this.activeDate);

    event.preventDefault();
  }

  _selectMonth(month: number): void {
    this.monthSelected.emit(month);
  }

  isActive(index: number): boolean {
    return getMonth(this.activeDate) === index;
  }
}
