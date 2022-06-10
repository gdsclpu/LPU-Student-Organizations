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

const flyOutOptions: MdbAnimationOptions = {
  trigger: 'flyOut',
  delay: 0,
  duration: 500,
};

const flyOutLeaveOptions: MdbAnimationOptions = {
  trigger: 'flyOutLeave',
  delay: 0,
  duration: 500,
};

const flyOut = (options: MdbAnimationOptions): AnimationReferenceMetadata => {
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
            transform: 'scale3d(0.9, 0.9, 0.9)',
            easing: 'cubic-bezier(0.215, 0.61, 0.355, 1)',
            offset: 0.2,
          }),
          style({
            transform: 'scale3d(1.1, 1.1, 1.1)',
            easing: 'cubic-bezier(0.215, 0.61, 0.355, 1)',
            offset: 0.5,
          }),
          style({
            transform: 'scale3d(1.1, 1.1, 1.1)',
            easing: 'cubic-bezier(0.215, 0.61, 0.355, 1)',
            offset: 0.55,
          }),
          style({
            opacity: 1,
            transform: 'scale3d(0.3, 0.3, 0.3)',
            easing: 'cubic-bezier(0.215, 0.61, 0.355, 1)',
            offset: 1,
          }),
        ])
      ),
    ],
    { params }
  );
};

export function flyOutAnimation(options?: MdbAnimationOptions): AnimationTriggerMetadata {
  options = getOptions(options, flyOutOptions);

  return trigger(options.trigger, [transition('0 => 1', [useAnimation(flyOut(options))])]);
}

export function flyOutLeaveAnimation(options?: MdbAnimationOptions): AnimationTriggerMetadata {
  options = getOptions(options, flyOutLeaveOptions);

  return trigger(options.trigger, [transition(':leave', [useAnimation(flyOut(options))])]);
}
