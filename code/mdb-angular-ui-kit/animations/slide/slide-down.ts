import {
  animate,
  AnimationTriggerMetadata,
  state,
  style,
  transition,
  trigger,
} from '@angular/animations';
import { MdbAnimationOptions } from '../animation.options';
import { getOptions } from '../animations.utils';

const slideDownOptions: MdbAnimationOptions = {
  trigger: 'slideDown',
  delay: 0,
  duration: 500,
};

export function slideDownAnimation(options?: MdbAnimationOptions): AnimationTriggerMetadata {
  options = getOptions(options, slideDownOptions);

  return trigger(options.trigger, [
    state(
      '1',
      style({
        transform: 'translate3d(0, 100%, 0)',
      })
    ),
    state(
      '0',
      style({
        transform: 'translate3d(0, 0, 0)',
      })
    ),
    transition('0 => 1', [animate('{{duration}}ms {{delay}}ms ease')], {
      params: {
        delay: options.delay,
        duration: options.duration,
      },
    }),
    transition('1 => 0', []),
  ]);
}
