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

const flyOutLeftOptions: MdbAnimationOptions = {
  trigger: 'flyOutLeft',
  delay: 0,
  duration: 500,
};

const flyOutLeftLeaveOptions: MdbAnimationOptions = {
  trigger: 'flyOutLeftLeave',
  delay: 0,
  duration: 500,
};

const flyOutLeft = (options: MdbAnimationOptions): AnimationReferenceMetadata => {
  const params = {
    delay: options.delay,
    duration: options.duration,
  };

  return animation(
    [
      animate(
        '{{duration}}ms {{delay}}ms',
        keyframes([
          style({
            opacity: 1,
            transform: 'translate3d(-20px, 0, 0)',
            easing: 'cubic-bezier(0.215, 0.61, 0.355, 1)',
            offset: 0.2,
          }),
          style({
            opacity: 0,
            transform: 'transform: translate3d(2000px, 0, 0)',
            easing: 'cubic-bezier(0.215, 0.61, 0.355, 1)',
            offset: 1,
          }),
        ])
      ),
    ],
    { params }
  );
};

export function flyOutLeftAnimation(options?: MdbAnimationOptions): AnimationTriggerMetadata {
  options = getOptions(options, flyOutLeftOptions);

  return trigger(options.trigger, [transition('0 => 1', [useAnimation(flyOutLeft(options))])]);
}

export function flyOutLeftLeaveAnimation(options?: MdbAnimationOptions): AnimationTriggerMetadata {
  options = getOptions(options, flyOutLeftLeaveOptions);

  return trigger(options.trigger, [transition(':leave', [useAnimation(flyOutLeft(options))])]);
}
