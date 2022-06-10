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

const flyInLeftOptions: MdbAnimationOptions = {
  trigger: 'flyInLeft',
  delay: 0,
  duration: 500,
};

const flyInLeftEnterOptions: MdbAnimationOptions = {
  trigger: 'flyInLeftEnter',
  delay: 0,
  duration: 500,
};

const flyInLeft = (options: MdbAnimationOptions): AnimationReferenceMetadata => {
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
            transform: 'translate3d(1500px, 0, 0)',
            easing: 'cubic-bezier(0.215, 0.61, 0.355, 1)',
            offset: 0,
          }),
          style({
            opacity: 1,
            transform: 'translate3d(-25px, 0, 0)',
            easing: 'cubic-bezier(0.215, 0.61, 0.355, 1)',
            offset: 0.6,
          }),
          style({
            transform: 'transform: translate3d(10px, 0, 0)',
            easing: 'cubic-bezier(0.215, 0.61, 0.355, 1)',
            offset: 0.75,
          }),
          style({
            opacity: 1,
            transform: 'transform: translate3d(-5px, 0, 0)',
            easing: 'cubic-bezier(0.215, 0.61, 0.355, 1)',
            offset: 0.9,
          }),
          style({
            opacity: 1,
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

export function flyInLeftAnimation(options?: MdbAnimationOptions): AnimationTriggerMetadata {
  options = getOptions(options, flyInLeftOptions);

  return trigger(options.trigger, [transition('0 => 1', [useAnimation(flyInLeft(options))])]);
}

export function flyInLeftEnterAnimation(options?: MdbAnimationOptions): AnimationTriggerMetadata {
  options = getOptions(options, flyInLeftEnterOptions);

  return trigger(options.trigger, [transition(':enter', [useAnimation(flyInLeft(options))])]);
}
