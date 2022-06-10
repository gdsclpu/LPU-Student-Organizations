import { BooleanInput, coerceBooleanProperty } from '@angular/cdk/coercion';
import { DOCUMENT } from '@angular/common';
import {
  Directive,
  ElementRef,
  EventEmitter,
  Inject,
  Input,
  NgZone,
  OnInit,
  Output,
} from '@angular/core';
import { fromEvent, Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';

export type MdbInfiniteScrollDirection = 'horizontal' | 'vertical';

@Directive({
  // eslint-disable-next-line @angular-eslint/directive-selector
  selector: '[mdbInfiniteScroll]',
})
export class MdbInfiniteScrollDirective implements OnInit {
  @Input() direction: MdbInfiniteScrollDirection = 'vertical';
  @Input() container: HTMLElement;

  @Input()
  get window(): boolean {
    return this._window;
  }
  set window(value: boolean) {
    this._window = coerceBooleanProperty(value);
  }
  private _window = false;

  @Output() infiniteScrollCompleted: EventEmitter<any> = new EventEmitter<any>();

  readonly _destroy$: Subject<void> = new Subject<void>();

  constructor(
    private _elementRef: ElementRef,
    private _ngZone: NgZone,
    @Inject(DOCUMENT) private _document: any
  ) {}

  get host(): HTMLElement {
    return this.container ? this.container : this._elementRef.nativeElement;
  }

  ngOnInit(): void {
    const target = this.window ? window : this.host;
    this._ngZone.runOutsideAngular(() => {
      fromEvent(target, 'scroll')
        .pipe(takeUntil(this._destroy$))
        .subscribe(() => {
          if (this._isCompleted()) {
            this._ngZone.run(() => {
              this.infiniteScrollCompleted.emit();
            });
          }
        });
    });
  }

  private _isCompleted() {
    if (this.window) {
      return this._isCompletedWindow();
    }

    return this.isCompletedContainer();
  }

  private isCompletedContainer(): boolean {
    const rect = this.host.getBoundingClientRect();

    if (this.direction === 'vertical') {
      return rect.height + this.host.scrollTop >= this.host.scrollHeight;
    } else {
      return rect.width + this.host.scrollLeft + 10 >= this.host.scrollWidth;
    }
  }

  private _isCompletedWindow(): boolean {
    return window.scrollY + window.innerHeight === this._document.documentElement.scrollHeight;
  }

  static ngAcceptInputType_window: BooleanInput;
}
