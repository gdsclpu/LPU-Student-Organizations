import { AfterContentInit, Component, EventEmitter, Input, Output } from '@angular/core';
import { MdbCalendarEvent } from './calendar.event.interface';
import {
  addDays,
  convertDateTo12h,
  convertTimeTo12h,
  getDate,
  getDayNumber,
  getEvents,
  getMonth,
  getYear,
} from './calendar.utils';

@Component({
  // eslint-disable-next-line @angular-eslint/component-selector
  selector: 'mdb-list-view-calendar',
  templateUrl: './calendar-list-view.component.html',
  styles: [],
})
export class MdbCalendarListViewComponent implements AfterContentInit {
  @Input() readonly: boolean;
  @Input() options: any;
  @Input() mondayFirst: boolean;
  @Input() twelveHours: boolean;
  @Input()
  get activeDate(): Date {
    return this._activeDate;
  }
  set activeDate(date: Date) {
    this._activeDate = date;
    this.listView = this.createListView();
  }
  private _activeDate: Date;
  @Input()
  get events() {
    return this._events;
  }
  set events(events: MdbCalendarEvent[]) {
    this._events = events;
    this.listView = this.createListView();
  }
  private _events: MdbCalendarEvent[];

  @Output() period: EventEmitter<any> = new EventEmitter();
  @Output() eventClicked: EventEmitter<MdbCalendarEvent> = new EventEmitter();

  listView: any;

  constructor() {}

  ngAfterContentInit(): void {
    this.listView = this.createListView();
  }

  onEventClick(event: MdbCalendarEvent): void {
    if (this.readonly) {
      return;
    }

    this.eventClicked.emit(event);
  }

  convertDateTo12hFormat(date: string): string {
    return convertDateTo12h(date);
  }

  convertTimeTo12hFormat(date: string): string {
    return convertTimeTo12h(date);
  }

  createListView(): any {
    const sundayIndex = this.mondayFirst ? 1 : 0;
    const firstDay = addDays(this.activeDate, -getDayNumber(this.activeDate) + sundayIndex);
    const lastDay = addDays(firstDay, 5);
    const period = {
      start: `${getDate(firstDay)} ${this.options.monthsShort[getMonth(firstDay)]}, ${getYear(
        firstDay
      )}`,
      end: `${getDate(lastDay)} ${this.options.monthsShort[getMonth(lastDay)]}, ${getYear(
        lastDay
      )}`,
    };

    const eventsInPeriod = getEvents(this.events, firstDay, lastDay);
    this.period.emit(period);
    return { eventsInPeriod, period };
  }
}
