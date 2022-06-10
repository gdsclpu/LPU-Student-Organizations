import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MdbLazyLoadingDirective } from './lazy-loading.directive';

@NgModule({
  imports: [CommonModule],
  declarations: [MdbLazyLoadingDirective],
  exports: [MdbLazyLoadingDirective],
})
export class MdbLazyLoadingModule {}
