export function isImage(element: Element) {
  return element.nodeName === 'IMG';
}

export function isVideo(element: Element) {
  return element.nodeName === 'VIDEO';
}
