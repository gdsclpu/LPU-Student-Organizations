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

const slideInLeftOptions: MdbAnimationOptions = {
  trigger: 'slideInLeft',
  delay: 0,
  duration: 500,
};

const slideInLeftEnterOptions: MdbAnimationOptions = {
  trigger: 'slideInLeftEnter',
  delay: 0,
  duration: 500,
};

const slideInLeft = (options: MdbAnimationOptions): AnimationReferenceMetadata => {
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
            transform: 'translate3d(-100%, 0, 0)',
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

export function slideInLeftAnimation(options?: MdbAnimationOptions): AnimationTriggerMetadata {
  options = getOptions(options, slideInLeftOptions);

  return trigger(options.trigger, [transition('0 => 1', [useAnimation(slideInLeft(options))])]);
}

export function slideInLeftEnterAnimation(options?: MdbAnimationOptions): AnimationTriggerMetadata {
  options = getOptions(options, slideInLeftEnterOptions);

  return trigger(options.trigger, [transition(':enter', [useAnimation(slideInLeft(options))])]);
}
