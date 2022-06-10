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

const flyInRightOptions: MdbAnimationOptions = {
  trigger: 'flyInRight',
  delay: 0,
  duration: 500,
};

const flyInRightEnterOptions: MdbAnimationOptions = {
  trigger: 'flyInRightEnter',
  delay: 0,
  duration: 500,
};

const flyInRight = (options: MdbAnimationOptions): AnimationReferenceMetadata => {
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
            transform: 'translate3d(-1500px, 0, 0)',
            easing: 'cubic-bezier(0.215, 0.61, 0.355, 1)',
            offset: 0,
          }),
          style({
            opacity: 1,
            transform: 'translate3d(25px, 0, 0)',
            easing: 'cubic-bezier(0.215, 0.61, 0.355, 1)',
            offset: 0.6,
          }),
          style({
            transform: 'transform: translate3d(-10px, 0, 0)',
            easing: 'cubic-bezier(0.215, 0.61, 0.355, 1)',
            offset: 0.75,
          }),
          style({
            opacity: 1,
            transform: 'transform: translate3d(5px, 0, 0)',
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

export function flyInRightAnimation(options?: MdbAnimationOptions): AnimationTriggerMetadata {
  options = getOptions(options, flyInRightOptions);

  return trigger(options.trigger, [transition('0 => 1', [useAnimation(flyInRight(options))])]);
}

export function flyInRightEnterAnimation(options?: MdbAnimationOptions): AnimationTriggerMetadata {
  options = getOptions(options, flyInRightEnterOptions);

  return trigger(options.trigger, [transition(':enter', [useAnimation(flyInRight(options))])]);
}
