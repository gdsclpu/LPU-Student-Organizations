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

const slideOutRightOptions: MdbAnimationOptions = {
  trigger: 'slideOutRight',
  delay: 0,
  duration: 500,
};

const slideOutRightLeaveOptions: MdbAnimationOptions = {
  trigger: 'slideOutRightLeave',
  delay: 0,
  duration: 500,
};

const slideOutRight = (options: MdbAnimationOptions): AnimationReferenceMetadata => {
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
            transform: 'translate3d(100%, 0, 0)',
            easing: 'ease',
            offset: 1,
          }),
        ])
      ),
    ],
    { params }
  );
};

export function slideOutRightAnimation(options?: MdbAnimationOptions): AnimationTriggerMetadata {
  options = getOptions(options, slideOutRightOptions);

  return trigger(options.trigger, [transition('0 => 1', [useAnimation(slideOutRight(options))])]);
}

export function slideOutRightLeaveAnimation(
  options?: MdbAnimationOptions
): AnimationTriggerMetadata {
  options = getOptions(options, slideOutRightLeaveOptions);

  return trigger(options.trigger, [transition(':leave', [useAnimation(slideOutRight(options))])]);
}
