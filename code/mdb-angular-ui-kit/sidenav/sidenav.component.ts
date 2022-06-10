import {
  AfterViewInit,
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  ContentChildren,
  ElementRef,
  EventEmitter,
  forwardRef,
  Inject,
  Input,
  Output,
  QueryList,
  Renderer2,
  ViewChild,
} from '@angular/core';
import { MdbSidenavLayoutComponent } from './sidenav-loyaut.component';
import { DOCUMENT } from '@angular/common';
import { MdbCollapseDirective } from 'mdb-angular-ui-kit/collapse';
import { fromEvent } from 'rxjs';
import { first } from 'rxjs/operators';
import { ConfigurableFocusTrap, ConfigurableFocusTrapFactory } from '@angular/cdk/a11y';
import { BooleanInput, coerceBooleanProperty } from '@angular/cdk/coercion';
@Component({
  selector: 'mdb-sidenav',
  templateUrl: 'sidenav.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  exportAs: 'mdbSidenav',
})
export class MdbSidenavComponent implements AfterViewInit {
  @ViewChild('sidenav') _sidenav: ElementRef<HTMLElement>;
  @ContentChildren(MdbCollapseDirective, { descendants: true })
  _collapse: QueryList<MdbCollapseDirective>;

  @Input()
  get accordion(): boolean {
    return this._accordion;
  }
  set accordion(newValue: boolean) {
    if (this._accordion !== newValue) {
      this._accordion = coerceBooleanProperty(newValue);
      this.update();
    }
  }
  @Input()
  get backdrop(): boolean {
    return this._backdrop;
  }
  set backdrop(newValue: boolean) {
    if (this._backdrop !== newValue) {
      this._backdrop = coerceBooleanProperty(newValue);
      this.update();
    }
  }
  @Input()
  get backdropClass(): string {
    return this._backdropClass;
  }
  set backdropClass(newValue: string) {
    if (this._backdropClass !== newValue) {
      this._backdropClass = newValue;
      this.update();
    }
  }
  @Input()
  get closeOnEsc(): boolean {
    return this._closeOnEsc;
  }
  set closeOnEsc(newValue: boolean) {
    if (this._closeOnEsc !== newValue) {
      this._closeOnEsc = coerceBooleanProperty(newValue);
      this.update();
    }
  }
  @Input()
  get color(): string {
    return this._color;
  }
  set color(newValue: string) {
    if (this._color !== newValue) {
      this._color = newValue;
      this.update();
    }
  }
  @Input()
  get expandOnHover(): boolean {
    return this._expandOnHover;
  }
  set expandOnHover(newValue: boolean) {
    if (this._expandOnHover !== newValue) {
      this._expandOnHover = coerceBooleanProperty(newValue);
      this.update();
    }
  }
  @Input()
  get hidden(): boolean {
    return this._hidden;
  }
  set hidden(newValue: boolean) {
    if (this._hidden !== newValue) {
      this._hidden = coerceBooleanProperty(newValue);
    }
  }
  @Input()
  get mode(): string {
    return this._mode;
  }
  set mode(newValue: string) {
    if (this._mode !== newValue) {
      this._mode = newValue;

      if (this._isLoaded) {
        this.updateSidenav(this.isVisible);
      }
    }
  }
  @Input()
  get scrollContainer(): string {
    return this._scrollContainer;
  }
  set scrollContainer(newValue: string) {
    if (this._scrollContainer !== newValue) {
      this._scrollContainer = newValue;
      this.update();
    }
  }
  @Input()
  get slim(): boolean {
    return this._slim;
  }
  set slim(newValue: boolean) {
    if (this._slim !== newValue) {
      this._slim = coerceBooleanProperty(newValue);
      this.update();
    }
  }
  @Input()
  get slimCollapsed(): boolean {
    return this._slimCollapsed;
  }
  set slimCollapsed(newValue: boolean) {
    if (this._slimCollapsed !== newValue) {
      this._slimCollapsed = coerceBooleanProperty(newValue);
      this.update();
    }
  }
  @Input()
  get slimWidth(): number {
    return this._slimWidth;
  }
  set slimWidth(newValue: number) {
    if (this._slimWidth !== newValue) {
      this._slimWidth = newValue;
      this.update();
    }
  }
  @Input()
  get position(): string {
    return this._position;
  }
  set position(newValue: string) {
    if (this._position !== newValue) {
      this._position = newValue;
      this.update();
    }
  }
  @Input()
  get right(): boolean {
    return this._right;
  }
  set right(newValue: boolean) {
    if (this._right !== newValue) {
      this._right = coerceBooleanProperty(newValue);
      this.update();
    }
  }
  @Input()
  get transitionDuration(): number {
    return this._transitionDuration;
  }
  set transitionDuration(newValue: number) {
    if (this._transitionDuration !== newValue) {
      this._transitionDuration = newValue;
      this.update();
    }
  }
  @Input()
  get width(): number {
    return this._width;
  }
  set width(newValue: number) {
    if (this._width !== newValue) {
      this._width = newValue;
      this.update();
    }
  }

  @Input()
  get focusTrap(): boolean {
    return this._focusTrap;
  }
  set focusTrap(newValue: boolean) {
    if (this._focusTrap !== newValue) {
      this._focusTrap = coerceBooleanProperty(newValue);
      this.update();
    }
  }

  @Output() sidenavShow: EventEmitter<MdbSidenavComponent> = new EventEmitter();
  @Output() sidenavShown: EventEmitter<MdbSidenavComponent> = new EventEmitter();
  @Output() sidenavHide: EventEmitter<MdbSidenavComponent> = new EventEmitter();
  @Output() sidenavHidden: EventEmitter<MdbSidenavComponent> = new EventEmitter();
  @Output() sidenavExpand: EventEmitter<MdbSidenavComponent> = new EventEmitter();
  @Output() sidenavExpanded: EventEmitter<MdbSidenavComponent> = new EventEmitter();
  @Output() sidenavCollapse: EventEmitter<MdbSidenavComponent> = new EventEmitter();
  @Output() sidenavCollapsed: EventEmitter<MdbSidenavComponent> = new EventEmitter();
  @Output() sidenavUpdate: EventEmitter<MdbSidenavComponent> = new EventEmitter();

  private _color = 'primary';
  private _accordion = false;
  private _backdrop = true;
  private _backdropClass: string;
  private _closeOnEsc = true;
  private _expandOnHover = false;
  private _hidden = true;
  private _mode = 'over';
  private _scrollContainer: string;
  private _slim = false;
  private _slimCollapsed = false;
  private _slimWidth = 70;
  private _position = 'fixed';
  private _right = false;
  private _transitionDuration = 300;
  private _width = 240;
  private _focusTrap = true;

  private translationLeft = -100;
  private translationRight = 100;
  private _isLoaded = false;
  private _contentEl: ChildNode;
  private _initialContentStyle: any;
  private document: Document;
  public isOpen = false;
  public sidenavLayout: MdbSidenavLayoutComponent;
  private _configurableFocusTrap: ConfigurableFocusTrap;

  constructor(
    private _renderer: Renderer2,
    private _elRef: ElementRef,
    private _cdRef: ChangeDetectorRef,
    private _focusTrapFactory: ConfigurableFocusTrapFactory,
    @Inject(forwardRef(() => MdbSidenavLayoutComponent)) _container: MdbSidenavLayoutComponent,
    @Inject(DOCUMENT) _document
  ) {
    this.sidenavLayout = _container;
    this.document = _document;
  }

  ngAfterViewInit(): void {
    if (this.mode) {
      this.setMode(this.mode);
    }

    this._isLoaded = true;
    this._setup();

    if (!this.hidden && this.backdrop) {
      Promise.resolve().then(() => {
        this.sidenavLayout.toggleBackdrop(true);
      });
    }
  }

  get container(): HTMLElement {
    if (this.position === 'fixed') {
      return this.document.body;
    }

    const findContainer = (el) => {
      if (!el.parentNode || el.parentNode === document) {
        return el;
      }
      if (el.parentNode.style.position === 'relative') {
        return el.parentNode;
      }
      return findContainer(el.parentNode);
    };

    return findContainer(this._sidenav.nativeElement);
  }

  get translation(): number {
    return this.right ? this.translationRight : this.translationLeft;
  }

  get sidenavTransitionDuration(): string {
    return `${this.transitionDuration / 1000}s`;
  }

  get isVisible(): boolean {
    let containerStart = 0;
    let containerEnd = window.innerWidth;

    if (this.position !== 'fixed') {
      const boundry = this.container.getBoundingClientRect();
      containerStart = boundry.x;
      containerEnd = boundry.x + boundry.width;
    }

    const { x } = this._sidenav.nativeElement.getBoundingClientRect();

    if (this.right) {
      return Math.abs(x - containerEnd) > 10;
    }
    return Math.abs(x - containerStart) < 10;
  }

  get sidenavWidth(): number {
    return this._slimCollapsed ? this.slimWidth : this.width;
  }

  get sidenavStyle(): object {
    return {
      width: `${this.sidenavWidth}px`,
      height: this.position === 'fixed' ? '100vh' : '100%',
      position: this.position,
      transition: `all ${this.sidenavTransitionDuration} linear`,
    };
  }

  get isAllCollapsed(): boolean {
    return (
      this._collapse.filter((el) => {
        const styles = getComputedStyle(el.host);
        return styles.display !== 'none';
      }).length === 0
    );
  }

  public isTheLastItemToBeCollapsed(): boolean {
    return (
      this._collapse.filter((el) => {
        return el.host.classList.contains('show');
      }).length === 1
    );
  }

  public markForCheck(): void {
    this._cdRef.markForCheck();
  }

  public toggle(): void {
    this.markForCheck();
    this.triggetVisibilityEvents(!this.isVisible);
    this.updateSidenav(!this.isVisible);
  }

  public show(): void {
    this.markForCheck();
    this.triggetVisibilityEvents(true);
    this.updateSidenav(true);
  }

  public hide(): void {
    this.markForCheck();
    this.triggetVisibilityEvents(false);
    this.updateSidenav(false);
  }

  public update(): void {
    if (!this._isLoaded) {
      return;
    }

    this.markForCheck();
    this._setup();
  }

  public setMode(newMode: string): void {
    if (this.mode === newMode) {
      return;
    }

    this.mode = newMode;
    this.markForCheck();
    this.updateSidenav(this.isVisible);
  }

  public toggleSlim(): void {
    this.markForCheck();
    this.setSlim(!this._slimCollapsed);
  }

  public async triggerEvents(startEvent: string, completeEvent = ''): Promise<void> {
    this.markForCheck();
    this[startEvent].emit(this);

    if (completeEvent) {
      await setTimeout(() => {
        this[completeEvent].emit(this);
      }, this.transitionDuration + 5);
    }
  }

  public triggetVisibilityEvents(show: boolean): void {
    this.markForCheck();
    const events = show ? ['sidenavShow', 'sidenavShown'] : ['sidenavHide', 'sidenavHidden'];

    const startEvent = events[0];
    const completeEvent = events[1];
    this.triggerEvents(startEvent, completeEvent);
  }

  public updateSidenav(show: boolean): void {
    this.markForCheck();

    if (this.focusTrap && this.mode === 'over') {
      if (!this.isVisible) {
        this._configurableFocusTrap = this._focusTrapFactory.create(this._sidenav.nativeElement);
      } else {
        if (this._configurableFocusTrap) {
          this._configurableFocusTrap.destroy();
        }
      }
    }

    this._updateDisplay(show);

    if (this.backdrop) {
      this.sidenavLayout.toggleBackdrop(show);
    }

    this._updateOffsets(show);

    if (show && this.closeOnEsc && this.mode !== 'side') {
      fromEvent(this.document, 'keydown')
        .pipe(first())
        .subscribe((e: KeyboardEvent) => {
          if (e.code === 'Escape') {
            this.updateSidenav(false);
          }
        });
    }
  }

  public collapseItems(): void {
    this.markForCheck();
    this._collapse.forEach((el) => {
      if (!el.collapsed) {
        el.hide();
      }
    });
  }

  public setSlim(value: boolean): void {
    this.markForCheck();
    const events = value
      ? ['sidenavCollapse', 'sidenavCollapsed']
      : ['sidenavExpand', 'sidenavExpanded'];
    const startEvent = events[0];
    const completeEvent = events[1];

    this.triggerEvents(startEvent, completeEvent);
    if (value) {
      this.collapseItems();
    }

    this._slimCollapsed = value;

    this._toggleSlimDisplay(value);

    this._renderer.setStyle(this._sidenav.nativeElement, 'width', `${this.sidenavWidth}px`);

    this._updateOffsets(this.isVisible);
  }

  private _setup(): void {
    if (this.slim) {
      this._setupSlim();
    }

    // Initial position

    this._setupInitialStyling();

    // Perfect Scrollbar

    this._setupScrolling();

    // Content

    this._setupContent();

    // Shown on init

    if (!this.hidden) {
      this._updateOffsets(true, true);
    }
  }

  private _setupContent(): void {
    this._contentEl = this.sidenavLayout._sidenavContent.nativeElement.firstChild;
    this._initialContentStyle = { ...window.getComputedStyle(this._contentEl as Element) };
  }

  private _updateDisplay(value: boolean): void {
    const translation = value ? 0 : this.translation;
    this._renderer.setStyle(
      this._sidenav.nativeElement,
      'transform',
      `translateX(${translation}%)`
    );
  }

  private _setupInitialStyling(): void {
    if (this.right) {
      this._renderer.addClass(this._sidenav.nativeElement, 'sidenav-right');
    }

    this._setColor();
    this._renderer.setStyle(this._sidenav.nativeElement, 'width', `${this.sidenavWidth}px`);
    this._renderer.setStyle(
      this._sidenav.nativeElement,
      'height',
      this.position === 'fixed' ? '100vh' : '100%'
    );
    this._renderer.setStyle(this._sidenav.nativeElement, 'position', this.position);

    setTimeout(() => {
      this._renderer.setStyle(
        this._sidenav.nativeElement,
        'transition',
        `all ${this.sidenavTransitionDuration} linear`
      );
    }, 0);
  }

  private _setColor(): void {
    const colors = [
      'primary',
      'secondary',
      'success',
      'info',
      'warning',
      'danger',
      'light',
      'dark',
    ];
    const color = colors.includes(this.color) ? this.color : 'primary';

    colors.forEach((el) => {
      this._renderer.removeClass(this._sidenav.nativeElement, `sidenav-${el}`);
    });

    this._renderer.addClass(this._sidenav.nativeElement, `sidenav-${color}`);
  }

  private _updateOffsets(show: boolean, initial = false): void {
    const [paddingPosition, marginPosition] = this.right ? ['right', 'left'] : ['left', 'right'];

    const padding = {
      property: this._getProperty('padding', paddingPosition),
      value: this.mode === 'over' ? 0 : this.sidenavWidth,
    };

    const margin = {
      property: this._getProperty('margin', marginPosition),
      value: this.mode === 'push' ? -1 * this.sidenavWidth : 0,
    };

    this.triggerEvents('sidenavUpdate');

    if (!this._contentEl) {
      return;
    }

    this._setContentOffsets(show, { padding, margin }, initial);
  }

  private _setupSlim(): void {
    this._slimCollapsed = this.slimCollapsed;

    this._toggleSlimDisplay(this._slimCollapsed);

    if (this.expandOnHover) {
      this._renderer.listen(this._sidenav.nativeElement, 'mouseenter', () => {
        if (this._slimCollapsed) {
          this.setSlim(false);
        }
      });
      this._renderer.listen(this._sidenav.nativeElement, 'mouseleave', () => {
        if (!this._slimCollapsed) {
          this.setSlim(true);
        }
      });
    }
  }

  private _toggleSlimDisplay(slim: boolean): void {
    const toggleElements = () => {
      this._elRef.nativeElement.querySelectorAll('[slim="true"]').forEach((el) => {
        this._renderer.setStyle(el, 'display', this._slimCollapsed ? 'unset' : 'none');
      });
      this._elRef.nativeElement.querySelectorAll('[slim="false"]').forEach((el) => {
        this._renderer.setStyle(el, 'display', this._slimCollapsed ? 'none' : 'unset');
      });
    };

    if (slim) {
      setTimeout(() => toggleElements(), this.transitionDuration);
    } else {
      toggleElements();
    }
  }

  private _setupScrolling(): void {
    let container = this.container;

    if (this.scrollContainer) {
      container = this._elRef.nativeElement.querySelector(this.scrollContainer);

      const siblings = Array.from(container.parentNode.children).filter((el) => el !== container);

      const siblingsHeight = siblings.reduce((a, b) => {
        return a + b.clientHeight;
      }, 0);

      this._renderer.setStyle(container, 'maxHeight', `calc(100% - ${siblingsHeight}px)`);
      this._renderer.setStyle(container, 'position', 'relative');
    }
  }

  private _setContentOffsets(show: boolean, offsets: any, initial: boolean): void {
    const padding = this._getOffsetValue(show, { property: 'padding', offsets });
    const margin = this._getOffsetValue(show, { property: 'margin', offsets });

    if (!initial) {
      this._renderer.setStyle(
        this._contentEl,
        'transition',
        `all ${this.sidenavTransitionDuration} linear`
      );
    }

    this._renderer.setStyle(this._contentEl, offsets.padding.property, `${padding}px`);
    this._renderer.setStyle(this._contentEl, offsets.margin.property, `${margin}px`);

    if (!show) {
      return;
    }

    if (initial) {
      this._renderer.setStyle(this._contentEl, 'transition', this._initialContentStyle.transition);
      return;
    }
  }

  private _getOffsetValue(show: boolean, { property, offsets }): number {
    const initialValue = this._getPxValue(this._initialContentStyle[offsets[property].property]);
    const offset = show ? offsets[property].value : 0;
    return initialValue + offset;
  }

  private _getPxValue(property: string): number {
    if (!property) {
      return 0;
    }
    return parseFloat(property);
  }

  private _getProperty(...args: any): string {
    return args
      .map((arg, i) => {
        if (i === 0) {
          return arg;
        }
        return arg[0].toUpperCase().concat(arg.slice(1));
      })
      .join('');
  }

  static ngAcceptInputType_accordion: BooleanInput;
  static ngAcceptInputType_backdrop: BooleanInput;
  static ngAcceptInputType_closeOnEsc: BooleanInput;
  static ngAcceptInputType_expandOnHover: BooleanInput;
  static ngAcceptInputType_hidden: BooleanInput;
  static ngAcceptInputType_slim: BooleanInput;
  static ngAcceptInputType_slimCollapsed: BooleanInput;
  static ngAcceptInputType_right: BooleanInput;
  static ngAcceptInputType_focusTrap: BooleanInput;
}
