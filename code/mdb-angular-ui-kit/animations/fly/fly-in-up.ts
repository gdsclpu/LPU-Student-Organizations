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

const flyInUpOptions: MdbAnimationOptions = {
  trigger: 'flyInUp',
  delay: 0,
  duration: 500,
};

const flyInUpEnterOptions: MdbAnimationOptions = {
  trigger: 'flyInUpEnter',
  delay: 0,
  duration: 500,
};

const flyInUp = (options: MdbAnimationOptions): AnimationReferenceMetadata => {
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
            transform: 'translate3d(0, 1500px, 0)',
            easing: 'cubic-bezier(0.215, 0.61, 0.355, 1)',
            offset: 0,
          }),
          style({
            opacity: 1,
            transform: 'translate3d(0, -20px, 0)',
            easing: 'cubic-bezier(0.215, 0.61, 0.355, 1)',
            offset: 0.6,
          }),
          style({
            transform: 'transform: translate3d(0, 10px, 0)',
            easing: 'cubic-bezier(0.215, 0.61, 0.355, 1)',
            offset: 0.75,
          }),
          style({
            transform: 'transform: translate3d(0, -5px, 0)',
            easing: 'cubic-bezier(0.215, 0.61, 0.355, 1)',
            offset: 0.9,
          }),
          style({
            transform: 'transform: translate3d(0, 0, 0)',
            easing: 'cubic-bezier(0.215, 0.61, 0.355, 1)',
            offset: 1,
          }),
        ])
      ),
    ],
    { params }
  );
};

export function flyInUpAnimation(options?: MdbAnimationOptions): AnimationTriggerMetadata {
  options = getOptions(options, flyInUpOptions);

  return trigger(options.trigger, [transition('0 => 1', [useAnimation(flyInUp(options))])]);
}

export function flyInUpEnterAnimation(options?: MdbAnimationOptions): AnimationTriggerMetadata {
  options = getOptions(options, flyInUpEnterOptions);

  return trigger(options.trigger, [transition(':enter', [useAnimation(flyInUp(options))])]);
}
