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

const fadeInLeftOptions: MdbAnimationOptions = {
  trigger: 'fadeInLeft',
  delay: 0,
  duration: 500,
};

const fadeInLeftEnterOptions: MdbAnimationOptions = {
  trigger: 'fadeInLeftEnter',
  delay: 0,
  duration: 500,
};

const fadeInLeft = (options: MdbAnimationOptions): AnimationReferenceMetadata => {
  const params = {
    delay: options.delay,
    duration: options.duration,
  };

  return animation(
    [
      animate(
        '{{duration}}ms {{delay}}ms',
        keyframes([
          style({ opacity: 0, transform: 'translate3d(-100%, 0, 0)', easing: 'ease', offset: 0 }),
          style({ opacity: 1, transform: 'translate3d(0, 0, 0)', easing: 'ease', offset: 1 }),
        ])
      ),
    ],
    { params }
  );
};

export function fadeInLeftAnimation(options?: MdbAnimationOptions): AnimationTriggerMetadata {
  options = getOptions(options, fadeInLeftOptions);

  return trigger(options.trigger, [transition('0 => 1', [useAnimation(fadeInLeft(options))])]);
}

export function fadeInLeftEnterAnimation(options?: MdbAnimationOptions): AnimationTriggerMetadata {
  options = getOptions(options, fadeInLeftEnterOptions);

  return trigger(options.trigger, [transition(':enter', [useAnimation(fadeInLeft(options))])]);
}
