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

const fadeInOptions: MdbAnimationOptions = {
  trigger: 'fadeIn',
  delay: 0,
  duration: 500,
};

const fadeInEnterOptions: MdbAnimationOptions = {
  trigger: 'fadeInEnter',
  delay: 0,
  duration: 500,
};

const fadeIn = (options: MdbAnimationOptions): AnimationReferenceMetadata => {
  const params = {
    delay: options.delay,
    duration: options.duration,
  };

  return animation(
    [
      animate(
        '{{duration}}ms {{delay}}ms',
        keyframes([style({ opacity: 0, offset: 0 }), style({ opacity: 1, offset: 1 })])
      ),
    ],
    { params }
  );
};

export function fadeInAnimation(options?: MdbAnimationOptions): AnimationTriggerMetadata {
  options = getOptions(options, fadeInOptions);

  return trigger(options.trigger, [transition('0 => 1', [useAnimation(fadeIn(options))])]);
}

export function fadeInEnterAnimation(options?: MdbAnimationOptions): AnimationTriggerMetadata {
  options = getOptions(options, fadeInEnterOptions);

  return trigger(options.trigger, [transition(':enter', [useAnimation(fadeIn(options))])]);
}
