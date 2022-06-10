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

const slideInRightOptions: MdbAnimationOptions = {
  trigger: 'slideInRight',
  delay: 0,
  duration: 500,
};

const slideInRightEnterOptions: MdbAnimationOptions = {
  trigger: 'slideInRightEnter',
  delay: 0,
  duration: 500,
};

const slideInRight = (options: MdbAnimationOptions): AnimationReferenceMetadata => {
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
            visibility: 'visible',
            transform: 'translate3d(100%, 0, 0)',
            easing: 'ease',
            offset: 0,
          }),
          style({ transform: 'translate3d(0, 0, 0)', easing: 'ease', offset: 1 }),
        ])
      ),
    ],
    { params }
  );
};

export function slideInRightAnimation(options?: MdbAnimationOptions): AnimationTriggerMetadata {
  options = getOptions(options, slideInRightOptions);

  return trigger(options.trigger, [transition('0 => 1', [useAnimation(slideInRight(options))])]);
}

export function slideInRightEnterAnimation(
  options?: MdbAnimationOptions
): AnimationTriggerMetadata {
  options = getOptions(options, slideInRightEnterOptions);

  return trigger(options.trigger, [transition(':enter', [useAnimation(slideInRight(options))])]);
}
