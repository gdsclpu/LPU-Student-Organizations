import { BooleanInput, coerceBooleanProperty } from '@angular/cdk/coercion';
import {
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  EventEmitter,
  Input,
  Output,
} from '@angular/core';

@Component({
  selector: 'mdb-rating-icon',
  templateUrl: 'rating-icon.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class MdbRatingIconComponent {
  @Input()
  set icon(value: string) {
    this._icon = value;
  }
  get icon(): string {
    return this._icon;
  }
  @Input() color = 'primary';
  @Input()
  set active(value: boolean) {
    this._active = coerceBooleanProperty(value);
  }
  get active(): boolean {
    return this._active;
  }
  @Input()
  set after(value: string) {
    this._after = value;
  }
  get after(): string {
    return this._after;
  }
  @Input()
  set before(value: string) {
    this._before = value;
  }
  get before(): string {
    return this._before;
  }

  @Output() activeIcon: EventEmitter<MdbRatingIconComponent> = new EventEmitter();

  private _active = false;
  private _icon = 'fa-star fa-sm';
  private _originalIconClass: string;
  private _after = '';
  private _before = '';

  public disabled = false;

  constructor(private _cdRef: ChangeDetectorRef) {}

  onMouseenter(): void {
    if (this.disabled) {
      return;
    }

    this.setActive(true);
    this.activeIcon.emit(this);
  }

  setActive(isActive: boolean, iconClass?: string): void {
    this.active = isActive;

    if (iconClass) {
      this.setDynamicIcon(iconClass);
    } else {
      this.resetIcon();
    }

    this._cdRef.markForCheck();
  }

  setDynamicIcon(iconClass: string): void {
    if (!this._originalIconClass) {
      this._originalIconClass = this.icon;
    }

    this.icon = iconClass.replace('far', '');
  }

  resetIcon(): void {
    this.icon = this._originalIconClass || this.icon;
  }

  static ngAcceptInputType_active: BooleanInput;
}
