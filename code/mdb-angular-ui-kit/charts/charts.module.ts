import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MdbChartDirective } from './charts.directive';

@NgModule({
  declarations: [MdbChartDirective],
  imports: [CommonModule],
  exports: [MdbChartDirective],
})
export class MdbChartModule {}
