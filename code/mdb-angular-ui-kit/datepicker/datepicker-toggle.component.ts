import {
  ViewEncapsulation,
  ChangeDetectionStrategy,
  Component,
  Input,
  HostListener,
  OnInit,
  ElementRef,
  ViewChild,
} from '@angular/core';
import { MdbDatepickerComponent } from './datepicker.component';

@Component({
  selector: 'mdb-datepicker-toggle',
  templateUrl: './datepicker-toggle.component.html',
  encapsulation: ViewEncapsulation.None,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class MdbDatepickerToggleComponent implements OnInit {
  @ViewChild('button', { static: true }) button: ElementRef<HTMLElement>;

  @Input() disabled = false;
  @Input() icon = 'far fa-calendar';
  @Input() mdbDatepicker: MdbDatepickerComponent;

  constructor() {}

  @HostListener('click')
  onClick(): void {
    if (this.disabled) {
      return;
    }

    this.toggle();
  }

  open(): void {
    this.mdbDatepicker.open();
  }

  close(): void {
    this.mdbDatepicker.close();
  }

  toggle(): void {
    this.mdbDatepicker.toggle();
  }

  ngOnInit(): void {
    this.mdbDatepicker._toggle = this;
  }
}
