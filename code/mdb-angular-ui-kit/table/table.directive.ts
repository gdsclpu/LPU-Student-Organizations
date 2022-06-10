import { BooleanInput, coerceBooleanProperty } from '@angular/cdk/coercion';
import {
  AfterViewInit,
  ChangeDetectorRef,
  Component,
  ElementRef,
  HostBinding,
  Input,
  OnDestroy,
  OnInit,
  Renderer2,
} from '@angular/core';
import { Observable, Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { MdbTablePaginationComponent } from './table-pagination.component';
import { MdbTableSortDirective } from './table-sort.directive';

@Component({
  // eslint-disable-next-line @angular-eslint/component-selector
  selector: '[mdbTable]',
  exportAs: 'mdbTable',
  template: '<ng-content></ng-content>',
})
// eslint-disable-next-line @angular-eslint/component-class-suffix
export class MdbTableDirective<T> implements OnInit, AfterViewInit, OnDestroy {
  @Input()
  @HostBinding('class.table-striped')
  get striped(): boolean {
    return this._striped;
  }
  set striped(value: boolean) {
    this._striped = coerceBooleanProperty(value);
  }
  private _striped: boolean;

  @Input()
  @HostBinding('class.table-bordered')
  get bordered(): boolean {
    return this._bordered;
  }
  set bordered(value: boolean) {
    this._bordered = coerceBooleanProperty(value);
  }
  private _bordered: boolean;

  @Input()
  @HostBinding('class.table-borderless')
  get borderless(): boolean {
    return this._borderless;
  }
  set borderless(value: boolean) {
    this._borderless = coerceBooleanProperty(value);
  }
  private _borderless: boolean;

  @Input()
  @HostBinding('class.table-hover')
  get hover(): boolean {
    return this._hover;
  }
  set hover(value: boolean) {
    this._hover = coerceBooleanProperty(value);
  }
  private _hover: boolean;

  @Input()
  @HostBinding('class.table-sm')
  get sm(): boolean {
    return this._sm;
  }
  set sm(value: boolean) {
    this._sm = coerceBooleanProperty(value);
  }
  private _sm: boolean;

  @Input()
  @HostBinding('class.table-responsive')
  get responsive(): boolean {
    return this._responsive;
  }
  set responsive(value: boolean) {
    this._responsive = coerceBooleanProperty(value);
  }
  private _responsive: boolean;

  @Input()
  get dataSource(): T[] | null {
    return this._dataSource;
  }
  set dataSource(newData: T[] | null) {
    if (newData) {
      this._dataSource = newData;

      Promise.resolve().then(() => {
        this._updateData();
      });
    }
  }

  @Input()
  get fixedHeader(): boolean {
    return this._fixedHeader;
  }
  set fixedHeader(value: boolean) {
    this._fixedHeader = coerceBooleanProperty(value);
  }
  private _fixedHeader = false;

  @Input() filterFn: (data: T, searchTerm: string) => boolean = this.defaultFilterFn;
  @Input() pagination: MdbTablePaginationComponent;
  @Input() sort: MdbTableSortDirective;

  constructor(
    private el: ElementRef,
    private renderer: Renderer2,
    private _cdRef: ChangeDetectorRef
  ) {}

  private _dataSource: T[] | null = [];
  private _filteredData: any = [];
  private _dataSourceChanged: Subject<any> = new Subject<any>();
  private _searchText = '';

  public data: T[];

  readonly _destroy$: Subject<void> = new Subject<void>();

  addRow(newRow: any): void {
    this._dataSource.push(newRow);
  }

  addRowAfter(index: number, row: any): void {
    this._dataSource.splice(index, 0, row);
  }

  removeRow(index: number): void {
    this._dataSource.splice(index, 1);
  }

  rowRemoved(): Observable<boolean> {
    return new Observable<boolean>((observer: any) => {
      observer.next(true);
    });
  }

  removeLastRow(): void {
    this._dataSource.pop();
  }

  dataSourceChange(): Observable<any> {
    return this._dataSourceChanged;
  }

  ngOnInit(): void {
    this.renderer.addClass(this.el.nativeElement, 'table');
  }

  ngAfterViewInit(): void {
    if (this.pagination) {
      this.pagination.paginationChange.pipe(takeUntil(this._destroy$)).subscribe(() => {
        this._updateData();
      });
    }

    if (this.sort) {
      this.sort.sortChange.pipe(takeUntil(this._destroy$)).subscribe(() => {
        this._updateData();
      });
    }

    if (this.fixedHeader) {
      const tableHead = this.el.nativeElement.querySelector('thead');
      Array.from(tableHead.firstElementChild.children).forEach((child: any) => {
        this.renderer.addClass(child, 'fixed-cell');
      });
    }
  }

  ngOnDestroy(): void {
    this._destroy$.next();
    this._destroy$.complete();
  }

  search(value: string): void {
    this._searchText = value;
    this._updateData();
  }

  _updateData(): void {
    let updatedData: T[] = [];

    updatedData = this._filterData(this.dataSource);

    if (this.sort && this.sort.active) {
      updatedData = this._sortData(updatedData.slice());
    }

    if (this.pagination) {
      updatedData = this._paginateData(updatedData);
    }

    this.data = updatedData;

    this._cdRef.markForCheck();
  }

  private _filterData(data: T[]): T[] {
    if (this._searchText === null || this._searchText === '') {
      this._filteredData = data;
    } else {
      this._filteredData = data.filter((obj: T) => this.filterFn(obj, this._searchText));
    }

    if (this.pagination) {
      this.pagination.total = this._filteredData.length;

      const currentPage = this.pagination.page;

      if (currentPage > 0) {
        const lastPage = Math.ceil(this.pagination.total / this.pagination.entries) - 1 || 0;

        if (currentPage > lastPage) {
          this.pagination.page = lastPage;
        }
      }
    }

    return this._filteredData;
  }

  defaultFilterFn(data: T, searchTerm: string): boolean {
    return Object.keys(data).some((key: any) => {
      if (data[key]) {
        return data[key].toString().toLowerCase().includes(searchTerm.toLowerCase());
      }
    });
  }

  private _sortData(data: T[]): T[] {
    const name = this.sort.active.name;
    const direction = this.sort.active.direction;

    if (direction !== 'none') {
      return data.sort((a, b) => {
        const result = this._sortFn(a[name], b[name]);
        return direction === 'asc' ? result : -result;
      });
    } else {
      return data;
    }
  }

  private _sortFn = (a: string | number, b: string | number) => (a < b ? -1 : a > b ? 1 : 0);

  private _paginateData(data: T[]): T[] {
    const startIndex = this.pagination.page * this.pagination.entries;
    const endIndex = startIndex + this.pagination.entries;

    return data.slice(startIndex, endIndex);
  }

  static ngAcceptInputType_striped: BooleanInput;
  static ngAcceptInputType_bordered: BooleanInput;
  static ngAcceptInputType_borderless: BooleanInput;
  static ngAcceptInputType_hover: BooleanInput;
  static ngAcceptInputType_sm: BooleanInput;
  static ngAcceptInputType_responsive: BooleanInput;
  static ngAcceptInputType_fixedHeader: BooleanInput;
}
