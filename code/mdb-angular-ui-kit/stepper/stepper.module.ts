import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { MdbStepComponent } from './step.component';
import { MdbStepperComponent } from './stepper.component';
import { MdbStepIconDirective } from './step-icon.directive';
import { PortalModule } from '@angular/cdk/portal';

@NgModule({
  declarations: [MdbStepperComponent, MdbStepComponent, MdbStepIconDirective],
  exports: [MdbStepperComponent, MdbStepComponent, MdbStepIconDirective],
  imports: [CommonModule, PortalModule],
})
export class MdbStepperModule {}
