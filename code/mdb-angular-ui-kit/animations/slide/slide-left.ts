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

const slideLeftOptions: MdbAnimationOptions = {
  trigger: 'slideLeft',
  delay: 0,
  duration: 500,
};

export function slideLeftAnimation(options?: MdbAnimationOptions): AnimationTriggerMetadata {
  options = getOptions(options, slideLeftOptions);

  return trigger(options.trigger, [
    state(
      '1',
      style({
        transform: 'translate3d(-100%, 0, 0)',
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
