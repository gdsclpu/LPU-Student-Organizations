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

const fadeOutLeftOptions: MdbAnimationOptions = {
  trigger: 'fadeOutLeft',
  delay: 0,
  duration: 500,
};

const fadeOutLeftLeaveOptions: MdbAnimationOptions = {
  trigger: 'fadeOutLeftLeave',
  delay: 0,
  duration: 500,
};

const fadeOutLeft = (options: MdbAnimationOptions): AnimationReferenceMetadata => {
  const params = {
    delay: options.delay,
    duration: options.duration,
  };

  return animation(
    [
      animate(
        '{{duration}}ms {{delay}}ms',
        keyframes([
          style({ opacity: 1, transform: 'translate3d(0, 0, 0)', easing: 'ease', offset: 0 }),
          style({ opacity: 0, transform: 'translate3d(-100%, 0, 0)', easing: 'ease', offset: 1 }),
        ])
      ),
    ],
    { params }
  );
};

export function fadeOutLeftAnimation(options?: MdbAnimationOptions): AnimationTriggerMetadata {
  options = getOptions(options, fadeOutLeftOptions);

  return trigger(options.trigger, [transition('0 => 1', [useAnimation(fadeOutLeft(options))])]);
}

export function fadeOutLeftLeaveAnimation(options?: MdbAnimationOptions): AnimationTriggerMetadata {
  options = getOptions(options, fadeOutLeftLeaveOptions);

  return trigger(options.trigger, [transition(':leave', [useAnimation(fadeOutLeft(options))])]);
}
