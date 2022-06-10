const NAME = 'pinch';
const EVENT_END = `${NAME}end`;
const EVENT_START = `${NAME}start`;
const EVENT_MOVE = `${NAME}move`;

export class Pinch {
  private _startTouch = null;
  private _origin = null;
  private _touch = null;
  private _math = null;
  private _ratio = null;
  private _options = {
    pointers: 2,
    threshold: 10,
  };

  private _touchStartHandler = this._handleTouchStart.bind(this);
  private _touchMoveHandler = this._handleTouchMove.bind(this);
  private _touchEndHandler = this._handleTouchEnd.bind(this);

  constructor(private _element: HTMLElement) {}

  dispose() {
    this._element.removeEventListener('touchstart', this._touchStartHandler);
    this._element.removeEventListener('touchmove', this._touchMoveHandler);
    this._element.removeEventListener('touchend', this._touchEndHandler);
  }

  init() {
    this._element.addEventListener('touchstart', this._touchStartHandler);
    this._element.addEventListener('touchmove', this._touchMoveHandler);
    this._element.addEventListener('touchend', this._touchEndHandler);
  }

  private _handleTouchStart(e: any) {
    if (e.touches.length !== this._options.pointers) return;
    e.preventDefault();

    const [touch, origin] = this._getPinchTouchOrigin(e.touches);

    this._touch = touch;
    this._origin = origin;
    this._startTouch = this._touch;

    this.triggerCustomEvent(this._element, EVENT_START, {
      ratio: this._ratio,
      origin: this._origin,
    });
  }

  private _handleTouchMove(e) {
    const { threshold, pointers } = this._options;

    if (e.touches.length !== pointers) return;

    e.preventDefault();

    this._touch = this._getPinchTouchOrigin(e.touches)[0];
    this._ratio = this._touch / this._startTouch;

    const typeofing = typeof this._startTouch === 'number' && typeof this._touch === 'number';
    // eslint-disable-next-line no-restricted-globals
    const isNumber = !isNaN(this._startTouch) && !isNaN(this._touch);

    if (typeofing && isNumber) {
      if (this._origin.x > threshold || this._origin.y > threshold) {
        this._startTouch = this._touch;

        this.triggerCustomEvent(this._element, NAME, { ratio: this._ratio, origin: this._origin });
        this.triggerCustomEvent(this._element, EVENT_MOVE, {
          ratio: this._ratio,
          origin: this._origin,
        });
      }
    }
  }

  private _handleTouchEnd() {
    const typeofing = typeof this._startTouch === 'number' && typeof this._touch === 'number';
    // eslint-disable-next-line no-restricted-globals
    const isNumber = !isNaN(this._startTouch) && !isNaN(this._touch);

    if (typeofing && isNumber) {
      this._startTouch = null;

      this.triggerCustomEvent(this._element, EVENT_END, {
        ratio: this._ratio,
        origin: this._origin,
      });
    }
  }

  _getCoordinates(e) {
    const [touch] = e.touches;

    return {
      x: touch.clientX,
      y: touch.clientY,
    };
  }

  _getDirection({ x, y }) {
    return {
      x: {
        direction: x < 0 ? 'left' : 'right',
        value: Math.abs(x),
      },
      y: {
        direction: y < 0 ? 'up' : 'down',
        value: Math.abs(y),
      },
    };
  }

  _getOrigin({ x, y }, { x: x2, y: y2 }) {
    return {
      x: x - x2,
      y: y - y2,
    };
  }

  _getDistanceBetweenTwoPoints(x1, x2, y1, y2) {
    return Math.hypot(x2 - x1, y2 - y1);
  }

  _getMidPoint({ x1, x2, y1, y2 }) {
    return {
      x: (x1 + x2) / 2,
      y: (y1 + y2) / 2,
    };
  }

  _getVectorLength({ x1, x2, y1, y2 }) {
    return Math.sqrt((x2 - x1) ** 2 + (y2 - y1) ** 2);
  }

  _getRightMostTouch(touches) {
    let rightMost = null;
    const distance = Number.MIN_VALUE;
    touches.forEach((touch) => {
      if (touch.clientX > distance) {
        rightMost = touch;
      }
    });
    return rightMost;
  }

  _getAngle(x1, y1, x2, y2) {
    return Math.atan2(y2 - y1, x2 - x1);
  }

  _getAngularDistance(start, end) {
    return end - start;
  }

  _getCenterXY({ x1, x2, y1, y2 }) {
    return {
      x: x1 + (x2 - x1) / 2,
      y: y1 + (y2 - y1) / 2,
    };
  }

  _getPinchTouchOrigin(touches) {
    const [t1, t2] = touches;

    const _position = {
      x1: t1.clientX,
      x2: t2.clientX,
      y1: t1.clientY,
      y2: t2.clientY,
    };

    return [this._getVectorLength(_position), this._getCenterXY(_position)];
  }

  _getPosition({ x1, x2, y1, y2 }) {
    return { x1, x2, y1, y2 };
  }

  triggerCustomEvent(element: any, event: any, args: any) {
    if (typeof event !== 'string' || !element) {
      return null;
    }

    let bubbles = true;
    let nativeDispatch = true;
    let defaultPrevented = false;
    let evt = null;

    evt = new CustomEvent(event, {
      bubbles,
      cancelable: true,
    });

    if (typeof args !== 'undefined') {
      Object.keys(args).forEach((key) => {
        Object.defineProperty(evt, key, {
          get() {
            return args[key];
          },
        });
      });
    }

    if (defaultPrevented) {
      evt.preventDefault();
    }

    if (nativeDispatch) {
      element.dispatchEvent(evt);
    }

    return evt;
  }
}
