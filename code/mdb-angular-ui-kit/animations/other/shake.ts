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

const shakeOptions: MdbAnimationOptions = {
  trigger: 'shake',
  delay: 0,
  duration: 500,
};

const shakeEnterOptions: MdbAnimationOptions = {
  trigger: 'shakeEnter',
  delay: 0,
  duration: 500,
};

const shake = (options: MdbAnimationOptions): AnimationReferenceMetadata => {
  const params = {
    delay: options.delay,
    duration: options.duration,
  };

  return animation(
    [
      animate(
        '{{duration}}ms {{delay}}ms',
        keyframes([
          style({ transform: 'translateX(0)', easing: 'ease', offset: 0 }),
          style({ transform: 'translateX(-10px)', easing: 'ease', offset: 0.1 }),
          style({ transform: 'translateX(10px)', easing: 'ease', offset: 0.2 }),
          style({ transform: 'translateX(-10px)', easing: 'ease', offset: 0.3 }),
          style({ transform: 'translateX(10px)', easing: 'ease', offset: 0.4 }),
          style({ transform: 'translateX(-10px)', easing: 'ease', offset: 0.5 }),
          style({ transform: 'translateX(10px)', easing: 'ease', offset: 0.6 }),
          style({ transform: 'translateX(-10px)', easing: 'ease', offset: 0.7 }),
          style({ transform: 'translateX(10px)', easing: 'ease', offset: 0.8 }),
          style({ transform: 'translateX(-10px)', easing: 'ease', offset: 0.9 }),
          style({ transform: 'translateX(0)', easing: 'ease', offset: 1 }),
        ])
      ),
    ],
    { params }
  );
};

export function shakeAnimation(options?: MdbAnimationOptions): AnimationTriggerMetadata {
  options = getOptions(options, shakeOptions);

  return trigger(options.trigger, [transition('0 => 1', [useAnimation(shake(options))])]);
}

export function shakeEnterAnimation(options?: MdbAnimationOptions): AnimationTriggerMetadata {
  options = getOptions(options, shakeEnterOptions);

  return trigger(options.trigger, [transition(':enter', [useAnimation(shake(options))])]);
}
