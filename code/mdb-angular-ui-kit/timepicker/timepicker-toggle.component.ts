import {
  Component,
  ViewEncapsulation,
  ChangeDetectionStrategy,
  OnInit,
  Input,
  HostListener,
  ChangeDetectorRef,
  ViewChild,
  ElementRef,
} from '@angular/core';
import { MdbTimepickerComponent } from './timepicker.component';

@Component({
  templateUrl: './timepicker-toggle.component.html',

  selector: 'mdb-timepicker-toggle',
  encapsulation: ViewEncapsulation.None,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class MdbTimepickerToggleComponent implements OnInit {
  @ViewChild('button', { static: true }) button: ElementRef<HTMLElement>;

  @Input() mdbTimepickerToggle: MdbTimepickerComponent;
  @Input() icon = 'far fa-clock';
  @Input() disabled = false;

  @HostListener('click')
  handleClick(): void {
    if (this.disabled) {
      return;
    }

    this.mdbTimepickerToggle.open();
  }

  constructor(private _cdRef: ChangeDetectorRef) {}

  ngOnInit(): void {
    this.mdbTimepickerToggle.toggle = this;
  }

  markForCheck(): void {
    this._cdRef.markForCheck();
  }
}
