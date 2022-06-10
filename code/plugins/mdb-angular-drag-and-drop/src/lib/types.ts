import { MdbDraggableDirective } from './draggable.directive';
import { MdbSortableContainerDirective } from './sortable-container.directive';

export interface Boundaries {
  minX: number;
  maxX: number;
  minY: number;
  maxY: number;
}

export interface Position {
  x: number;
  y: number;
}

export interface CachedDraggable {
  element: HTMLElement;
  instance: MdbDraggableDirective;
  offsetLeft: number;
  offsetTop: number;
  translateX: number;
  translateY: number;
  index: number;
  rect: any;
}

export interface MdbDropEvent {
  item: MdbDraggableDirective;
  previousContainer: MdbSortableContainerDirective;
  newContainer: MdbSortableContainerDirective;
  previousIndex: number;
  newIndex: number;
}
