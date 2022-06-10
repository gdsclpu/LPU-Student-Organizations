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

const glowOptions: MdbAnimationOptions = {
  trigger: 'glow',
  delay: 0,
  duration: 500,
};

const glowEnterOptions: MdbAnimationOptions = {
  trigger: 'glowEnter',
  delay: 0,
  duration: 500,
};

const glow = (options: MdbAnimationOptions): AnimationReferenceMetadata => {
  const params = {
    delay: options.delay,
    duration: options.duration,
  };

  return animation(
    [
      animate(
        '{{duration}}ms {{delay}}ms',
        keyframes([
          style({ backgroundColor: '#fcfcfd', easing: 'ease', offset: 0 }),
          style({ backgroundColor: '#fff6cd', easing: 'ease', offset: 0.3 }),
          style({ backgroundColor: '#fcfcfd', easing: 'ease', offset: 1 }),
        ])
      ),
    ],
    { params }
  );
};

export function glowAnimation(options?: MdbAnimationOptions): AnimationTriggerMetadata {
  options = getOptions(options, glowOptions);

  return trigger(options.trigger, [transition('0 => 1', [useAnimation(glow(options))])]);
}

export function glowEnterAnimation(options?: MdbAnimationOptions): AnimationTriggerMetadata {
  options = getOptions(options, glowEnterOptions);

  return trigger(options.trigger, [transition(':enter', [useAnimation(glow(options))])]);
}
