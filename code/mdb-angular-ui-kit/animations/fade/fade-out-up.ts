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

const fadeOutUpOptions: MdbAnimationOptions = {
  trigger: 'fadeOutUp',
  delay: 0,
  duration: 500,
};

const fadeOutUpLeaveOptions: MdbAnimationOptions = {
  trigger: 'fadeOutUpLeave',
  delay: 0,
  duration: 500,
};

const fadeOutUp = (options: MdbAnimationOptions): AnimationReferenceMetadata => {
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
          style({ opacity: 0, transform: 'translate3d(0, -100%, 0)', easing: 'ease', offset: 1 }),
        ])
      ),
    ],
    { params }
  );
};

export function fadeOutUpAnimation(options?: MdbAnimationOptions): AnimationTriggerMetadata {
  options = getOptions(options, fadeOutUpOptions);

  return trigger(options.trigger, [transition('0 => 1', [useAnimation(fadeOutUp(options))])]);
}

export function fadeOutUpLeaveAnimation(options?: MdbAnimationOptions): AnimationTriggerMetadata {
  options = getOptions(options, fadeOutUpLeaveOptions);

  return trigger(options.trigger, [transition(':leave', [useAnimation(fadeOutUp(options))])]);
}
