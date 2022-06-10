import { MdbAnimationOptions } from './animation.options';

export function getOptions(
  options: MdbAnimationOptions,
  defaultOptions: MdbAnimationOptions
): MdbAnimationOptions {
  return options ? Object.assign(defaultOptions, options) : defaultOptions;
}
