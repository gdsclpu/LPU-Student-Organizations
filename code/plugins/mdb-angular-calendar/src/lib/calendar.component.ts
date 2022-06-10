import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { MdbModalRef, MdbModalService } from 'mdb-angular-ui-kit/modal';
import { MdbCalendarEvent } from './calendar.event.interface';
import { addDays, addMonths } from './calendar.utils';
import { MdbCalendarEventModalComponent } from './calendar-event-modal.component';
import { take } from 'rxjs/operators';
import { MdbCalendarOptions } from './calendar.options.interface';
@Component({
  // eslint-disable-next-line @angular-eslint/component-selector
  selector: 'mdb-calendar',
  templateUrl: './calendar.component.html',
  styles: [],
})
export class MdbCalendarComponent implements OnInit {
  defaultOptions: MdbCalendarOptions = {
    weekdays: ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'],
    months: [
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
    todayCaption: 'today',
    monthCaption: 'month',
    weekCaption: 'week',
    listCaption: 'list',
    allDayCaption: 'All day event',
    noEventsCaption: 'No events	',
    summaryCaption: 'Summary',
    descriptionCaption: 'Description',
    startCaption: 'Start',
    endCaption: 'End',
    addCaption: 'Add',
    deleteCaption: 'Remove',
    editCaption: 'Edit',
    closeCaption: 'Close',
    addEventModalCaption: 'Add an event',
    editEventModalCaption: 'Edit an event',
  };

  @Input() mondayFirst = false;
  @Input()
  get defaultView(): string {
    return this._defaultView;
  }
  set defaultView(view: string) {
    this._defaultView = view;
  }
  private _defaultView = 'month';

  @Input() twelveHours = false;
  @Input() defaultDate = new Date();
  @Input() readonly = false;
  @Input() options: any;
  @Input() events: MdbCalendarEvent[];

  @Output() prev: EventEmitter<any> = new EventEmitter();
  @Output() next: EventEmitter<any> = new EventEmitter();
  @Output() today: EventEmitter<any> = new EventEmitter();
  @Output() viewChanged: EventEmitter<string> = new EventEmitter();
  @Output() eventAdded: EventEmitter<MdbCalendarEvent> = new EventEmitter();
  @Output() eventEdited: EventEmitter<MdbCalendarEvent> = new EventEmitter();
  @Output() eventDeleted: EventEmitter<MdbCalendarEvent> = new EventEmitter();

  modalRef: MdbModalRef<MdbCalendarEventModalComponent>;

  view: string;
  activeDate = new Date();

  constructor(private modalService: MdbModalService) {}

  ngOnInit(): void {
    this.options = this.options
      ? Object.assign(this.defaultOptions, this.options)
      : this.defaultOptions;

    this.activeDate = this.defaultDate;
    this.view = this.defaultView;
  }

  changeView(view: string): void {
    this.view = view;
    this.viewChanged.emit(view);
  }

  nextPeriod(): void {
    switch (this.view) {
      case 'month':
        this._nextMonth();
        break;
      default:
        this._nextWeek();
        break;
    }
    this.next.emit();
  }

  prevPeriod(): void {
    switch (this.view) {
      case 'month':
        this._previousMonth();
        break;
      default:
        this._previousWeek();
        break;
    }
    this.prev.emit();
  }

  todayPeriod(): void {
    this.activeDate = new Date();
    this.today.emit();
  }

  addEvent(newEvent: MdbCalendarEvent): void {
    const config = {
      data: {
        options: this.options,
        twelveHours: this.twelveHours,
        event: newEvent,
      },
    };

    this.modalRef = this.modalService.open(MdbCalendarEventModalComponent, config);
    this.modalRef.onClose.pipe(take(1)).subscribe((event: MdbCalendarEvent) => {
      if (!event) {
        return;
      }
      this.events = [...this.events, event];
      this.eventAdded.emit(event);
    });
  }

  openEditModal(event: MdbCalendarEvent): void {
    const config = {
      data: {
        options: this.options,
        mode: 'edit',
        twelveHours: this.twelveHours,
        event: event,
      },
    };

    this.modalRef = this.modalService.open(MdbCalendarEventModalComponent, config);
    this.modalRef.onClose.pipe(take(1)).subscribe((newEvent: MdbCalendarEvent | string) => {
      if (newEvent == 'remove') {
        this.removeEvent(event);
      } else if (newEvent) {
        const eventIndex = this.events.findIndex((el) => el.id === event.id);
        this.events[eventIndex] = newEvent as MdbCalendarEvent;
        this.events = [...this.events];
        this.eventEdited.emit(newEvent as MdbCalendarEvent);
      }
    });
  }

  editEvent(event): void {
    const eventIndex = this.events.findIndex((el) => el.id === event.id);
    this.events[eventIndex] = event;
    this.events = [...this.events];
  }

  removeEvent(event): void {
    const eventIndex = this.events.findIndex((el) => el.id === event.id);
    this.eventDeleted.emit(this.events[eventIndex]);
    this.events.splice(eventIndex, 1);
    this.events = [...this.events];
  }

  removeEvents(): void {
    this.events = [];
    this.events = [...this.events];
  }

  _nextMonth(): void {
    this.activeDate = addMonths(this.activeDate, 1);
  }

  _previousMonth(): void {
    this.activeDate = addMonths(this.activeDate, -1);
  }

  _nextWeek(): void {
    this.activeDate = addDays(this.activeDate, 7);
  }

  _previousWeek(): void {
    this.activeDate = addDays(this.activeDate, -7);
  }
}
