import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MdbStickyDirective } from './sticky.directive';

@NgModule({
  imports: [CommonModule],
  declarations: [MdbStickyDirective],
  exports: [MdbStickyDirective],
})
export class MdbStickyModule {}
