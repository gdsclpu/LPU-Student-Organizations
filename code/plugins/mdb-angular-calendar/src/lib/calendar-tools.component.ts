import { Component, EventEmitter, Input, Output } from '@angular/core';
import { addDays, getDate, getDayNumber, getMonth, getYear } from './calendar.utils';

@Component({
  // eslint-disable-next-line @angular-eslint/component-selector
  selector: 'mdb-tools-calendar',
  templateUrl: './calendar-tools.component.html',
  styles: [],
})
export class MdbCalendarToolsComponent {
  @Input() options;
  @Input()
  get activeDate(): Date {
    return this._activeDate;
  }
  set activeDate(date: Date) {
    this._activeDate = date;
    this.setPeriod();
  }
  private _activeDate: Date;
  @Input() mondayFirst;
  @Input()
  get activeView(): String {
    return this._activeView;
  }
  set activeView(view: String) {
    this._activeView = view;
    this.setPeriod();
  }
  private _activeView: String;

  @Output() viewChange: EventEmitter<string> = new EventEmitter();
  @Output() previousBtnClick: EventEmitter<string> = new EventEmitter();
  @Output() nextBtnClick: EventEmitter<string> = new EventEmitter();
  @Output() todayBtnClick: EventEmitter<string> = new EventEmitter();

  period;

  constructor() {}

  setPeriod(): void {
    switch (this.activeView) {
      case 'month':
        this.period = `${
          this.options.months[this.activeDate.getMonth()]
        } ${this.activeDate.getFullYear()}`;
        break;
      default:
        const sundayIndex = this.mondayFirst ? 1 : 0;
        const firstDay = addDays(this.activeDate, -getDayNumber(this.activeDate) + sundayIndex);
        const lastDay = addDays(firstDay, 6);

        const periodStart = `${this.options.monthsShort[getMonth(firstDay)]} ${getDate(firstDay)}`;
        const periodEnd = `${this.options.monthsShort[getMonth(lastDay)]} ${getDate(
          lastDay
        )}, ${getYear(lastDay)}`;

        this.period = `${periodStart} - ${periodEnd}`;
        break;
    }
  }

  toggleView(view: string): void {
    this.viewChange.emit(view);
  }

  handlePreviousBtnClick(): void {
    this.previousBtnClick.emit();
  }

  handleNextBtnClick(): void {
    this.nextBtnClick.emit();
  }

  handleTodayBtnClick(): void {
    this.todayBtnClick.emit();
  }
}
