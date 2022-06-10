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

const dropInOptions: MdbAnimationOptions = {
  trigger: 'dropIn',
  delay: 0,
  duration: 500,
};

const dropInEnterOptions: MdbAnimationOptions = {
  trigger: 'dropInEnter',
  delay: 0,
  duration: 500,
};

const dropIn = (options: MdbAnimationOptions): AnimationReferenceMetadata => {
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
            opacity: 0,
            transformOrigin: 'top center',
            transform: 'scale(0)',
            easing: 'cubic-bezier(0.34, 1.61, 0.7, 1)',
            offset: 0,
          }),
          style({
            opacity: 1,
            transformOrigin: 'top center',
            transform: 'scale(1)',
            easing: 'cubic-bezier(0.34, 1.61, 0.7, 1)',
            offset: 1,
          }),
        ])
      ),
    ],
    { params }
  );
};

export function dropInAnimation(options?: MdbAnimationOptions): AnimationTriggerMetadata {
  options = getOptions(options, dropInOptions);

  return trigger(options.trigger, [transition('0 => 1', [useAnimation(dropIn(options))])]);
}

export function dropInEnterAnimation(options?: MdbAnimationOptions): AnimationTriggerMetadata {
  options = getOptions(options, dropInEnterOptions);

  return trigger(options.trigger, [transition(':enter', [useAnimation(dropIn(options))])]);
}
