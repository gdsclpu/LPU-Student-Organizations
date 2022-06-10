import { BooleanInput, coerceBooleanProperty } from '@angular/cdk/coercion';
import {
  AfterViewInit,
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  EventEmitter,
  Input,
  Output,
} from '@angular/core';
import { MdbTransferData } from './transfer.interface';
@Component({
  // eslint-disable-next-line @angular-eslint/component-selector
  selector: 'mdb-transfer-container',
  templateUrl: './transfer-container.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class MdbTransferContainerComponent implements AfterViewInit {
  @Input()
  get dataType(): string {
    return this._dataType;
  }
  set dataType(type: string) {
    this._dataType = type;
  }
  private _dataType: string;

  @Input()
  get data(): Array<MdbTransferData> {
    return this._data;
  }
  set data(data: Array<MdbTransferData>) {
    this._data = data;
    this.filteredData = data;
    this.updateData();
  }
  private _data: Array<MdbTransferData> = [];

  @Input()
  get pagination(): boolean {
    return this._pagination;
  }
  set pagination(isTrue: BooleanInput) {
    this._pagination = coerceBooleanProperty(isTrue);
    this.updateData();
  }
  private _pagination = false;

  @Input()
  get elementsPerPage(): number {
    return this._elementsPerPage;
  }
  set elementsPerPage(value: number) {
    this._elementsPerPage = value;
  }
  private _elementsPerPage = 5;

  @Input()
  get search(): boolean {
    return this._search;
  }
  set search(isTrue: BooleanInput) {
    this._search = coerceBooleanProperty(isTrue);
  }
  private _search: boolean;

  @Output() readonly onSearchOutput: EventEmitter<void> = new EventEmitter();
  @Output() readonly onSelect: EventEmitter<void> = new EventEmitter();

  selectAllChecked: boolean = false;
  paginationPage = 1;
  formatedData: Array<MdbTransferData> = [];
  filteredData: Array<MdbTransferData> = [];
  searchId = this.generateUID();
  selectAllCheckboxId = this.generateUID();

  constructor(private _cdRef: ChangeDetectorRef) {}

  get selectedItemsNumebr(): number {
    return [
      ...this.data.filter((item) => {
        return item.checked;
      }),
    ].length;
  }

  get isSeletedAll(): boolean {
    return this.data.every((el) => {
      return el.checked || el.disabled;
    });
  }

  ngAfterViewInit(): void {
    this.data.forEach((el) => {
      el.id = this.generateUID();
    });
    this.updateData();
  }

  toggleSelectAll(): void {
    if (this.isSeletedAll) {
      this.data.forEach((el) => {
        if (!el.disabled) {
          el.checked = false;
        }
      });
    } else {
      this.data.forEach((el) => {
        if (!el.disabled) {
          el.checked = true;
        }
      });
    }

    if (!this.isSeletedAll) {
      this.selectAllChecked = false;
    }
    this.onSelect.emit();
  }

  toggleSelect(item: MdbTransferData): void {
    const element = this.data.find((el) => el === item);
    element.checked = !element.checked;

    if (!this.isSeletedAll) {
      this.selectAllChecked = false;
    } else {
      this.selectAllChecked = true;
    }
    this._cdRef.detectChanges();
    this.onSelect.emit();
  }

  changePaginationPage(direction: string): void {
    const lastPage = Math.ceil(this.filteredData.length / this.elementsPerPage);

    if (direction === 'next' && this.paginationPage < lastPage) {
      this.paginationPage += 1;
    } else if (direction === 'previous' && this.paginationPage > 1) {
      this.paginationPage -= 1;
    }

    this.updateData();
  }

  private _paginateData(data: Array<MdbTransferData>): Array<MdbTransferData> {
    const startIndex = (this.paginationPage - 1) * this.elementsPerPage;
    const endIndex = startIndex + this.elementsPerPage;

    return data.slice(startIndex, endIndex);
  }

  updateData(): void {
    let updatedData = this.data;

    if (this.pagination) {
      updatedData = this._paginateData(this.filteredData);
    } else {
      updatedData = this.filteredData;
    }

    this.formatedData = updatedData;
    this._cdRef.markForCheck();
  }

  onSearch(searchKey: String): void {
    const filteredData = this.data.filter((item) => {
      const lowerText = item.data.toLowerCase();
      const lowerKey = searchKey.toLowerCase();
      return lowerText.includes(lowerKey) ? item : false;
    });
    this.filteredData = filteredData;
    this.updateData();
    this.onSearchOutput.emit();
  }

  generateUID(): string {
    const uid = Math.random().toString(36).substr(2, 9);
    return `mdb-transfer-${uid}`;
  }
}
