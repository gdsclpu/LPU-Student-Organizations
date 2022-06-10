import {
  EventEmitter,
  Component,
  Input,
  OnInit,
  Output,
  ElementRef,
  ViewChildren,
  QueryList,
  Renderer2,
  AfterViewInit,
} from '@angular/core';
import {
  getFirstDayOfWeek,
  getDaysInMonth,
  getMonth,
  addMonths,
  createDate,
  isSameDate,
  getToday,
  getDate,
  getYear,
  endOfDay,
  startOfDay,
  generateEvent,
  getEvents,
  differenceInDays,
  addDays,
  convertDateTo12h,
} from './calendar.utils';
import { MdbCalendarEvent } from './calendar.event.interface';
@Component({
  // eslint-disable-next-line @angular-eslint/component-selector
  selector: 'mdb-month-view-calendar',
  templateUrl: './calendar-month-view.component.html',
  styles: [],
})
export class MdbCalendarMonthViewComponent implements OnInit, AfterViewInit {
  @ViewChildren('dayEl') days: QueryList<ElementRef>;

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
    this.dates = this._generateDayView();
  }
  private _activeDate: Date;

  @Input()
  get events() {
    return this._events;
  }
  set events(events: MdbCalendarEvent[]) {
    this._events = events;
    this.dates = this._generateDayView();
  }
  private _events: MdbCalendarEvent[];
  @Output() dayClicked: EventEmitter<MdbCalendarEvent> = new EventEmitter();
  @Output() eventClicked: EventEmitter<MdbCalendarEvent> = new EventEmitter();
  @Output() eventDragged: EventEmitter<any> = new EventEmitter();

  dates = [];
  daysEl;
  weekdays: string[];
  isDragging = false;

  dragStart: any;
  dragEnd: any;

  selectionStartDay: Date;
  selectionEndDay: Date;

  dragTargetDay;
  hoveredEventId;
  draggedEventId;

  constructor(private _renderer: Renderer2) {}

  ngOnInit(): void {
    this.weekdays = this._getWeekdays();
    this.dates = this._generateDayView();
  }

  ngAfterViewInit() {
    this.daysEl = this.days.toArray().map((el: ElementRef) => el.nativeElement);
  }

  onEventClick(event: MdbCalendarEvent): void {
    if (this.readonly) {
      return;
    }

    this.eventClicked.emit(event);
  }

  onDayClick(day: any): void {
    if (this.readonly) {
      return;
    }

    const newCalendarEvent = generateEvent(day.date);
    this.dayClicked.emit(newCalendarEvent);
  }

  onMouseDown(event: MouseEvent, day): void {
    if (this.readonly) {
      return;
    }

    this.isDragging = true;
    this.dragStart = this.daysEl.indexOf(event.target);
    this.selectionStartDay = day.date;
  }

  onMouseUp(event: MouseEvent, day): void {
    if (this.readonly) {
      return;
    }

    this.isDragging = false;
    this.dragEnd = this.daysEl.indexOf(event.target);

    if (this.dragEnd !== 0) {
      this.selectRange();
    }

    this.clearSelection();
    this.selectionEndDay = day.date;

    if (this.selectionStartDay === this.selectionEndDay) {
      return;
    }

    const newCalendarEvent = generateEvent(this.selectionStartDay, this.selectionEndDay);
    this.dayClicked.emit(newCalendarEvent);
  }

  onMouseMove(event: MouseEvent): void {
    if (this.readonly) {
      return;
    }

    event.preventDefault();
    if (this.isDragging) {
      this.dragEnd = this.daysEl.indexOf(event.target);
      this.selectRange();
    }
  }

  onEventDragStart(calendarEvent: MdbCalendarEvent): void {
    this.draggedEventId = calendarEvent.id;
    this.clearSelection();
  }

  onEventDragEnd(calendarEvent: MdbCalendarEvent): void {
    this.draggedEventId = '';
    this.hoveredEventId = '';

    const daysDifference = differenceInDays(
      calendarEvent.startDate as Date,
      this.dragTargetDay.date
    );
    const newStartDate = addDays(calendarEvent.startDate as Date, daysDifference);
    const newEndDate = addDays(calendarEvent.endDate as Date, daysDifference);

    const newEvent = {
      ...calendarEvent,
      startDate: newStartDate,
      endDate: newEndDate,
      order: '',
    };

    this.eventDragged.emit(newEvent);
  }

  onDragEnter(event: DragEvent, day: any): void {
    this._renderer.addClass(event.target, 'dragenter');
    this.dragTargetDay = day;
  }

  onDragLeave(event: DragEvent): void {
    this._renderer.removeClass(event.target, 'dragenter');
  }

  onDragOver(event: DragEvent): boolean {
    if (event.preventDefault) {
      event.preventDefault();
    }
    return false;
  }

  onMouseEnter(event: MdbCalendarEvent): void {
    this.hoveredEventId = event.id;
  }

  onMouseLeave(): void {
    this.hoveredEventId = '';
  }

  selectRange(): void {
    this.clearSelection();
    if (this.dragEnd + 1 < this.dragStart) {
      this.daysEl
        .slice(this.dragEnd, this.dragStart + 1)
        .forEach((cell) => this._renderer.setStyle(cell, 'background-color', '#fafafa'));
    } else {
      this.daysEl
        .slice(this.dragStart, this.dragEnd + 1)
        .forEach((cell) => this._renderer.setStyle(cell, 'background-color', '#fafafa'));
    }
  }

  clearSelection(): void {
    this.daysEl.forEach((cell) => this._renderer.removeStyle(cell, 'background-color'));
  }

  convertDateTo12hFormat(date: string): string {
    return convertDateTo12h(date);
  }

  _generateDayView(): any {
    const dates = [];
    const month = getMonth(this.activeDate);
    const previousMonth = getMonth(addMonths(this.activeDate, -1));
    const nextMonth = getMonth(addMonths(this.activeDate, 1));
    const year = getYear(this.activeDate);
    const firstDay = getFirstDayOfWeek(year, month, this.mondayFirst);
    const daysInMonth = getDaysInMonth(this.activeDate);
    const daysInPreviousMonth = getDaysInMonth(addMonths(this.activeDate, -1));
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
          const date = createDate(year, previousMonth, j, 0, 0, 0, 0);

          week.push({
            date,
            currentMonth: isCurrentMonth,
            isToday: isSameDate(date, getToday()),
            dayNumber: getDate(date),
            event: getEvents(this.events, startOfDay(date), endOfDay(date), false),
          });
        }

        isCurrentMonth = true;
        // Current month
        const daysLeft = daysInWeek - week.length;
        for (let j = 0; j < daysLeft; j++) {
          const date = createDate(year, month, dayNumber, 0, 0, 0, 0);

          week.push({
            date,
            currentMonth: isCurrentMonth,
            isToday: isSameDate(date, getToday()),
            dayNumber: getDate(date),
            event: getEvents(this.events, startOfDay(date), endOfDay(date), false),
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
          const date = createDate(year, isCurrentMonth ? month : nextMonth, dayNumber, 0, 0, 0, 0);

          week.push({
            date,
            currentMonth: isCurrentMonth,
            isToday: isSameDate(date, getToday()),
            dayNumber: getDate(date),
            event: getEvents(this.events, startOfDay(date), endOfDay(date), false),
          });
          dayNumber++;
        }
      }
      dates.push(week);
    }
    return dates;
  }

  private _getWeekdays(): string[] {
    const startDay = this.mondayFirst ? 1 : 0;
    const weekdays = this.options.weekdays;
    const sortedWeekdays = weekdays.slice(startDay).concat(weekdays.slice(0, startDay));

    return startDay !== 0 ? sortedWeekdays : weekdays;
  }
}
