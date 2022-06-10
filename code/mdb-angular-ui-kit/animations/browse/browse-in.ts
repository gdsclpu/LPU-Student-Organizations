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

const browseInOptions: MdbAnimationOptions = {
  trigger: 'browseIn',
  delay: 0,
  duration: 500,
};

const browseInEnterOptions: MdbAnimationOptions = {
  trigger: 'browseInEnter',
  delay: 0,
  duration: 500,
};

const browseIn = (options: MdbAnimationOptions): AnimationReferenceMetadata => {
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
            transform: 'scale(0.8) translateZ(0px)',
            zIndex: -1,
            easing: 'ease',
            offset: 0,
          }),
          style({
            transform: 'scale(0.8) translateZ(0px)',
            zIndex: -1,
            opacity: 0.7,
            easing: 'ease',
            offset: 0.1,
          }),
          style({
            transform: 'scale(1.05) translateZ(0px)',
            zIndex: 999,
            opacity: 1,
            easing: 'ease',
            offset: 0.8,
          }),
          style({
            transform: 'scale(1) translateZ(0px)',
            zIndex: 999,
            opacity: 1,
            easing: 'ease',
            offset: 1,
          }),
        ])
      ),
    ],
    { params }
  );
};

export function browseInAnimation(options?: MdbAnimationOptions): AnimationTriggerMetadata {
  options = getOptions(options, browseInOptions);

  return trigger(options.trigger, [transition('0 => 1', [useAnimation(browseIn(options))])]);
}

export function browseInEnterAnimation(options?: MdbAnimationOptions): AnimationTriggerMetadata {
  options = getOptions(options, browseInEnterOptions);

  return trigger(options.trigger, [transition(':enter', [useAnimation(browseIn(options))])]);
}
