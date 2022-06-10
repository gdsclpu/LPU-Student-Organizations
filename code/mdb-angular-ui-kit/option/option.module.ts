import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { MdbOptionComponent } from './option.component';
import { MdbOptionGroupComponent } from './option-group.component';

@NgModule({
  declarations: [MdbOptionComponent, MdbOptionGroupComponent],
  imports: [CommonModule],
  exports: [MdbOptionComponent, MdbOptionGroupComponent],
})
export class MdbOptionModule {}
