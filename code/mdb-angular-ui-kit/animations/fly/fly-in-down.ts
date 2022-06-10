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

const flyInDownOptions: MdbAnimationOptions = {
  trigger: 'flyInDown',
  delay: 0,
  duration: 500,
};

const flyInDownEnterOptions: MdbAnimationOptions = {
  trigger: 'flyInDownEnter',
  delay: 0,
  duration: 500,
};

const flyInDown = (options: MdbAnimationOptions): AnimationReferenceMetadata => {
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
            transform: 'translate3d(0, -1500px, 0)',
            easing: 'cubic-bezier(0.215, 0.61, 0.355, 1)',
            offset: 0,
          }),
          style({
            opacity: 1,
            transform: 'translate3d(0, 25px, 0)',
            easing: 'cubic-bezier(0.215, 0.61, 0.355, 1)',
            offset: 0.6,
          }),
          style({
            transform: 'transform: translate3d(0, -10px, 0)',
            easing: 'cubic-bezier(0.215, 0.61, 0.355, 1)',
            offset: 0.75,
          }),
          style({
            transform: 'transform: translate3d(0, 5px, 0)',
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

export function flyInDownAnimation(options?: MdbAnimationOptions): AnimationTriggerMetadata {
  options = getOptions(options, flyInDownOptions);

  return trigger(options.trigger, [transition('0 => 1', [useAnimation(flyInDown(options))])]);
}

export function flyInDownEnterAnimation(options?: MdbAnimationOptions): AnimationTriggerMetadata {
  options = getOptions(options, flyInDownEnterOptions);

  return trigger(options.trigger, [transition(':enter', [useAnimation(flyInDown(options))])]);
}
