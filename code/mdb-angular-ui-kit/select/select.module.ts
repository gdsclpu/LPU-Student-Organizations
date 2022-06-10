import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { MdbSelectComponent } from './select.component';
import { MdbSelectAllOptionComponent } from './select-all-option';
import { OverlayModule } from '@angular/cdk/overlay';
import { ReactiveFormsModule } from '@angular/forms';
import { MdbFormsModule } from 'mdb-angular-ui-kit/forms';
import { MdbOptionModule } from 'mdb-angular-ui-kit/option';

@NgModule({
  declarations: [MdbSelectComponent, MdbSelectAllOptionComponent],
  imports: [CommonModule, OverlayModule, ReactiveFormsModule],
  exports: [MdbSelectComponent, MdbSelectAllOptionComponent, MdbFormsModule, MdbOptionModule],
})
export class MdbSelectModule {}
