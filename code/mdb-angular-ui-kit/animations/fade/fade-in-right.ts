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

const fadeInRightOptions: MdbAnimationOptions = {
  trigger: 'fadeInRight',
  delay: 0,
  duration: 500,
};

const fadeInRightEnterOptions: MdbAnimationOptions = {
  trigger: 'fadeInRightEnter',
  delay: 0,
  duration: 500,
};

const fadeInRight = (options: MdbAnimationOptions): AnimationReferenceMetadata => {
  const params = {
    delay: options.delay,
    duration: options.duration,
  };

  return animation(
    [
      animate(
        '{{duration}}ms {{delay}}ms',
        keyframes([
          style({ opacity: 0, transform: 'translate3d(100%, 0, 0)', easing: 'ease', offset: 0 }),
          style({ opacity: 1, transform: 'translate3d(0, 0, 0)', easing: 'ease', offset: 1 }),
        ])
      ),
    ],
    { params }
  );
};

export function fadeInRightAnimation(options?: MdbAnimationOptions): AnimationTriggerMetadata {
  options = getOptions(options, fadeInRightOptions);

  return trigger(options.trigger, [transition('0 => 1', [useAnimation(fadeInRight(options))])]);
}

export function fadeInRightEnterAnimation(options?: MdbAnimationOptions): AnimationTriggerMetadata {
  options = getOptions(options, fadeInRightEnterOptions);

  return trigger(options.trigger, [transition(':enter', [useAnimation(fadeInRight(options))])]);
}
