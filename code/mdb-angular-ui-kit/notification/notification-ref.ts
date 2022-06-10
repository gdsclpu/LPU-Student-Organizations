import { OverlayRef } from '@angular/cdk/overlay';
import { Observable, Subject } from 'rxjs';
import { first } from 'rxjs/operators';
import { MdbNotificationContainerComponent } from '.';
import { MdbNotificationService } from './notification.service';
export class MdbNotificationRef<T> {
  constructor(
    public overlayRef: OverlayRef,
    private _notificationService: MdbNotificationService,
    private _container: MdbNotificationContainerComponent
  ) {}

  private readonly onClose$: Subject<any> = new Subject();
  readonly onClose: Observable<any> = this.onClose$.asObservable();

  close(message?: any): void {
    this.onClose$.next(message);
    this.onClose$.complete();

    this._container._hidden.pipe(first()).subscribe(() => {
      this._notificationService.updateToast(this);
      this.overlayRef.detach();
      this.overlayRef.dispose();
    });

    this._container.animationState = 'hidden';
  }

  getPosition(): DOMRect {
    const overlayPosition = this.overlayRef.overlayElement;

    if (overlayPosition) {
      return overlayPosition.getBoundingClientRect();
    } else {
      return new DOMRect();
    }
  }
}
