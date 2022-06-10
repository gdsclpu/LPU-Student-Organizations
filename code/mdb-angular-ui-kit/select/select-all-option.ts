import { Component, OnInit, ElementRef, ChangeDetectorRef, Optional, Inject } from '@angular/core';
import {
  MDB_OPTION_PARENT,
  MDB_OPTION_GROUP,
  MdbOptionGroup,
  MdbOptionComponent,
  MdbOptionParent,
} from 'mdb-angular-ui-kit/option';

@Component({
  selector: 'mdb-select-all-option',
  template: `
    <span class="select-option-text" ngClass="{'active', active}">
      <input
        *ngIf="_multiple"
        class="form-check-input"
        type="checkbox"
        [checked]="selected"
        [disabled]="disabled"
      />
      <ng-content></ng-content>
    </span>
    <ng-content select=".select-option-icon-container"></ng-content>
  `,
})
export class MdbSelectAllOptionComponent extends MdbOptionComponent implements OnInit {
  _multiple = true;
  _optionHeight: number;

  constructor(
    _el: ElementRef,
    _cdRef: ChangeDetectorRef,
    @Optional() @Inject(MDB_OPTION_PARENT) _parent: MdbOptionParent,
    @Optional() @Inject(MDB_OPTION_GROUP) group: MdbOptionGroup
  ) {
    super(_el, _cdRef, _parent, group);
  }

  ngOnInit(): void {
    if (this._parent && this._parent.visibleOptions && this._parent.optionHeight) {
      this._optionHeight = this._parent.optionHeight;
    }
  }
}
