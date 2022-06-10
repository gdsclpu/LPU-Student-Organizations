import { DOCUMENT } from '@angular/common';
import { Directive, EventEmitter, HostListener, Inject, Input, Output } from '@angular/core';
import {
  easingFunctions,
  MdbSmoothScrollEasing,
  MdbSmoothScrollEasingFunction,
} from './easing-functions';

@Directive({
  selector: '[mdbSmoothScroll]',
})
export class MdbSmoothScrollDirective {
  @Input() container: HTMLElement;
  @Input() duration = 500;
  @Input() easing: MdbSmoothScrollEasing = 'linear';
  @Input() href: string;
  @Input() target: string;
  @Input() offset = 0;

  @Output() scrollStart: EventEmitter<void> = new EventEmitter<void>();
  @Output() scrollEnd: EventEmitter<void> = new EventEmitter<void>();
  @Output() scrollCancel: EventEmitter<void> = new EventEmitter<void>();

  @HostListener('click', ['$event'])
  onClick(event: MouseEvent) {
    event.stopPropagation();
    event.preventDefault();
    this._scroll();
  }

  private _isCanceled = false;

  constructor(@Inject(DOCUMENT) private _document: any) {}

  private _scroll(): void {
    const container = this._getContainer();
    const positionFrom = container.scrollTop;
    const positionTo = this._getDistance();
    const progress = 0;
    const speed = 1 / this.duration;
    // Thanks to this value time of scrolling is almost equal to value which user set
    const step = 4.25;
    const easing = easingFunctions[this.easing];

    this.scrollStart.emit();

    // If element is hidden in a container which is not visible in viewport,
    // scroll to the container first, then scroll to the element
    if (!this._isInViewport()) {
      this._scrollOnNextTick(
        this._document.documentElement,
        this._document.documentElement.scrollTop,
        container.offsetTop,
        progress,
        speed,
        step,
        easing
      );

      setTimeout(() => {
        this._scrollOnNextTick(container, positionFrom, positionTo, progress, speed, step, easing);
        this._isCanceled = false;
      }, this.duration);
    } else {
      this._scrollOnNextTick(container, positionFrom, positionTo, progress, speed, step, easing);
    }
  }

  private _scrollOnNextTick(
    container: HTMLElement,
    positionFrom: number,
    positionTo: number,
    progress: number,
    speed: number,
    step: number,
    easing: MdbSmoothScrollEasingFunction
  ) {
    const negativeProgress = progress < 0;
    const scrollEnd = progress > 1;
    const negativeSpeed = speed < 0;
    const scrollContainer = this.container ? this.container : window;

    if (negativeProgress || scrollEnd || negativeSpeed || this._isCanceled) {
      if (this._isCanceled) {
        if (this._isInViewport()) {
          this._isCanceled = false;
        }
        this.scrollCancel.emit();
        return;
      }
      this.scrollEnd.emit();
      container.scrollTop = positionTo;
      return;
    }

    scrollContainer.scrollTo({
      top: positionFrom - (positionFrom - positionTo) * easing(progress),
    });

    progress += speed * step;

    setTimeout(() => {
      this._scrollOnNextTick(container, positionFrom, positionTo, progress, speed, step, easing);
    });
  }

  private _getContainer(): HTMLElement {
    return this.container ? this.container : this._document.documentElement;
  }

  private _getTarget(): HTMLElement {
    return this._document.querySelector(this.href);
  }

  private _getDistance(): number {
    let distance: number;
    const target = this._getTarget();

    if (!this.container) {
      distance = this._getDistanceForWindow(target);
    } else {
      distance = this._getDistanceForContainer(target);
    }

    return distance;
  }

  private _getDistanceForWindow(target: HTMLElement): number {
    const distanceFromTop = this._document.documentElement.scrollTop;
    const targetTop = this._getElementTopOffset(target);
    const offset = this.offset;

    return targetTop - offset + distanceFromTop;
  }

  private _getElementTopOffset(target: HTMLElement): number {
    const rect = target.getBoundingClientRect();

    return rect.top + this._document.documentElement.scrollTop;
  }

  private _getDistanceForContainer(target: HTMLElement): number {
    const targetY = target.getBoundingClientRect().y;
    const containerY = this.container.getBoundingClientRect().y;
    const distanceFromTop = this.container.scrollTop;
    const distanceFromContainer = targetY - containerY;
    const offset = this.offset;

    return distanceFromContainer - offset + distanceFromTop;
  }

  private _isInViewport(): boolean {
    if (!this.container) {
      return true;
    }

    const rect = this.container.getBoundingClientRect();
    const containerTop = rect.top;
    const containerBottom = rect.bottom;

    return containerTop >= 0 && containerBottom <= this._document.documentElement.clientHeight;
  }

  cancelScroll(): void {
    this._isCanceled = true;
  }
}
