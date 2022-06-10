import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule } from '@angular/forms';
import { MdbCalendarToolsComponent } from './calendar-tools.component';
import { MdbCalendarComponent } from './calendar.component';
import { MdbCalendarMonthViewComponent } from './calendar-month-view.component';
import { MdbCalendarWeekViewComponent } from './calendar-week-view.component';
import { MdbCalendarListViewComponent } from './calendar-list-view.component';
import { MdbCalendarEventModalComponent } from './calendar-event-modal.component';
import { MdbFormsModule } from 'mdb-angular-ui-kit/forms';
import { MdbDatepickerModule } from 'mdb-angular-ui-kit/datepicker';
import { MdbTimepickerModule } from 'mdb-angular-ui-kit/timepicker';
import { MdbTooltipModule } from 'mdb-angular-ui-kit/tooltip';
import { MdbModalModule } from 'mdb-angular-ui-kit/modal';
import { MdbValidationModule } from 'mdb-angular-ui-kit/validation';

@NgModule({
  declarations: [
    MdbCalendarComponent,
    MdbCalendarToolsComponent,
    MdbCalendarMonthViewComponent,
    MdbCalendarWeekViewComponent,
    MdbCalendarListViewComponent,
    MdbCalendarEventModalComponent,
  ],
  imports: [
    CommonModule,
    MdbFormsModule,
    MdbDatepickerModule,
    MdbTimepickerModule,
    MdbTooltipModule,
    ReactiveFormsModule,
    MdbModalModule,
    MdbValidationModule,
  ],
  exports: [
    MdbCalendarComponent,
    MdbCalendarToolsComponent,
    MdbCalendarMonthViewComponent,
    MdbCalendarWeekViewComponent,
    MdbCalendarListViewComponent,
    MdbCalendarEventModalComponent,
  ],
})
export class MdbCalendarModule {}
