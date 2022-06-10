import { ViewContainerRef } from '@angular/core';

/* eslint-disable @typescript-eslint/no-inferrable-types */
export class MdbNotificationConfig<D = any> {
  position?:
    | 'top-center'
    | 'bottom-center'
    | 'top-left'
    | 'top-right'
    | 'bottom-left'
    | 'bottom-right' = 'top-right';
  width?: string = 'unset';
  delay?: number = 5000;
  autohide?: boolean = false;
  stacking?: boolean = false;
  offset?: number = 10;
  animation?: boolean = true;
  viewContainerRef?: ViewContainerRef;
  data?: D | null = null;
}
