import {
  OnInit,
  Component,
  Input,
  Output,
  EventEmitter,
  Renderer2,
  ViewChildren,
  QueryList,
  ElementRef,
  AfterViewInit,
} from '@angular/core';
import {
  convertDateTo12h,
  differenceInDays,
  differenceInHours,
  generateEvent,
  getEvents,
  addDays,
  addHours,
  addMinutes,
  endOfDay,
  getDate,
  getDayNumber,
  getMonth,
  getToday,
  getYear,
  isSameDate,
  startOfDay,
} from './calendar.utils';
import { MdbCalendarEvent } from './calendar.event.interface';

@Component({
  // eslint-disable-next-line @angular-eslint/component-selector
  selector: 'mdb-week-view-calendar',
  templateUrl: './calendar-week-view.component.html',
  styles: [],
})
export class MdbCalendarWeekViewComponent implements OnInit, AfterViewInit {
  @ViewChildren('hourEl') hours: QueryList<ElementRef>;

  @Input() readonly: boolean;
  @Input() options;
  @Input() mondayFirst: boolean;
  @Input() twelveHours: boolean;
  @Input()
  get activeDate(): Date {
    return this._activeDate;
  }
  set activeDate(date: Date) {
    this._activeDate = date;
    this.weekView = this._generateWeekView();
  }
  private _activeDate: Date;
  @Input()
  get events() {
    return this._events;
  }
  set events(events: MdbCalendarEvent[]) {
    if (!events) {
      return;
    }
    this._events = events;
    this.weekView = this._generateWeekView();
  }
  private _events: MdbCalendarEvent[];

  @Output() dayClicked: EventEmitter<MdbCalendarEvent> = new EventEmitter();
  @Output() eventClicked: EventEmitter<MdbCalendarEvent> = new EventEmitter();
  @Output() eventDragged: EventEmitter<any> = new EventEmitter();

  weekView;
  hoursEl;

  isDragging = false;

  dragStart: any;
  dragEnd: any;

  selectionStartDay: Date;
  selectionEndDay: Date;

  dragTargetDay;
  hoveredEventId;
  draggedEventId;

  dayCells: HTMLElement[] = [];
  columns: HTMLElement[] = [];

  constructor(private _renderer: Renderer2) {}

  ngOnInit(): void {
    this.weekView = this._generateWeekView();
  }

  onEventClick(event: MdbCalendarEvent): void {
    if (this.readonly) {
      return;
    }

    this.eventClicked.emit(event);
  }

  ngAfterViewInit(): void {
    this.hoursEl = this.hours.toArray().map((el: ElementRef) => el.nativeElement);

    for (let i = 1; i <= 7; i++) {
      this.hoursEl.forEach((row: any) => {
        this.columns.push(row.children[i]);
      });
    }
  }

  onDayClick(day: any): void {
    if (this.readonly) {
      return;
    }

    let startDate = addMinutes(new Date(day.date.getTime()), -59);
    let endDate = day.date;

    if (day.date.getHours() === 0) {
      startDate = startOfDay(day.date);
      endDate = '';
    }

    const newCalendarEvent = generateEvent(startDate, endDate);

    this.dayClicked.emit(newCalendarEvent);
  }

  onMouseDown(event: MouseEvent, day: any): void {
    if (this.readonly) {
      return;
    }

    this.isDragging = true;
    this.dragStart = this.columns.indexOf(event.target as HTMLElement);
    this.selectionStartDay = day.date;
  }

  onMouseUp(event: MouseEvent, day: any): void {
    if (this.readonly) {
      return;
    }

    this.isDragging = false;
    this.dragEnd = this.columns.indexOf(event.target as HTMLElement);
    if (this.dragEnd !== 0) {
      this.selectRange();
    }

    this.clearSelection();
    this.selectionEndDay = day.date;

    if (this.selectionStartDay === this.selectionEndDay) {
      return;
    }

    const newCalendarEvent = generateEvent(
      addMinutes(new Date(this.selectionStartDay.getTime()), -59),
      addMinutes(new Date(this.selectionEndDay.getTime()), -59)
    );

    this.dayClicked.emit(newCalendarEvent);
  }

  onMouseMove(event: MouseEvent): void {
    if (this.readonly) {
      return;
    }

    event.preventDefault();
    if (this.isDragging) {
      this.dragEnd = this.columns.indexOf(event.target as HTMLElement);
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
      startOfDay(new Date(calendarEvent.startDate as Date)),
      addDays(this.dragTargetDay.date, -1)
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

  onHoursEventDragEnd(calendarEvent: MdbCalendarEvent): void {
    this.draggedEventId = '';
    this.hoveredEventId = '';

    const daysDifference = differenceInHours(
      calendarEvent.startDate as Date,
      this.dragTargetDay.date
    );
    const newStartDate = addHours(calendarEvent.startDate as Date, daysDifference);
    const newEndDate = addHours(calendarEvent.endDate as Date, daysDifference);

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
      this.columns
        .slice(this.dragEnd, this.dragStart + 1)
        .forEach((cell) => this._renderer.setStyle(cell, 'background-color', '#fafafa'));
    } else {
      this.columns.slice(this.dragStart, this.dragEnd + 1).forEach((cell) => {
        this._renderer.setStyle(cell, 'background-color', '#fafafa');
      });
    }
  }

  convertDateTo12hFormat(date: string): string {
    return convertDateTo12h(date);
  }

  clearSelection(): void {
    this.columns.forEach((cell) => this._renderer.removeStyle(cell, 'background-color'));
  }

  _generateWeekView(): any {
    const sundayIndex = this.mondayFirst ? 1 : 0;
    const firstDay = addDays(this.activeDate, -getDayNumber(this.activeDate) + sundayIndex);
    const lastDay = addDays(firstDay, 6);

    const period = {
      start: `${this.options.monthsShort[getMonth(firstDay)]} ${getDate(firstDay)}`,
      end: `${this.options.monthsShort[getMonth(lastDay)]} ${getDate(lastDay)}, ${getYear(
        lastDay
      )}`,
    };

    const allDayRow = [];
    const weekRows = [];
    let row = [];
    let date: Date;
    let month: number | string;
    let day: string;
    let dayNumber: number | string;
    let startDate: Date;
    let endDate: Date;
    let dayStart: Date;
    let dayEnd: Date;

    for (let i = 0; i < 24; i++) {
      row = [];

      for (let j = 0; j < 7; j++) {
        date = addDays(firstDay, j);
        month = getMonth(date) + 1;
        day = this.options.weekdays[getDayNumber(date)];
        dayNumber = getDate(date);
        startDate = addHours(startOfDay(date), i);
        endDate = addMinutes(startDate, 59.99);
        dayStart = startOfDay(date);
        dayEnd = endOfDay(date);

        if (month < 10) {
          month = '0' + month;
        }

        if (dayNumber < 10) {
          dayNumber = '0' + dayNumber;
        }

        row.push({
          date: startDate,
          isToday: isSameDate(date, getToday()),
          events: getEvents(this.events, startDate, endDate, true),
        });

        if (i === 1) {
          allDayRow.push({
            date: addDays(date, 1),
            isToday: isSameDate(date, getToday()),
            day: day,
            dayNumber: dayNumber,
            month: month,
            events: getEvents(this.events, dayStart, dayEnd),
          });
        }
      }
      weekRows.push({ row });
    }
    return { allDayRow, weekRows, period };
  }
}
function getHours(day: any): any {
  throw new Error('Function not implemented.');
}
