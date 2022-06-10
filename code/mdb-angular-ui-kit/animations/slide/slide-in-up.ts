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

const slideInUpOptions: MdbAnimationOptions = {
  trigger: 'slideInUp',
  delay: 0,
  duration: 500,
};

const slideInUpEnterOptions: MdbAnimationOptions = {
  trigger: 'slideInUpEnter',
  delay: 0,
  duration: 500,
};

const slideInUp = (options: MdbAnimationOptions): AnimationReferenceMetadata => {
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
            transform: 'translate3d(0, 100%, 0)',
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

export function slideInUpAnimation(options?: MdbAnimationOptions): AnimationTriggerMetadata {
  options = getOptions(options, slideInUpOptions);

  return trigger(options.trigger, [transition('0 => 1', [useAnimation(slideInUp(options))])]);
}

export function slideInUpEnterAnimation(options?: MdbAnimationOptions): AnimationTriggerMetadata {
  options = getOptions(options, slideInUpEnterOptions);

  return trigger(options.trigger, [transition(':enter', [useAnimation(slideInUp(options))])]);
}
