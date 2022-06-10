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

const flyInOptions: MdbAnimationOptions = {
  trigger: 'flyIn',
  delay: 0,
  duration: 500,
};

const flyInEnterOptions: MdbAnimationOptions = {
  trigger: 'flyInEnter',
  delay: 0,
  duration: 500,
};

const flyIn = (options: MdbAnimationOptions): AnimationReferenceMetadata => {
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
            transform: 'scale3d(1, 1, 1)',
            easing: 'cubic-bezier(0.215, 0.61, 0.355, 1)',
            offset: 0,
          }),
          style({
            transform: 'scale3d(1.1, 1.1, 1.1)',
            easing: 'cubic-bezier(0.215, 0.61, 0.355, 1)',
            offset: 0.2,
          }),
          style({
            transform: 'scale3d(0.9, 0.9, 0.9)',
            easing: 'cubic-bezier(0.215, 0.61, 0.355, 1)',
            offset: 0.4,
          }),
          style({
            opacity: 1,
            transform: 'scale3d(1.03, 1.03, 1.03)',
            easing: 'cubic-bezier(0.215, 0.61, 0.355, 1)',
            offset: 0.6,
          }),
          style({
            opacity: 1,
            transform: 'scale3d(0.97, 0.97, 0.97)',
            easing: 'cubic-bezier(0.215, 0.61, 0.355, 1)',
            offset: 0.8,
          }),
          style({
            opacity: 1,
            transform: 'scale3d(1, 1, 1)',
            easing: 'cubic-bezier(0.215, 0.61, 0.355, 1)',
            offset: 1,
          }),
        ])
      ),
    ],
    { params }
  );
};

export function flyInAnimation(options?: MdbAnimationOptions): AnimationTriggerMetadata {
  options = getOptions(options, flyInOptions);

  return trigger(options.trigger, [transition('0 => 1', [useAnimation(flyIn(options))])]);
}

export function flyInEnterAnimation(options?: MdbAnimationOptions): AnimationTriggerMetadata {
  options = getOptions(options, flyInEnterOptions);

  return trigger(options.trigger, [transition(':enter', [useAnimation(flyIn(options))])]);
}
