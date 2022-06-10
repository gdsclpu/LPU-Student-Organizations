import {
  Component,
  OnInit,
  ChangeDetectionStrategy,
  Input,
  HostBinding,
  Optional,
  Inject,
} from '@angular/core';
import { MDB_OPTION_GROUP, MDB_OPTION_PARENT, MdbOptionParent } from './option.component';

@Component({
  selector: 'mdb-option-group',
  templateUrl: 'option-group.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  providers: [{ provide: MDB_OPTION_GROUP, useExisting: MdbOptionGroupComponent }],
})
export class MdbOptionGroupComponent implements OnInit {
  @HostBinding('class.option-group')
  optionGroup = true;
  _optionHeight = 48;

  @Input() label: string;

  @Input()
  get disabled(): boolean {
    return this._disabled;
  }
  set disabled(value: boolean) {
    this._disabled = value;
  }
  private _disabled = false;

  constructor(@Optional() @Inject(MDB_OPTION_PARENT) private _parent: MdbOptionParent) {}

  ngOnInit(): void {
    if (this._parent && this._parent.visibleOptions && this._parent.optionHeight) {
      this._optionHeight = this._parent.optionHeight;
    }
  }
}
