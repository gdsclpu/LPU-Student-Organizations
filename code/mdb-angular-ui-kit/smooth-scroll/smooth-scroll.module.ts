import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MdbSmoothScrollDirective } from './smooth-scroll.directive';

@NgModule({
  declarations: [MdbSmoothScrollDirective],
  imports: [CommonModule],
  exports: [MdbSmoothScrollDirective],
})
export class MdbSmoothScrollModule {}
