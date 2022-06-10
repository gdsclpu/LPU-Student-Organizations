import {
  animate,
  AnimationTriggerMetadata,
  state,
  style,
  transition,
  trigger,
} from '@angular/animations';

export const horizontalAnimation: AnimationTriggerMetadata = trigger('horizontalAnimation', [
  state('previous', style({ transform: 'translateX(-100%)', visibility: 'hidden' })),
  state('next', style({ transform: 'translateX(100%)', visibility: 'hidden' })),
  state('current', style({ transform: 'none', visibility: 'visible' })),
  transition('* => *', animate('600ms ease')),
]);

export const verticalAnimation: AnimationTriggerMetadata = trigger('verticalAnimation', [
  state('previous', style({ height: '0px', visibility: 'hidden' })),
  state('next', style({ height: '0px', visibility: 'hidden' })),
  state('current', style({ height: '*', visibility: 'visible' })),
  transition('* => *', animate('300ms ease')),
]);
