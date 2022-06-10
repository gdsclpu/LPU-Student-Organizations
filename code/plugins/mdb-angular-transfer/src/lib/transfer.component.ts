import { BooleanInput, coerceBooleanProperty } from '@angular/cdk/coercion';
import {
  ChangeDetectionStrategy,
  Component,
  EventEmitter,
  HostBinding,
  Input,
  Output,
  ViewChild,
} from '@angular/core';
import { MdbTransferContainerComponent } from './transfer-container.component';
import { MdbTransferData } from './transfer.interface';

@Component({
  // eslint-disable-next-line @angular-eslint/component-selector
  selector: 'mdb-transfer',
  templateUrl: 'transfer.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class MdbTransferComponent {
  @ViewChild('transferSourceContainer') transferSourceContainer: MdbTransferContainerComponent;
  @ViewChild('transferTargetContainer') transferTargetContainer: MdbTransferContainerComponent;

  @HostBinding('class') class = 'transfer';

  @Input()
  get dataSource(): Array<MdbTransferData> {
    return this._dataSource;
  }
  set dataSource(data: Array<MdbTransferData>) {
    this._dataSource = data;
  }
  private _dataSource: Array<MdbTransferData> = [];

  @Input()
  get dataTarget(): Array<MdbTransferData> {
    return this._dataTarget;
  }
  set dataTarget(data: Array<MdbTransferData>) {
    this._dataTarget = data;
  }
  private _dataTarget: Array<MdbTransferData> = [];

  @Input()
  get oneWay(): boolean {
    return this._oneWay;
  }
  set oneWay(isTrue: BooleanInput) {
    this._oneWay = coerceBooleanProperty(isTrue);
  }
  private _oneWay = false;

  @Input()
  get pagination(): boolean {
    return this._pagination;
  }
  set pagination(isTrue: BooleanInput) {
    this._pagination = coerceBooleanProperty(isTrue);
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
  private _search = false;

  @Output() readonly onChange: EventEmitter<void> = new EventEmitter();
  @Output() readonly onSearch: EventEmitter<void> = new EventEmitter();
  @Output() readonly onSelect: EventEmitter<void> = new EventEmitter();

  constructor() {}

  transferData(transferTo: string): void {
    switch (transferTo) {
      case 'source':
        this.sendToSource();
        break;
      case 'target':
        this.sentToTarget();
        break;
      default:
        break;
    }
    this._updateTransferContainers();
  }

  sendToSource(): void {
    const dataToTransfer = [
      ...this.dataTarget.filter((data) => {
        return data.checked;
      }),
    ];

    this.dataSource = [...this.dataSource, ...dataToTransfer];

    this.dataTarget = [
      ...this.dataTarget.filter((data) => {
        return !data.checked;
      }),
    ];

    dataToTransfer.forEach((data) => {
      data.checked = false;
    });
  }

  sentToTarget(): void {
    const dataToTransfer = [
      ...this.dataSource.filter((data) => {
        return data.checked;
      }),
    ];

    this.dataTarget = [...this.dataTarget, ...dataToTransfer];

    this.dataSource = [
      ...this.dataSource.filter((data) => {
        return !data.checked;
      }),
    ];

    dataToTransfer.forEach((data) => {
      data.checked = false;
    });
  }

  private _updateTransferContainers(): void {
    this.transferSourceContainer.updateData();
    this.transferTargetContainer.updateData();
    this.onChange.emit();
  }
}
