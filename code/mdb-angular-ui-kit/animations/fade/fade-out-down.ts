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

const fadeOutDownOptions: MdbAnimationOptions = {
  trigger: 'fadeOutDown',
  delay: 0,
  duration: 500,
};

const fadeOutDownLeaveOptions: MdbAnimationOptions = {
  trigger: 'fadeOutDownLeave',
  delay: 0,
  duration: 500,
};

const fadeOutDown = (options: MdbAnimationOptions): AnimationReferenceMetadata => {
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
          style({ opacity: 0, transform: 'translate3d(0, 100%, 0)', easing: 'ease', offset: 1 }),
        ])
      ),
    ],
    { params }
  );
};

export function fadeOutDownAnimation(options?: MdbAnimationOptions): AnimationTriggerMetadata {
  options = getOptions(options, fadeOutDownOptions);

  return trigger(options.trigger, [transition('0 => 1', [useAnimation(fadeOutDown(options))])]);
}

export function fadeOutDownLeaveAnimation(options?: MdbAnimationOptions): AnimationTriggerMetadata {
  options = getOptions(options, fadeOutDownLeaveOptions);

  return trigger(options.trigger, [transition(':leave', [useAnimation(fadeOutDown(options))])]);
}
