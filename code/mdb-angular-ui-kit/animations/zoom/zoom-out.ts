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

const zoomOutOptions: MdbAnimationOptions = {
  trigger: 'zoomOut',
  delay: 0,
  duration: 500,
};

const zoomOutLeaveOptions: MdbAnimationOptions = {
  trigger: 'zoomOutLeave',
  delay: 0,
  duration: 500,
};

const zoomOut = (options: MdbAnimationOptions): AnimationReferenceMetadata => {
  const params = {
    delay: options.delay,
    duration: options.duration,
  };

  return animation(
    [
      animate(
        '{{duration}}ms {{delay}}ms',
        keyframes([
          style({ opacity: 1, offset: 0 }),
          style({ opacity: 0, transform: 'scale3d(0.3, 0.3, 0.3)', offset: 0.5 }),
          style({ opacity: 0, offset: 1 }),
        ])
      ),
    ],
    { params }
  );
};

export function zoomOutAnimation(options?: MdbAnimationOptions): AnimationTriggerMetadata {
  options = getOptions(options, zoomOutOptions);

  return trigger(options.trigger, [transition('0 => 1', [useAnimation(zoomOut(options))])]);
}

export function zoomOutLeaveAnimation(options?: MdbAnimationOptions): AnimationTriggerMetadata {
  options = getOptions(options, zoomOutLeaveOptions);

  return trigger(options.trigger, [transition(':leave', [useAnimation(zoomOut(options))])]);
}
