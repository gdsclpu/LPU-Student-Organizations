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

const tadaOptions: MdbAnimationOptions = {
  trigger: 'tada',
  delay: 0,
  duration: 500,
};

const tadaEnterOptions: MdbAnimationOptions = {
  trigger: 'tadaEnter',
  delay: 0,
  duration: 500,
};

const tada = (options: MdbAnimationOptions): AnimationReferenceMetadata => {
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
          style({ transform: 'scale3d(0.9, 0.9, 0.9) rotate3d(0, 0, 1, -3deg)', offset: 0.1 }),
          style({ transform: 'scale3d(0.9, 0.9, 0.9) rotate3d(0, 0, 1, -3deg)', offset: 0.2 }),
          style({
            transform: 'transform: scale3d(1.1, 1.1, 1.1) rotate3d(0, 0, 1, 3deg)',
            offset: 0.3,
          }),
          style({
            transform: 'transform: scale3d(1.1, 1.1, 1.1) rotate3d(0, 0, 1, -3deg)',
            offset: 0.4,
          }),
          style({
            transform: 'transform: scale3d(1.1, 1.1, 1.1) rotate3d(0, 0, 1, 3deg)',
            offset: 0.5,
          }),
          style({
            transform: 'transform: scale3d(1.1, 1.1, 1.1) rotate3d(0, 0, 1, -3deg)',
            offset: 0.6,
          }),
          style({
            transform: 'transform: scale3d(1.1, 1.1, 1.1) rotate3d(0, 0, 1, 3deg)',
            offset: 0.7,
          }),
          style({
            transform: 'transform: scale3d(1.1, 1.1, 1.1) rotate3d(0, 0, 1, -3deg)',
            offset: 0.8,
          }),
          style({
            transform: 'transform: scale3d(1.1, 1.1, 1.1) rotate3d(0, 0, 1, 3deg)',
            offset: 0.9,
          }),
          style({ transform: 'scale3d(1, 1, 1)', offset: 1 }),
        ])
      ),
    ],
    { params }
  );
};

export function tadaAnimation(options?: MdbAnimationOptions): AnimationTriggerMetadata {
  options = getOptions(options, tadaOptions);

  return trigger(options.trigger, [transition('0 => 1', [useAnimation(tada(options))])]);
}

export function tadaEnterAnimation(options?: MdbAnimationOptions): AnimationTriggerMetadata {
  options = getOptions(options, tadaEnterOptions);

  return trigger(options.trigger, [transition(':enter', [useAnimation(tada(options))])]);
}
