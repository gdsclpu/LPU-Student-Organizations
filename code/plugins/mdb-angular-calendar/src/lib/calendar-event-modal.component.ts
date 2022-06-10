import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { MdbModalRef } from 'mdb-angular-ui-kit/modal';
import { MdbCalendarEvent } from './calendar.event.interface';
import { convertTimeTo12h, generateEvent, getDate, getMonth, getYear } from './calendar.utils';

@Component({
  // eslint-disable-next-line @angular-eslint/component-selector
  selector: 'mdb-calendar-event-modal',
  templateUrl: 'calendar-event-modal.component.html',
})
export class MdbCalendarEventModalComponent implements OnInit {
  options;
  description = '';
  mode: string;
  event: any;
  editable = true;
  color = 'primary';
  twelveHours = false;

  eventForm: FormGroup;

  constructor(public modalRef: MdbModalRef<MdbCalendarEventModalComponent>) {}

  ngOnInit(): void {
    const startData = this.event.startData;
    const endData = this.event.endData;
    let startTime = startData.time;
    let endTime = endData.time;

    if (this.twelveHours) {
      startTime = convertTimeTo12h(startTime);
      endTime = convertTimeTo12h(endTime);
    }

    this.eventForm = new FormGroup({
      summary: new FormControl(
        { value: this.event.summary, disabled: !this.editable },
        { validators: Validators.required, updateOn: 'submit' }
      ),
      description: new FormControl({ value: this.event.description, disabled: !this.editable }),
      allDay: new FormControl({ value: this.event.allDay, disabled: !this.editable }),
      startDate: new FormControl(
        {
          value: new Date(`${startData.year}/${startData.month}/${startData.day}`),
          disabled: !this.editable,
        },
        { validators: Validators.required, updateOn: 'submit' }
      ),
      endDate: new FormControl(
        {
          value: new Date(`${endData.year}/${endData.month}/${endData.day}`),
          disabled: !this.editable,
        },
        { validators: Validators.required, updateOn: 'submit' }
      ),
      startTime: new FormControl({ value: startTime, disabled: !this.editable }),
      endTime: new FormControl({ value: endTime, disabled: !this.editable }),
      color: new FormControl({ value: this.event.color.background, disabled: !this.editable }),
    });
  }

  onRemoveClick(): void {
    this.modalRef.close('remove');
  }

  onSubmit(): void {
    this.eventForm.markAllAsTouched();

    if (this.mode === 'add' && this.eventForm.status === 'VALID') {
      this.modalRef.close(this.parseEventData());
    } else if (this.eventForm.status === 'VALID') {
      this.modalRef.close(this.parseEventData());
    }
  }

  parseEventData(): MdbCalendarEvent {
    const newEvent = this.eventForm.value;
    const summary = newEvent.summary;
    const description = newEvent.description;
    const allDay = newEvent.allDay;
    const startDate = newEvent.startDate;
    const endDate = newEvent.endDate;
    const startTime = newEvent.startTime;
    const endTime = newEvent.endTime;
    const eventColor = newEvent.color;
    let startDateTime = `${getYear(startDate)}/${getMonth(startDate) + 1}/${getDate(
      startDate
    )} ${startTime}`;
    let endDateTime = `${getYear(endDate)}/${getMonth(endDate) + 1}/${getDate(endDate)} ${endTime}`;

    const event = generateEvent(new Date(startDateTime), new Date(endDateTime));

    return {
      ...event,
      summary,
      description,
      allDay,
      color: {
        background: eventColor,
      },
    };
  }
}
