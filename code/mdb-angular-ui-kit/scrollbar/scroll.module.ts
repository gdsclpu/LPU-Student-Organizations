import { NgModule } from '@angular/core';
import { MdbScrollbarDirective } from './scroll.directive';

@NgModule({
  declarations: [MdbScrollbarDirective],
  exports: [MdbScrollbarDirective],
})
export class MdbScrollbarModule {}
