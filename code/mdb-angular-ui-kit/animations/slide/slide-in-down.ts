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

const slideInDownOptions: MdbAnimationOptions = {
  trigger: 'slideInDown',
  delay: 0,
  duration: 500,
};

const slideInDownEnterOptions: MdbAnimationOptions = {
  trigger: 'slideInDownEnter',
  delay: 0,
  duration: 500,
};

const slideInDown = (options: MdbAnimationOptions): AnimationReferenceMetadata => {
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
            transform: 'translate3d(0, -100%, 0)',
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

export function slideInDownAnimation(options?: MdbAnimationOptions): AnimationTriggerMetadata {
  options = getOptions(options, slideInDownOptions);

  return trigger(options.trigger, [transition('0 => 1', [useAnimation(slideInDown(options))])]);
}

export function slideInDownEnterAnimation(options?: MdbAnimationOptions): AnimationTriggerMetadata {
  options = getOptions(options, slideInDownEnterOptions);

  return trigger(options.trigger, [transition(':enter', [useAnimation(slideInDown(options))])]);
}
