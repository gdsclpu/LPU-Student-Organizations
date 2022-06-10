import {
  animate,
  AnimationTriggerMetadata,
  keyframes,
  style,
  transition,
  trigger,
  animation,
  useAnimation,
  AnimationReferenceMetadata,
} from '@angular/animations';
import { MdbAnimationOptions } from '../animation.options';
import { getOptions } from '../animations.utils';

const slideOutLeftOptions: MdbAnimationOptions = {
  trigger: 'slideOutLeft',
  delay: 0,
  duration: 500,
};

const slideOutLeftLeaveOptions: MdbAnimationOptions = {
  trigger: 'slideOutLeftLeave',
  delay: 0,
  duration: 500,
};

const slideOutLeft = (options: MdbAnimationOptions): AnimationReferenceMetadata => {
  const params = {
    delay: options.delay,
    duration: options.duration,
  };

  return animation(
    [
      animate(
        '{{duration}}ms {{delay}}ms',
        keyframes([
          style({ transform: 'translate3d(0, 0, 0)', easing: 'ease', offset: 0 }),
          style({
            visibility: 'hidden',
            transform: 'translate3d(-100%, 0, 0)',
            easing: 'ease',
            offset: 1,
          }),
        ])
      ),
    ],
    { params }
  );
};

export function slideOutLeftAnimation(options?: MdbAnimationOptions): AnimationTriggerMetadata {
  options = getOptions(options, slideOutLeftOptions);

  return trigger(options.trigger, [transition('0 => 1', [useAnimation(slideOutLeft(options))])]);
}

export function slideOutLeftLeaveAnimation(
  options?: MdbAnimationOptions
): AnimationTriggerMetadata {
  options = getOptions(options, slideOutLeftLeaveOptions);

  return trigger(options.trigger, [transition(':leave', [useAnimation(slideOutLeft(options))])]);
}
