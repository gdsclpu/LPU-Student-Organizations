import { Directive, EventEmitter, Output } from '@angular/core';
import { MdbTableSortHeaderDirective } from './table-sort-header.component';

export type MdbSortDirection = 'asc' | 'desc' | 'none';

export interface MdbSortChange {
  name: string;
  direction: MdbSortDirection;
}

@Directive({
  // eslint-disable-next-line @angular-eslint/directive-selector
  selector: '[mdbTableSort]',
  exportAs: 'mdbTableSort',
})
export class MdbTableSortDirective {
  headers = new Map<string, MdbTableSortHeaderDirective>();

  active: MdbTableSortHeaderDirective;

  @Output() sortChange: EventEmitter<MdbSortChange> = new EventEmitter<MdbSortChange>();

  sort(header: MdbTableSortHeaderDirective): void {
    this.active = header;

    this.headers.forEach((sortHeader) => {
      if (sortHeader.name !== header.name) {
        sortHeader.direction = 'none';
      }
    });

    this.sortChange.emit({ name: header.name, direction: header.direction });
  }

  addHeader(name: string, header: MdbTableSortHeaderDirective): void {
    this.headers.set(name, header);
  }

  removeHeader(name: string): void {
    this.headers.delete(name);
  }
}
