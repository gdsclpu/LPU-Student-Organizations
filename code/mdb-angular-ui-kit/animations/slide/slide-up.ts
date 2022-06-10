import {
  animate,
  AnimationTriggerMetadata,
  style,
  transition,
  trigger,
  state,
} from '@angular/animations';
import { MdbAnimationOptions } from '../animation.options';
import { getOptions } from '../animations.utils';

const slideUpOptions: MdbAnimationOptions = {
  trigger: 'slideUp',
  delay: 0,
  duration: 500,
};

export function slideUpAnimation(options?: MdbAnimationOptions): AnimationTriggerMetadata {
  options = getOptions(options, slideUpOptions);

  return trigger(options.trigger, [
    state(
      '1',
      style({
        transform: 'translate3d(0, -100%, 0)',
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
