import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MdbTransferComponent } from './transfer.component';
import { MdbTransferContainerComponent } from './transfer-container.component';
import { MdbFormsModule } from 'mdb-angular-ui-kit/forms';

@NgModule({
  declarations: [MdbTransferComponent, MdbTransferContainerComponent],
  imports: [CommonModule, FormsModule, MdbFormsModule],
  exports: [MdbTransferComponent],
})
export class MdbTransferModule {}
