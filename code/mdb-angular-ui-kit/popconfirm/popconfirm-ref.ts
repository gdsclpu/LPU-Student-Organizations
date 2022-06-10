import { OverlayRef } from '@angular/cdk/overlay';
import { Observable, Subject } from 'rxjs';

export class MdbPopconfirmRef<T> {
  constructor(public overlayRef: OverlayRef) {}

  private readonly onClose$: Subject<any> = new Subject();
  private readonly onConfirm$: Subject<any> = new Subject();

  readonly onClose: Observable<any> = this.onClose$.asObservable();
  readonly onConfirm: Observable<any> = this.onConfirm$.asObservable();

  close(message?: any): void {
    this.onClose$.next(message);
    this.onClose$.complete();

    this.overlayRef.detach();
    this.overlayRef.dispose();
  }

  confirm(message?: any): void {
    this.onConfirm$.next(message);
    this.onConfirm$.complete();

    this.overlayRef.detach();
    this.overlayRef.dispose();
  }

  getPosition(): DOMRect {
    return this.overlayRef.overlayElement.getBoundingClientRect();
  }
}
