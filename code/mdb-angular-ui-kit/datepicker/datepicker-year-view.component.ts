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
import { YEARS_IN_ROW, YEARS_IN_VIEW } from './datepicker-const';
import {
  addYears,
  areDatesInSameView,
  getToday,
  getYear,
  getYearsOffset,
  isYearDisabled,
} from './datepicker-utils';

@Component({
  selector: 'mdb-datepicker-year-view',
  templateUrl: './datepicker-year-view.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class MdbDatepickerYearViewComponent implements OnInit {
  @ViewChild('yearsContainer', { static: true }) yearsContainer: ElementRef<HTMLElement>;

  @Input()
  get activeDate(): Date {
    return this._activeDate;
  }
  set activeDate(date: Date) {
    const oldActiveDate = this._activeDate;
    this._activeDate = date;
    if (this._isInitialized && date) {
      if (
        !areDatesInSameView(oldActiveDate, date, 'years', YEARS_IN_VIEW, this.minDate, this.maxDate)
      ) {
        this.years = this._generateYearsView(date, YEARS_IN_VIEW, YEARS_IN_ROW);
      }
    }
  }
  private _activeDate: Date;

  @Output() yearSelected: EventEmitter<number> = new EventEmitter();
  @Output() activeDateChange: EventEmitter<Date> = new EventEmitter();

  @Input() minDate: Date;
  @Input() maxDate: Date;
  @Input() selectedYear: number;
  @Input() options: any;

  years: any;

  private _isInitialized = false;

  ngOnInit(): void {
    this.years = this._generateYearsView(this._activeDate, YEARS_IN_VIEW, YEARS_IN_ROW);
    this._isInitialized = true;

    setTimeout(() => {
      this.yearsContainer.nativeElement.focus();
    }, 0);
  }

  private _generateYearsView(date: Date, yearsInView: number, yearsInRow: number): any {
    const years = [];
    const activeYear = getYear(date);
    const currentYear = getYear(getToday());
    const yearsOffset = getYearsOffset(date, yearsInView, this.minDate, this.maxDate);

    const firstYearInView = activeYear - yearsOffset;

    let row = [];

    for (let i = 0; i < yearsInView; i++) {
      const year = firstYearInView + i;
      row.push({
        name: year,
        current: currentYear === year,
        disabled: isYearDisabled(year, this.minDate, this.maxDate),
      });

      if (row.length === yearsInRow) {
        const yearsRow = row;
        years.push(yearsRow);
        row = [];
      }
    }

    return years;
  }

  _handleYearsViewKeydown(event: any): void {
    const isRTL = false;

    switch (event.keyCode) {
      case LEFT_ARROW:
        this._activeDate = addYears(this.activeDate, isRTL ? 1 : -1);
        break;
      case RIGHT_ARROW:
        this._activeDate = addYears(this.activeDate, isRTL ? -1 : 1);
        break;
      case UP_ARROW:
        this._activeDate = addYears(this.activeDate, -YEARS_IN_ROW);
        break;
      case DOWN_ARROW:
        this._activeDate = addYears(this.activeDate, YEARS_IN_ROW);
        break;
      case HOME:
        this._activeDate = addYears(
          this.activeDate,
          -getYearsOffset(this.activeDate, YEARS_IN_VIEW, this.minDate, this.maxDate)
        );
        break;
      case END:
        this._activeDate = addYears(
          this._activeDate,
          YEARS_IN_VIEW -
            getYearsOffset(this.activeDate, YEARS_IN_VIEW, this.minDate, this.maxDate) -
            1
        );
        break;
      case PAGE_UP:
        this._activeDate = addYears(this.activeDate, -YEARS_IN_VIEW);
        break;
      case PAGE_DOWN:
        this._activeDate = addYears(this.activeDate, YEARS_IN_VIEW);
        break;
      case ENTER:
      case SPACE:
        const activeYear = getYear(this.activeDate);
        this._selectYear(activeYear);
        return;
      default:
        return;
    }

    this.activeDateChange.emit(this.activeDate);

    event.preventDefault();
  }

  _selectYear(year: number): void {
    this.yearSelected.emit(year);
  }

  isActive(year: number): boolean {
    return getYear(this._activeDate) === year;
  }
}
