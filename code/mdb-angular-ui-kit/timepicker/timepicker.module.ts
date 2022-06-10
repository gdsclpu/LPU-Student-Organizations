import { OverlayModule } from '@angular/cdk/overlay';
import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { A11yModule } from '@angular/cdk/a11y';
import { MdbTimepickerToggleComponent } from './timepicker-toggle.component';
import { MdbTimepickerDirective } from './timepicker.directive';
import { MdbTimepickerComponent } from './timepicker.component';
import { MdbTimepickerContentComponent } from './timepicker.content';

@NgModule({
  imports: [CommonModule, OverlayModule, A11yModule],
  declarations: [
    MdbTimepickerComponent,
    MdbTimepickerToggleComponent,
    MdbTimepickerDirective,
    MdbTimepickerContentComponent,
  ],
  exports: [MdbTimepickerComponent, MdbTimepickerToggleComponent, MdbTimepickerDirective],
  bootstrap: [MdbTimepickerContentComponent],
})
export class MdbTimepickerModule {}
