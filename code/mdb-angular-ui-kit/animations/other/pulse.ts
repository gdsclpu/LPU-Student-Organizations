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

const pulseOptions: MdbAnimationOptions = {
  trigger: 'pulse',
  delay: 0,
  duration: 500,
};

const pulseEnterOptions: MdbAnimationOptions = {
  trigger: 'pulseEnter',
  delay: 0,
  duration: 500,
};

const pulse = (options: MdbAnimationOptions): AnimationReferenceMetadata => {
  const params = {
    delay: options.delay,
    duration: options.duration,
  };

  return animation(
    [
      animate(
        '{{duration}}ms {{delay}}ms',
        keyframes([
          style({ transform: 'scale3d(1, 1, 1)', offset: 0 }),
          style({ transform: 'scale3d(1.05, 1.05, 1.05)', offset: 0.5 }),
          style({ transform: 'scale3d(1, 1, 1)', offset: 1 }),
        ])
      ),
    ],
    { params }
  );
};

export function pulseAnimation(options?: MdbAnimationOptions): AnimationTriggerMetadata {
  options = getOptions(options, pulseOptions);

  return trigger(options.trigger, [transition('0 => 1', [useAnimation(pulse(options))])]);
}

export function pulseEnterAnimation(options?: MdbAnimationOptions): AnimationTriggerMetadata {
  options = getOptions(options, pulseEnterOptions);

  return trigger(options.trigger, [transition(':enter', [useAnimation(pulse(options))])]);
}
