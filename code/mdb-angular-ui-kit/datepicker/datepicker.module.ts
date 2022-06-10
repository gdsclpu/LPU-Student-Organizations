import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { MdbDatepickerComponent } from './datepicker.component';
import { MdbDatepickerContentComponent } from './datepicker-content.component';
import { MdbDatepickerInputDirective } from './datepicker-input.directive';
import { MdbDatepickerDayViewComponent } from './datepicker-day-view.component';
import { MdbDatepickerMonthViewComponent } from './datepicker-month-view.component';
import { MdbDatepickerYearViewComponent } from './datepicker-year-view.component';
import { MdbDatepickerToggleComponent } from './datepicker-toggle.component';
import { OverlayModule } from '@angular/cdk/overlay';
import { A11yModule } from '@angular/cdk/a11y';

@NgModule({
  imports: [CommonModule, OverlayModule, A11yModule],
  declarations: [
    MdbDatepickerComponent,
    MdbDatepickerContentComponent,
    MdbDatepickerInputDirective,
    MdbDatepickerToggleComponent,
    MdbDatepickerDayViewComponent,
    MdbDatepickerMonthViewComponent,
    MdbDatepickerYearViewComponent,
  ],
  exports: [
    MdbDatepickerComponent,
    MdbDatepickerContentComponent,
    MdbDatepickerInputDirective,
    MdbDatepickerToggleComponent,
    MdbDatepickerDayViewComponent,
    MdbDatepickerMonthViewComponent,
    MdbDatepickerYearViewComponent,
  ],
})
export class MdbDatepickerModule {}
