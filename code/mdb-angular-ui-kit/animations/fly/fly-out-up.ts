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

const flyOutUpOptions: MdbAnimationOptions = {
  trigger: 'flyOutUp',
  delay: 0,
  duration: 500,
};

const flyOutUpLeaveOptions: MdbAnimationOptions = {
  trigger: 'flyOutUpLeave',
  delay: 0,
  duration: 500,
};

const flyOutUp = (options: MdbAnimationOptions): AnimationReferenceMetadata => {
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
            transform: 'translate3d(0, 10px, 0)',
            easing: 'cubic-bezier(0.215, 0.61, 0.355, 1)',
            offset: 0.2,
          }),
          style({
            transform: 'transform: translate3d(0, -20px, 0)',
            easing: 'cubic-bezier(0.215, 0.61, 0.355, 1)',
            offset: 0.4,
          }),
          style({
            transform: 'transform: translate3d(0, -20px, 0)',
            easing: 'cubic-bezier(0.215, 0.61, 0.355, 1)',
            offset: 0.45,
          }),
          style({
            opacity: 1,
            transform: 'transform: translate3d(0, 2000px, 0)',
            easing: 'cubic-bezier(0.215, 0.61, 0.355, 1)',
            offset: 1,
          }),
        ])
      ),
    ],
    { params }
  );
};

export function flyOutUpAnimation(options?: MdbAnimationOptions): AnimationTriggerMetadata {
  options = getOptions(options, flyOutUpOptions);

  return trigger(options.trigger, [transition('0 => 1', [useAnimation(flyOutUp(options))])]);
}

export function flyOutUpLeaveAnimation(options?: MdbAnimationOptions): AnimationTriggerMetadata {
  options = getOptions(options, flyOutUpLeaveOptions);

  return trigger(options.trigger, [transition(':leave', [useAnimation(flyOutUp(options))])]);
}
