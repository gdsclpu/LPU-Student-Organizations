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
  Input,
  OnInit,
  Output,
  EventEmitter,
  ViewChild,
  ElementRef,
} from '@angular/core';
import { YEARS_IN_VIEW } from './datepicker-const';
import {
  addDays,
  addMonths,
  areDatesInSameView,
  createDate,
  getDate,
  getDaysInMonth,
  getFirstDayOfWeek,
  getMonth,
  getToday,
  getYear,
  isDateDisabled,
  isSameDate,
} from './datepicker-utils';

@Component({
  selector: 'mdb-datepicker-day-view',
  templateUrl: './datepicker-day-view.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class MdbDatepickerDayViewComponent implements OnInit {
  @ViewChild('datesContainer', { static: true }) datesContainer: ElementRef<HTMLElement>;

  @Input() selectedDate: Date;
  @Input() minDate: null | Date;
  @Input() maxDate: null | Date;
  @Input() filter: (date: Date) => boolean;
  @Input() startDay: number;

  @Input()
  get activeDate(): Date {
    return this._activeDate;
  }
  set activeDate(date: Date) {
    const oldActiveDate = this._activeDate;
    this._activeDate = date;
    if (this._isInitialized) {
      if (
        !areDatesInSameView(oldActiveDate, date, 'days', YEARS_IN_VIEW, this.minDate, this.maxDate)
      ) {
        this.dates = this._generateDayView(date);
      }
    }
  }
  private _activeDate: Date;

  @Input() options: any;

  @Output() dateSelected: EventEmitter<Date> = new EventEmitter();
  @Output() activeDateChange: EventEmitter<Date> = new EventEmitter();

  dates: any;
  weekdays: string[];
  private _isInitialized = false;

  ngOnInit(): void {
    this.init();
  }

  private init(): void {
    this.dates = this._generateDayView(this.activeDate);
    this.weekdays = this._getWeekdays(this.startDay);
    this._isInitialized = true;

    setTimeout(() => {
      this.datesContainer.nativeElement.focus();
    }, 0);
  }

  private _generateDayView(activeDate: Date): any {
    const dates = [];

    const month = getMonth(activeDate);
    const previousMonth = getMonth(addMonths(activeDate, -1));
    const nextMonth = getMonth(addMonths(activeDate, 1));
    const year = getYear(activeDate);

    const firstDay = getFirstDayOfWeek(year, month, this.startDay);
    const daysInMonth = getDaysInMonth(activeDate);
    const daysInPreviousMonth = getDaysInMonth(addMonths(activeDate, -1));
    const daysInWeek = 7;

    let dayNumber = 1;
    let isCurrentMonth = false;
    for (let i = 1; i < daysInWeek; i++) {
      const week = [];
      if (i === 1) {
        // First week
        const previousMonthDay = daysInPreviousMonth - firstDay + 1;
        // Previous month
        for (let j = previousMonthDay; j <= daysInPreviousMonth; j++) {
          const date = createDate(year, previousMonth, j);

          week.push({
            date,
            currentMonth: isCurrentMonth,
            isToday: isSameDate(date, getToday()),
            dayNumber: getDate(date),
            disabled: isDateDisabled(date, this.minDate, this.maxDate, this.filter),
          });
        }

        isCurrentMonth = true;
        // Current month
        const daysLeft = daysInWeek - week.length;
        for (let j = 0; j < daysLeft; j++) {
          const date = createDate(year, month, dayNumber);

          week.push({
            date,
            currentMonth: isCurrentMonth,
            isToday: isSameDate(date, getToday()),
            dayNumber: getDate(date),
            disabled: isDateDisabled(date, this.minDate, this.maxDate, this.filter),
          });
          dayNumber++;
        }
      } else {
        // Rest of the weeks
        for (let j = 1; j < 8; j++) {
          if (dayNumber > daysInMonth) {
            // Next month
            dayNumber = 1;
            isCurrentMonth = false;
          }
          const date = createDate(year, isCurrentMonth ? month : nextMonth, dayNumber);

          week.push({
            date,
            currentMonth: isCurrentMonth,
            isToday: isSameDate(date, getToday()),
            dayNumber: getDate(date),
            disabled: isDateDisabled(date, this.minDate, this.maxDate, this.filter),
          });
          dayNumber++;
        }
      }
      dates.push(week);
    }

    return dates;
  }

  private _getWeekdays(startDay: number): string[] {
    const weekdays = this.options.weekdaysNarrow;
    const sortedWeekdays = weekdays.slice(startDay).concat(weekdays.slice(0, startDay));

    return startDay !== 0 ? sortedWeekdays : weekdays;
  }

  _handleDaysViewKeydown(event: any): void {
    const isRTL = false;

    switch (event.keyCode) {
      case LEFT_ARROW:
        this.activeDate = addDays(this.activeDate, isRTL ? 1 : -1);
        break;
      case RIGHT_ARROW:
        this.activeDate = addDays(this.activeDate, isRTL ? -1 : 1);
        break;
      case UP_ARROW:
        this.activeDate = addDays(this.activeDate, -7);
        break;
      case DOWN_ARROW:
        this.activeDate = addDays(this.activeDate, 7);
        break;
      case HOME:
        this.activeDate = addDays(this.activeDate, 1 - getDate(this.activeDate));
        break;
      case END:
        this.activeDate = addDays(
          this.activeDate,
          getDaysInMonth(this.activeDate) - getDate(this.activeDate)
        );
        break;
      case PAGE_UP:
        this.activeDate = addMonths(this._activeDate, -1);
        break;
      case PAGE_DOWN:
        this.activeDate = addMonths(this._activeDate, 1);
        break;
      case ENTER:
      case SPACE:
        this.dateSelected.emit(this._activeDate);
        event.preventDefault();
        return;
      default:
        return;
    }

    this.activeDateChange.emit(this._activeDate);
    event.preventDefault();
  }

  _isSameDate(date: Date, selectedDate: Date): boolean {
    if (!selectedDate) {
      return;
    }
    return isSameDate(date, selectedDate);
  }

  _selectDate(date: Date): void {
    this.dateSelected.emit(date);
  }
}
