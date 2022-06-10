export type MdbStickyPosition = 'top' | 'bottom';
export type MdbStickyDirection = 'down' | 'up' | 'both';
export interface MdbStickyOffset {
  top: number;
  left: number;
  bottom: number;
}
export interface MdbStickyElementStyles {
  left?: string;
}
export interface MdbStickyStyles {
  top?: string | null;
  bottom?: string | null;
  height?: string | null;
  width?: string | null;
  left?: string | null;
  zIndex?: string | null;
  position?: string | null;
  opacity?: string;
}
