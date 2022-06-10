export type MdbSmoothScrollEasingFunction = (t: number) => number;

export type MdbSmoothScrollEasing =
  | 'linear'
  | 'easeInQuad'
  | 'easeInCubic'
  | 'easeInQuart'
  | 'easeInQuint'
  | 'easeInOutQuad'
  | 'easeInOutCubic'
  | 'easeInOutQuard'
  | 'easeInOutQuint'
  | 'easeOutQuad'
  | 'easeOutCubic'
  | 'easeOutQuard'
  | 'easeOutQuint';

export const easingFunctions = {
  linear: linear,
  easeInQuad: easeInQuad,
  easeInCubic: easeInCubic,
  easeInQuart: easeInQuart,
  easeInQuint: easeInQuint,
  easeInOutQuad: easeInOutQuad,
  easeInOutCubic: easeInOutCubic,
  easeInOutQuart: easeInOutQuart,
  easeInOutQuint: easeInOutQuint,
  easeOutQuad: easeOutQuad,
  easeOutCubic: easeOutCubic,
  easeOutQuart: easeOutQuart,
  easeOutQuint: easeOutQuint,
};

function linear(t: number): number {
  return t;
}

function easeInQuad(t: number): number {
  return t * t;
}

function easeInCubic(t: number): number {
  return t * t * t;
}

function easeInQuart(t: number): number {
  return t * t * t * t;
}

function easeInQuint(t: number): number {
  return t * t * t * t * t;
}

function easeInOutQuad(t: number): number {
  return t < 0.5 ? 2 * t * t : -1 + (4 - 2 * t) * t;
}

function easeInOutCubic(t: number): number {
  t /= 0.5;
  if (t < 1) return (t * t * t) / 2;
  t -= 2;
  return (t * t * t + 2) / 2;
}

function easeInOutQuart(t: number): number {
  t /= 0.5;
  if (t < 1) return 0.5 * t * t * t * t;
  t -= 2;
  return -(t * t * t * t - 2) / 2;
}

function easeInOutQuint(t: number): number {
  t /= 0.5;
  if (t < 1) return (t * t * t * t * t) / 2;
  t -= 2;
  return (t * t * t * t * t + 2) / 2;
}

function easeOutQuad(t: number): number {
  return -t * (t - 2);
}

function easeOutCubic(t: number): number {
  t--;
  return t * t * t + 1;
}

function easeOutQuart(t: number): number {
  t--;
  return -(t * t * t * t - 1);
}

function easeOutQuint(t: number): number {
  t--;
  return t * t * t * t * t + 1;
}
