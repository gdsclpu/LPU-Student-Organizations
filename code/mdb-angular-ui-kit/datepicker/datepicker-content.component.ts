import { animate, AnimationEvent, state, style, transition, trigger } from '@angular/animations';
import { ChangeDetectionStrategy, ChangeDetectorRef, Component, OnDestroy } from '@angular/core';
import { Subject } from 'rxjs';
import { MdbDatepickerComponent } from './datepicker.component';

@Component({
  selector: 'mdb-datepicker-content',
  exportAs: 'mdbDatepickerContent',
  templateUrl: './datepicker-content.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  animations: [
    trigger('fadeInOutDatepicker', [
      state('void', style({ opacity: 0 })),
      state('hide', style({ opacity: 0 })),
      state('show', style({ opacity: 1 })),
      transition('* <=> *', animate('300ms ease-in-out')),
    ]),
  ],
})
export class MdbDatepickerContentComponent implements OnDestroy {
  datepicker: MdbDatepickerComponent;

  _hideAnimationDone = new Subject<void>();

  _contentAnimationState = 'show';

  constructor(private _cdRef: ChangeDetectorRef) {}

  detectChanges(): void {
    this._cdRef.markForCheck();
  }

  ngOnDestroy(): void {
    this._hideAnimationDone.complete();
  }

  onDateSelect(date: Date): void {
    this.datepicker._selectDate(date);
  }

  onYearSelect(year: number): void {
    this.datepicker._selectYear(year);
  }

  onMonthSelect(month: number): void {
    this.datepicker._selectMonth(month);
  }

  _startHideAnimation(): void {
    this._contentAnimationState = 'hide';
    this._cdRef.markForCheck();
  }

  _onAnimationDone(event: AnimationEvent): void {
    if (event.toState === 'hide') {
      this._hideAnimationDone.next();
    }
  }
}
