export const parseToHTML = (string: string) => {
  const parser = new DOMParser();

  const node = parser.parseFromString(string, 'text/html');

  return node.body;
};

export const getElementCenter = (rect: any) => {
  return {
    x: rect.width / 2,
    y: rect.height / 2,
  };
};

export const getEventCoordinates = (e: any) => {
  if (e.touches) {
    const [touch] = e.touches;

    return {
      x: touch.clientX,
      y: touch.clientY,
    };
  }

  return {
    x: e.clientX,
    y: e.clientY,
  };
};

export const getVector = (points: any) => {
  const [point1, point2] = points.map((point) => ({ x: point.clientX, y: point.clientY }));

  return {
    center: { x: point1.x + (point2.x - point1.x) / 2, y: point1.y + (point2.y - point1.y) / 2 },
    length: Math.sqrt((point2.x - point1.x) ** 2 + (point2.y - point1.y) ** 2),
  };
};

export const getDisplacement = (position: any, prev: any) => {
  return {
    x: position.x - prev.x,
    y: position.y - prev.y,
  };
};
