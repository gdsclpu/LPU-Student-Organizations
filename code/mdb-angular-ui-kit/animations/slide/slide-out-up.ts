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

const slideOutUpOptions: MdbAnimationOptions = {
  trigger: 'slideOutUp',
  delay: 0,
  duration: 500,
};

const slideOutUpLeaveOptions: MdbAnimationOptions = {
  trigger: 'slideOutUpLeave',
  delay: 0,
  duration: 500,
};

const slideOutUp = (options: MdbAnimationOptions): AnimationReferenceMetadata => {
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
            transform: 'translate3d(0, -100%, 0)',
            easing: 'ease',
            offset: 1,
          }),
        ])
      ),
    ],
    { params }
  );
};

export function slideOutUpAnimation(options?: MdbAnimationOptions): AnimationTriggerMetadata {
  options = getOptions(options, slideOutUpOptions);

  return trigger(options.trigger, [transition('0 => 1', [useAnimation(slideOutUp(options))])]);
}

export function slideOutUpLeaveAnimation(options?: MdbAnimationOptions): AnimationTriggerMetadata {
  options = getOptions(options, slideOutUpLeaveOptions);

  return trigger(options.trigger, [transition(':leave', [useAnimation(slideOutUp(options))])]);
}
