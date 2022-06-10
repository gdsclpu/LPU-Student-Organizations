import { OverlayModule } from '@angular/cdk/overlay';
import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { MdbTooltipModule } from 'mdb-angular-ui-kit/tooltip';
import { MdbVectorMapComponent } from './vector-map.component';

@NgModule({
  declarations: [MdbVectorMapComponent],
  imports: [CommonModule, MdbTooltipModule, OverlayModule],
  exports: [MdbVectorMapComponent],
})
export class MdbVectorMapModule {}
