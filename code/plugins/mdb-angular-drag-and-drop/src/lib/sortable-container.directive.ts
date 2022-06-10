import {
  Directive,
  ElementRef,
  ContentChildren,
  QueryList,
  AfterContentInit,
  Output,
  EventEmitter,
  Input,
  InjectionToken,
} from '@angular/core';
import { getElementRect } from './utilities';
import { MdbDraggableDirective } from './draggable.directive';
import { CachedDraggable } from './types';

export const MDB_SORTABLE_CONTAINER = new InjectionToken<MdbSortableContainerDirective>(
  'MdbSortableContainer'
);

@Directive({
  // eslint-disable-next-line @angular-eslint/directive-selector
  selector: '[mdbSortableContainer]',
  exportAs: 'mdbSortableContainer',
  providers: [{ provide: MDB_SORTABLE_CONTAINER, useExisting: MdbSortableContainerDirective }],
})
export class MdbSortableContainerDirective implements AfterContentInit {
  @ContentChildren(MdbDraggableDirective) private draggables: QueryList<MdbDraggableDirective>;

  @Input() autoScroll = false;
  @Input()
  get containers(): any {
    return this._containers;
  }
  set containers(containersArray: any) {
    this._containers = containersArray.map((container: any) => {
      if (typeof container === 'string') {
        return MdbSortableContainerDirective._sortableContainers.find(
          (sortableContainer) => sortableContainer.id === container
        );
      }

      return container;
    });
  }
  private _containers: any[] = [];
  @Input() data: any[];
  @Input() enterPredicate: (item: MdbDraggableDirective) => boolean = () => true;
  @Input() id: string;
  @Input() sortingDisabled = false;

  @Output() itemDrop = new EventEmitter<any>();

  private static _sortableContainers: MdbSortableContainerDirective[] = [];

  private _draggables: MdbDraggableDirective[];

  private _inactiveItems: CachedDraggable[] = [];
  private _cachedDraggables: CachedDraggable[] = [];

  _activeItem: CachedDraggable;

  private _eventsInitialized = false;

  private _mouseEnterHandler = this._handleMouseEnter.bind(this);

  currentIndex: number;
  newIndex: number;

  get element(): HTMLElement {
    return this._elementRef.nativeElement;
  }

  constructor(private _elementRef: ElementRef) {
    MdbSortableContainerDirective._sortableContainers.push(this);
  }

  ngAfterContentInit() {
    this.draggables.forEach((draggable) => (draggable._sortableContainer = this));
    this._draggables = Array.from(this.draggables);

    this.draggables.changes.subscribe(() => {
      this.draggables.forEach((draggable) => (draggable._sortableContainer = this));
      this._draggables = Array.from(this.draggables);
    });
  }

  _onDragStart() {
    this.draggables.forEach((draggable) => (draggable._sortableContainer = this));
    this._draggables = Array.from(this.draggables);
    this._cacheDraggables();
  }

  _onDragEnd() {
    this._removeSortingEvents();
    this._eventsInitialized = false;
  }

  _emitDropEvent(
    item: MdbDraggableDirective,
    previousContainer: MdbSortableContainerDirective,
    newContainer: MdbSortableContainerDirective,
    previousIndex: number,
    newIndex: number
  ) {
    this.itemDrop.emit({
      item: item,
      previousContainer: previousContainer,
      newContainer: newContainer,
      previousIndex: previousIndex,
      newIndex: newIndex,
    });
  }

  private _cacheDraggables() {
    this._cachedDraggables = this._draggables.map(
      (draggable: MdbDraggableDirective, index: number) => {
        const element = draggable._getHost();

        return {
          element: element,
          instance: draggable,
          offsetLeft: element.offsetLeft,
          offsetTop: element.offsetTop,
          translateX: 0,
          translateY: 0,
          index: index,
          rect: getElementRect(element),
        };
      }
    );
  }

  _isPointerOverItem(rect: any, x: number, y: number) {
    const { top, bottom, left, right } = rect;
    const offset = 1;

    return (
      y + offset >= Math.floor(top) &&
      y - offset <= Math.floor(bottom) &&
      x + offset >= Math.floor(left) &&
      x - offset <= Math.floor(right)
    );
  }

  _initSortingEvents(item: MdbDraggableDirective) {
    if (!this._eventsInitialized) {
      this._setEvents(item);
      this._eventsInitialized = true;
    }
  }

  _removeSortingEvents() {
    this._draggables.forEach((item) => {
      const element = item._getHost();
      element.removeEventListener('mouseenter', this._mouseEnterHandler);
      element.style.transform = '';
      element.style.transition = '';
    });
  }

  _handleItemEnter(item: MdbDraggableDirective, x: number, y: number) {
    this._eventsInitialized = false;
    this._cacheDraggables();

    const newIndex = this._getItemIndexFromCoordinates(x, y);
    const placeholder = item._getPlaceholder();
    let overItem = this._draggables[newIndex];

    let offsetLeft: number;
    let offsetTop: number;

    if (overItem) {
      const overItemElement = overItem._getHost();
      offsetLeft = overItemElement.offsetLeft;
      offsetTop = overItemElement.offsetTop;
      overItemElement.parentNode.insertBefore(placeholder, overItemElement);
      this._draggables.splice(newIndex, 0, item);
    } else {
      this.element.appendChild(placeholder);
      this._draggables.push(item);
    }

    placeholder.style.transform = '';
    this._cacheDraggables();

    if (overItem) {
      this._cachedDraggables[newIndex].offsetLeft = offsetLeft;
      this._cachedDraggables[newIndex].offsetTop = offsetTop;
    } else {
      const lastIndex = this._cachedDraggables.length - 1;
      this._cachedDraggables[lastIndex].offsetLeft = placeholder.offsetLeft;
      this._cachedDraggables[lastIndex].offsetTop = placeholder.offsetTop;
    }

    this._initSortingEvents(item);
  }

  _handleItemLeave(item: MdbDraggableDirective) {
    const currentIndex = this._draggables.indexOf(item);
    this._draggables.splice(currentIndex, 1);
    this._removeSortingEvents();
  }

  private _getItemIndexFromCoordinates(x: number, y: number) {
    return this._cachedDraggables.findIndex((draggable) =>
      this._isPointerOverItem(draggable.rect, x, y)
    );
  }

  _getContainerFromCoordinates(item: MdbDraggableDirective, x: number, y: number) {
    return this.containers.find((container) => {
      if (container._canAcceptEnteringItem(item)) {
        return false;
      }

      const elementFromPoint = document.elementFromPoint(x, y);

      if (!elementFromPoint) {
        return false;
      }

      return container.element === elementFromPoint || container.element.contains(elementFromPoint);
    });
  }

  _canAcceptEnteringItem(item: MdbDraggableDirective) {
    return !this.enterPredicate(item);
  }

  _setEvents(activeDraggable: MdbDraggableDirective) {
    const inactiveSortItems = this._cachedDraggables.filter((draggable) => {
      if (draggable.instance === activeDraggable) {
        this._activeItem = draggable;
      }

      return draggable.instance !== activeDraggable;
    });

    this._inactiveItems = inactiveSortItems;

    if (!this.sortingDisabled) {
      inactiveSortItems.forEach((draggable) => {
        draggable.element.style.transition = `transform 300ms ease`;
        draggable.element.addEventListener('mouseenter', this._mouseEnterHandler);
      });
    }
  }

  private _handleMouseEnter(event: any) {
    const enteredItem: any = this._getTarget(event);

    const itemBelow = enteredItem.index > this._activeItem.index;

    const itemsToMove = this._getItemsToMove(itemBelow, enteredItem);

    this._slideItems(itemBelow, itemsToMove);
    this._slideActiveItem(this._activeItem);

    this._activeItem.index = enteredItem.index;

    this._setIndexes(itemsToMove, itemBelow);
  }

  private _getTarget(event: any) {
    return this._cachedDraggables.find((draggable) => draggable.element === event.target);
  }

  _slideItems(itemBelow: boolean, itemsToMove: CachedDraggable[]) {
    itemsToMove.forEach((item) => {
      const index = itemBelow ? item.index - 1 : item.index + 1;
      const adjacentItem = this._cachedDraggables[index];

      const distanceY = adjacentItem.offsetTop - item.offsetTop;
      const distanceX = adjacentItem.offsetLeft - item.offsetLeft;

      item.translateY = distanceY;
      item.translateX = distanceX;

      this._setTranslate(item.element, distanceX, distanceY);
    });
  }

  _slideActiveItem(item: CachedDraggable) {
    let sumY = 0;
    let sumX = 0;

    this._cachedDraggables.forEach((draggable) => {
      sumY -= draggable.translateY;
      sumX -= draggable.translateX;
    });

    const placeholder = item.instance._getPlaceholder();

    this._setTranslate(placeholder, sumX, sumY);
  }

  _getItemsToMove(itemBelow: boolean, enteredItem: CachedDraggable) {
    return this._cachedDraggables.filter((draggable) => {
      if (itemBelow) {
        return this._activeItem.index < draggable.index && draggable.index <= enteredItem.index;
      }

      return this._activeItem.index > draggable.index && draggable.index >= enteredItem.index;
    });
  }

  _setTranslate(element: HTMLElement, x: number, y: number) {
    element.style.transform = `translate3d(${x}px, ${y}px, 0px)`;
  }

  _setIndexes(itemsToMove: CachedDraggable[], itemBelow: boolean) {
    this._cachedDraggables = this._cachedDraggables.map((draggable) => {
      itemsToMove.forEach((item) => {
        if (draggable === item) {
          if (itemBelow) {
            item.index--;
          } else {
            item.index++;
          }
        }
      });

      return draggable;
    });
  }

  _setOffsets() {
    this._cachedDraggables.forEach((draggable) => {
      draggable.offsetLeft = draggable.element.offsetLeft;
      draggable.offsetTop = draggable.element.offsetTop;
    });
  }

  _resetTranslatesInfo() {
    this._cachedDraggables.forEach((draggable) => {
      draggable.translateX = 0;
      draggable.translateY = 0;
    });
  }

  _getDraggableIndex(item: MdbDraggableDirective) {
    const correspondingItem: CachedDraggable = this._cachedDraggables.find(
      (draggable) => draggable.instance === item
    );
    return correspondingItem.index;
  }
}
