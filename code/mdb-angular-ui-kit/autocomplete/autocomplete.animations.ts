import {
  trigger,
  state,
  style,
  transition,
  animate,
  query,
  animateChild,
} from '@angular/animations';

export const dropdownContainerAnimation = trigger('dropdownContainerAnimation', [
  transition('* => void', [query('@*', [animateChild()], { optional: true })]),
]);

export const dropdownAnimation = trigger('dropdownAnimation', [
  state(
    'void',
    style({
      transform: 'scaleY(0.8)',
      opacity: 0,
    })
  ),
  state(
    'visible',
    style({
      opacity: 1,
      transform: 'scaleY(1)',
    })
  ),
  transition('void => *', animate('200ms')),
  transition('* => void', animate('200ms')),
]);
