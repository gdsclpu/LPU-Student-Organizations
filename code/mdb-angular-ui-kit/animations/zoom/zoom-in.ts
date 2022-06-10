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

const zoomInOptions: MdbAnimationOptions = {
  trigger: 'zoomIn',
  delay: 0,
  duration: 500,
};

const zoomInEnterOptions: MdbAnimationOptions = {
  trigger: 'zoomInEnter',
  delay: 0,
  duration: 500,
};

const zoomIn = (options: MdbAnimationOptions): AnimationReferenceMetadata => {
  const params = {
    delay: options.delay,
    duration: options.duration,
  };

  return animation(
    [
      animate(
        '{{duration}}ms {{delay}}ms',
        keyframes([
          style({ opacity: 0, transform: 'scale3d(0.3, 0.3, 0.3)', offset: 0, easing: 'ease' }),
          style({ opacity: 1, transform: 'scale3d(1, 1, 1)', offset: 0.5, easing: 'ease' }),
        ])
      ),
    ],
    { params }
  );
};

export function zoomInAnimation(options?: MdbAnimationOptions): AnimationTriggerMetadata {
  options = getOptions(options, zoomInOptions);

  return trigger(options.trigger, [
    transition('0 => 1', [style({ opacity: 0 }), useAnimation(zoomIn(options))]),
  ]);
}

export function zoomInEnterAnimation(options?: MdbAnimationOptions): AnimationTriggerMetadata {
  options = getOptions(options, zoomInEnterOptions);

  return trigger(options.trigger, [
    transition(':enter', [style({ opacity: 0 }), useAnimation(zoomIn(options))]),
  ]);
}
