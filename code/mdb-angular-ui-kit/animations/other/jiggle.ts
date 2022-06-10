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

const jiggleOptions: MdbAnimationOptions = {
  trigger: 'jiggle',
  delay: 0,
  duration: 500,
};

const jiggleEnterOptions: MdbAnimationOptions = {
  trigger: 'jiggleEnter',
  delay: 0,
  duration: 500,
};

const jiggle = (options: MdbAnimationOptions): AnimationReferenceMetadata => {
  const params = {
    delay: options.delay,
    duration: options.duration,
  };

  return animation(
    [
      animate(
        '{{duration}}ms {{delay}}ms',
        keyframes([
          style({ transform: 'scale3d(1, 1, 1)', easing: 'ease', offset: 0 }),
          style({ transform: 'scale3d(1.25, 0.75, 1)', easing: 'ease', offset: 0.3 }),
          style({ transform: 'scale3d(0.75, 1.25, 1)', easing: 'ease', offset: 0.4 }),
          style({ transform: 'scale3d(1.15, 0.85, 1)', easing: 'ease', offset: 0.5 }),
          style({ transform: 'scale3d(0.95, 1.05, 1)', easing: 'ease', offset: 0.65 }),
          style({ transform: 'scale3d(0.95, 1.05, 1)', easing: 'ease', offset: 0.75 }),
          style({ transform: 'scale3d(1, 1, 1)', easing: 'ease', offset: 1 }),
        ])
      ),
    ],
    { params }
  );
};

export function jiggleAnimation(options?: MdbAnimationOptions): AnimationTriggerMetadata {
  options = getOptions(options, jiggleOptions);

  return trigger(options.trigger, [transition('0 => 1', [useAnimation(jiggle(options))])]);
}

export function jiggleEnterAnimation(options?: MdbAnimationOptions): AnimationTriggerMetadata {
  options = getOptions(options, jiggleEnterOptions);

  return trigger(options.trigger, [transition(':enter', [useAnimation(jiggle(options))])]);
}
