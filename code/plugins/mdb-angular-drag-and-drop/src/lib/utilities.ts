export function moveItemToNewContainer(
  previousContainer: any[],
  newContainer: any[],
  previousIndex: number,
  newIndex: number
) {
  if (previousContainer.length > 0) {
    const item = previousContainer.splice(previousIndex, 1)[0];
    newContainer.splice(newIndex, 0, item);
  }
}

export function copyItemToNewContainer(
  previousContainer: any[],
  newContainer: any[],
  previousIndex: number,
  newIndex: number
) {
  if (previousContainer.length > 0) {
    const item = previousContainer[previousIndex];
    newContainer.splice(newIndex, 0, item);
  }
}

export function moveItemsInContainer(container: any[], previousIndex: number, newIndex: number) {
  const item = container[previousIndex];
  container.splice(previousIndex, 1);
  container.splice(newIndex, 0, item);
}

export function getElementRect(element: HTMLElement): any {
  const elementRect = element.getBoundingClientRect();

  return {
    top: elementRect.top,
    right: elementRect.right,
    bottom: elementRect.bottom,
    left: elementRect.left,
    width: elementRect.width,
    height: elementRect.height,
  };
}

export function cloneNode(node: HTMLElement): HTMLElement {
  const clone = node.cloneNode(true) as HTMLElement;
  clone.removeAttribute('id');
  return clone;
}

export function destroyNode(node: Node | null) {
  if (node && node.parentNode) {
    node.parentNode.removeChild(node);
  }
}
