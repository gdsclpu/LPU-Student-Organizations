import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MdbInfiniteScrollDirective } from './infinite-scroll.directive';

@NgModule({
  imports: [CommonModule],
  declarations: [MdbInfiniteScrollDirective],
  exports: [MdbInfiniteScrollDirective],
})
export class MdbInfiniteScrollModule {}
