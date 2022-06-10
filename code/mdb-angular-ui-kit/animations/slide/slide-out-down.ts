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

const slideOutDownOptions: MdbAnimationOptions = {
  trigger: 'slideOutDown',
  delay: 0,
  duration: 500,
};

const slideOutDownLeaveOptions: MdbAnimationOptions = {
  trigger: 'slideOutDownLeave',
  delay: 0,
  duration: 500,
};

const slideOutDown = (options: MdbAnimationOptions): AnimationReferenceMetadata => {
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
            transform: 'translate3d(0, 100%, 0)',
            easing: 'ease',
            offset: 1,
          }),
        ])
      ),
    ],
    { params }
  );
};

export function slideOutDownAnimation(options?: MdbAnimationOptions): AnimationTriggerMetadata {
  options = getOptions(options, slideOutDownOptions);

  return trigger(options.trigger, [transition('0 => 1', [useAnimation(slideOutDown(options))])]);
}

export function slideOutDownLeaveAnimation(
  options?: MdbAnimationOptions
): AnimationTriggerMetadata {
  options = getOptions(options, slideOutDownLeaveOptions);

  return trigger(options.trigger, [transition(':leave', [useAnimation(slideOutDown(options))])]);
}
