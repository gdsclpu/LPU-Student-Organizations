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

const fadeOutOptions: MdbAnimationOptions = {
  trigger: 'fadeOut',
  delay: 0,
  duration: 500,
};

const fadeOutLeaveOptions: MdbAnimationOptions = {
  trigger: 'fadeOutLeave',
  delay: 0,
  duration: 500,
};

const fadeOut = (options: MdbAnimationOptions): AnimationReferenceMetadata => {
  const params = {
    delay: options.delay,
    duration: options.duration,
  };

  return animation(
    [
      animate(
        '{{duration}}ms {{delay}}ms',
        keyframes([style({ opacity: 1, offset: 0 }), style({ opacity: 0, offset: 1 })])
      ),
    ],
    { params }
  );
};

export function fadeOutAnimation(options?: MdbAnimationOptions): AnimationTriggerMetadata {
  options = getOptions(options, fadeOutOptions);

  return trigger(options.trigger, [transition('0 => 1', [useAnimation(fadeOut(options))])]);
}

export function fadeOutLeaveAnimation(options?: MdbAnimationOptions): AnimationTriggerMetadata {
  options = getOptions(options, fadeOutLeaveOptions);

  return trigger(options.trigger, [transition(':leave', [useAnimation(fadeOut(options))])]);
}
