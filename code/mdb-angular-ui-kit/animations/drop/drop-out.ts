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

const dropOutOptions: MdbAnimationOptions = {
  trigger: 'dropOut',
  delay: 0,
  duration: 500,
};

const dropOutLeaveOptions: MdbAnimationOptions = {
  trigger: 'dropOutLeave',
  delay: 0,
  duration: 500,
};

const dropOut = (options: MdbAnimationOptions): AnimationReferenceMetadata => {
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
            transformOrigin: 'top center',
            transform: 'scale(1)',
            easing: 'cubic-bezier(0.34, 1.61, 0.7, 1)',
            offset: 0,
          }),
          style({
            opacity: 0,
            transformOrigin: 'top center',
            transform: 'scale(0)',
            easing: 'cubic-bezier(0.34, 1.61, 0.7, 1)',
            offset: 1,
          }),
        ])
      ),
    ],
    { params }
  );
};

export function dropOutAnimation(options?: MdbAnimationOptions): AnimationTriggerMetadata {
  options = getOptions(options, dropOutOptions);

  return trigger(options.trigger, [transition('0 => 1', [useAnimation(dropOut(options))])]);
}

export function dropOutLeaveAnimation(options?: MdbAnimationOptions): AnimationTriggerMetadata {
  options = getOptions(options, dropOutLeaveOptions);

  return trigger(options.trigger, [transition(':leave', [useAnimation(dropOut(options))])]);
}
