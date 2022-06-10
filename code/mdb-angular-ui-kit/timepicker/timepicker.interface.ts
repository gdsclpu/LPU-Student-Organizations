export type AmPm = 'AM' | 'PM' | '';
export type ClearButton = string | false;
export type CloseButton = string | false;
export type Rounding = 1 | 5 | 10 | 15 | 20;
interface Position {
  left: number;
  top: number;
}

export interface Hour extends Position {
  hour: string;
}

export interface Minute extends Position {
  min: string;
}

export interface Radius {
  dial: number;
  outer: number;
  inner: number;
  tick: number;
}

export interface SelectedTime {
  h: string;
  m: string;
  ampm: 'AM' | 'PM' | '';
  date?: any;
}

export interface Options {
  cancelLabel: string;
  clearLabel: string;
  okLabel: string;
  pmLabel: string;
  amLabel: string;
}
