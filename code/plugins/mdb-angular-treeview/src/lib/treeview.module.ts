import { NgModule } from '@angular/core';
import { MdbTreeviewComponent } from './treeview.component';
import { MdbCheckboxModule } from 'mdb-angular-ui-kit/checkbox';
import { CommonModule } from '@angular/common';
import { MdbCollapseModule } from 'mdb-angular-ui-kit/collapse';

@NgModule({
  declarations: [MdbTreeviewComponent],
  imports: [CommonModule, MdbCheckboxModule, MdbCollapseModule],
  exports: [MdbTreeviewComponent],
})
export class MdbTreeviewModule {}
