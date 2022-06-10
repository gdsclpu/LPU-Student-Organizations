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

const fadeOutRightOptions: MdbAnimationOptions = {
  trigger: 'fadeOutRight',
  delay: 0,
  duration: 500,
};

const fadeOutRightLeaveOptions: MdbAnimationOptions = {
  trigger: 'fadeOutRightLeave',
  delay: 0,
  duration: 500,
};

const fadeOutRight = (options: MdbAnimationOptions): AnimationReferenceMetadata => {
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
          style({ opacity: 0, transform: 'translate3d(100%, 0, 0)', easing: 'ease', offset: 1 }),
        ])
      ),
    ],
    { params }
  );
};

export function fadeOutRightAnimation(options?: MdbAnimationOptions): AnimationTriggerMetadata {
  options = getOptions(options, fadeOutRightOptions);

  return trigger(options.trigger, [transition('0 => 1', [useAnimation(fadeOutRight(options))])]);
}

export function fadeOutRightLeaveAnimation(
  options?: MdbAnimationOptions
): AnimationTriggerMetadata {
  options = getOptions(options, fadeOutRightLeaveOptions);

  return trigger(options.trigger, [transition(':leave', [useAnimation(fadeOutRight(options))])]);
}
