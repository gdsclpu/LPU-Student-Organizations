import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MdbTableDirective } from './table.directive';
import { MdbTableSortDirective } from './table-sort.directive';
import { MdbTableSortHeaderDirective } from './table-sort-header.component';
import { MdbTablePaginationComponent } from './table-pagination.component';
import { MdbSelectModule } from 'mdb-angular-ui-kit/select';
import { MdbFormsModule } from 'mdb-angular-ui-kit/forms';
import { FormsModule } from '@angular/forms';

@NgModule({
  imports: [CommonModule, MdbSelectModule, MdbFormsModule, FormsModule],
  declarations: [
    MdbTablePaginationComponent,
    MdbTableSortDirective,
    MdbTableSortHeaderDirective,
    MdbTableDirective,
  ],
  exports: [
    MdbTablePaginationComponent,
    MdbTableSortDirective,
    MdbTableSortHeaderDirective,
    MdbTableDirective,
  ],
})
export class MdbTableModule {}
