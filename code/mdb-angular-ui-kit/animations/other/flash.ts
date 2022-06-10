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

const flashOptions: MdbAnimationOptions = {
  trigger: 'flash',
  delay: 0,
  duration: 500,
};

const flashEnterOptions: MdbAnimationOptions = {
  trigger: 'flashEnter',
  delay: 0,
  duration: 500,
};

const flash = (options: MdbAnimationOptions): AnimationReferenceMetadata => {
  const params = {
    delay: options.delay,
    duration: options.duration,
  };

  return animation(
    [
      animate(
        '{{duration}}ms {{delay}}ms',
        keyframes([
          style({ opacity: 1, easing: 'ease', offset: 0 }),
          style({ opacity: 0, easing: 'ease', offset: 0.25 }),
          style({ opacity: 1, easing: 'ease', offset: 0.5 }),
          style({ opacity: 0, easing: 'ease', offset: 0.75 }),
          style({ opacity: 1, easing: 'ease', offset: 1 }),
        ])
      ),
    ],
    { params }
  );
};

export function flashAnimation(options?: MdbAnimationOptions): AnimationTriggerMetadata {
  options = getOptions(options, flashOptions);

  return trigger(options.trigger, [transition('0 => 1', [useAnimation(flash(options))])]);
}

export function flashEnterAnimation(options?: MdbAnimationOptions): AnimationTriggerMetadata {
  options = getOptions(options, flashEnterOptions);

  return trigger(options.trigger, [transition(':enter', [useAnimation(flash(options))])]);
}
