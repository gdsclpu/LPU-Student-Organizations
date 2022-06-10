import {
  BooleanInput,
  coerceBooleanProperty,
  coerceNumberProperty,
  NumberInput,
} from '@angular/cdk/coercion';
import {
  ConnectedPosition,
  Overlay,
  OverlayConfig,
  OverlayPositionBuilder,
  OverlayRef,
} from '@angular/cdk/overlay';
import { ComponentPortal } from '@angular/cdk/portal';
import {
  ComponentRef,
  Directive,
  ElementRef,
  EventEmitter,
  Input,
  OnDestroy,
  OnInit,
  Output,
  Renderer2,
} from '@angular/core';
import { Observable, Subject, fromEvent } from 'rxjs';
import { filter, takeUntil } from 'rxjs/operators';
import { MdbMentionComponent } from './mention.component';

export interface MdbMentionChange {
  trigger: string;
  searchTerm: string;
}

export interface MdbMentionQuery {}
@Directive({
  // eslint-disable-next-line @angular-eslint/directive-selector
  selector: 'input[mdbMention], textarea[mdbMention]',
  exportAs: 'mdbMention',
})
export class MdbMentionDirective implements OnInit, OnDestroy {
  private _overlayRef: OverlayRef | null = null;

  @Input() placement: 'top' | 'bottom' | 'left' | 'right' = 'bottom';
  @Input() trigger: string | string[] = '@';
  @Input()
  get outputKey(): string {
    return this._outputKey;
  }
  set outputKey(value: string) {
    this._outputKey = value;
  }
  private _outputKey = '';

  @Input()
  get visibleItems(): number {
    return this._visibleItems;
  }
  set visibleItems(value: NumberInput) {
    this._visibleItems = coerceNumberProperty(value);

    if (this._mentionRef) {
      this._mentionRef.instance.visibleItems = this._visibleItems;
    }
  }
  private _visibleItems = 5;

  @Input()
  get disableFilter(): boolean {
    return this._disableFilter;
  }
  set disableFilter(value: BooleanInput) {
    this._disableFilter = coerceBooleanProperty(value);
  }
  private _disableFilter = false;

  @Input()
  get showListOnTrigger(): boolean {
    return this._showListOnTrigger;
  }
  set showListOnTrigger(value: BooleanInput) {
    this._showListOnTrigger = coerceBooleanProperty(value);
  }
  private _showListOnTrigger = true;

  @Input()
  get asyncError(): boolean {
    return this._asyncError;
  }
  set asyncError(value: BooleanInput) {
    this._asyncError = coerceBooleanProperty(value);

    if (this._mentionRef) {
      this._mentionRef.instance.asyncError = this._asyncError;
    }
  }
  private _asyncError = false;

  @Input()
  get showImg(): boolean {
    return this._showImg;
  }
  set showImg(value: BooleanInput) {
    this._showImg = coerceBooleanProperty(value);

    if (this._mentionRef) {
      this._mentionRef.instance.showImg = this._showImg;
    }
  }
  private _showImg = false;

  @Input()
  get noResultText(): string {
    return this._noResultText;
  }
  set noResultText(value: string) {
    this._noResultText = value;

    if (this._mentionRef) {
      this._mentionRef.instance.noResultText = value;
    }
  }
  private _noResultText = 'No result found';

  @Input()
  get items(): any[] {
    return this._items;
  }
  set items(value: any[]) {
    this._items = value ? value : [];

    if (this._mentionRef) {
      this._mentionRef.instance.items = this._items;
    }
  }
  private _items: any[] = [];

  @Input()
  get queryBy(): string {
    return this._queryBy;
  }
  set queryBy(value: string) {
    this._queryBy = value;

    if (this._mentionRef) {
      this._mentionRef.instance.queryBy = this._queryBy;
    }
  }
  private _queryBy = 'username';

  @Input()
  get showNoResultText(): boolean {
    return this._showNoResultText;
  }
  set showNoResultText(value: BooleanInput) {
    this._showNoResultText = coerceBooleanProperty(value);

    if (this._mentionRef) {
      this._mentionRef.instance.showNoResultText = this._showNoResultText;
    }
  }
  private _showNoResultText = true;

  @Output() readonly mentionChange: EventEmitter<MdbMentionChange> = new EventEmitter();
  @Output() readonly mentionClose: EventEmitter<void> = new EventEmitter();
  @Output() readonly mentionOpen: EventEmitter<void> = new EventEmitter();
  @Output() readonly mentionSelect: EventEmitter<any> = new EventEmitter();

  private _mentionRef: ComponentRef<MdbMentionComponent> | null = null;
  private _open = false;
  private _caretPositionIndex = 0;
  private _isTriggerValid = false;
  private _presentTrigger = '';

  mentionValue = '';

  private readonly _destroy$: Subject<void> = new Subject<void>();

  constructor(
    private _overlay: Overlay,
    private _overlayPositionBuilder: OverlayPositionBuilder,
    private _elementRef: ElementRef,
    private _renderer: Renderer2
  ) {}

  ngOnInit(): void {
    this._renderer.setAttribute(this._elementRef.nativeElement, 'autocomplete', 'off');
    this._bindTriggerEvents();
  }

  private _getPosition(): ConnectedPosition[] {
    let position;

    const positionTop = {
      originX: 'start',
      originY: 'top',
      overlayX: 'start',
      overlayY: 'bottom',
      offsetY: 0,
    };

    const positionBottom = {
      originX: 'start',
      originY: 'bottom',
      overlayX: 'start',
      overlayY: 'top',
      offsetY: 0,
    };

    const positionRight = {
      originX: 'end',
      originY: 'center',
      overlayX: 'start',
      overlayY: 'center',
      offsetX: 0,
    };

    const positionLeft = {
      originX: 'start',
      originY: 'center',
      overlayX: 'end',
      overlayY: 'center',
      offsetX: 0,
    };

    switch (this.placement) {
      case 'top':
        position = [positionTop, positionBottom];
        break;
      case 'bottom':
        position = [positionBottom, positionTop];
        break;
      case 'left':
        position = [positionLeft, positionRight];
        break;
      case 'right':
        position = [positionRight, positionLeft];
        break;
      default:
        position = [positionBottom, positionTop];
        break;
    }

    return position;
  }

  private _createOverlayConfig(): OverlayConfig {
    const positionStrategy = this._overlayPositionBuilder
      .flexibleConnectedTo(this._elementRef)
      .withPositions(this._getPosition());
    const overlayConfig = new OverlayConfig({
      width: this._elementRef.nativeElement.offsetWidth,
      hasBackdrop: false,
      scrollStrategy: this._overlay.scrollStrategies.reposition(),
      positionStrategy,
    });

    return overlayConfig;
  }

  private _createOverlay(): void {
    this._overlayRef = this._overlay.create(this._createOverlayConfig());
  }

  private _listenToOutSideClick(
    overlayRef: OverlayRef,
    origin: HTMLElement
  ): Observable<MouseEvent> {
    return fromEvent(document, 'click').pipe(
      filter((event: MouseEvent) => {
        const target = event.target as HTMLElement;
        const notOrigin = target !== origin;
        const notOverlay = !!overlayRef && overlayRef.overlayElement.contains(target) === false;
        return notOrigin && notOverlay;
      }),
      takeUntil(overlayRef.detachments())
    );
  }

  private _handleOptionClick(item: any) {
    this.mentionSelect.emit(item);
    this._setHostValue(item);
    this.close();
  }

  private _setDataForDropdown() {
    let filtereditems: any[];

    if (!this._disableFilter) {
      filtereditems = this._filter(this.mentionValue);
      this._mentionRef.instance.items = filtereditems ? filtereditems : this._items;
    }
    this._mentionRef.instance.mentionValue = this.mentionValue;
  }

  private _updateMentionString(caretPositionIndex: number): void {
    const hostValueBeforeCaret = this._elementRef.nativeElement.value.slice(0, caretPositionIndex);
    const triggers = [...this.trigger];

    if (!this._caretPositionIndex) {
      this.mentionValue = '';
      this._isTriggerValid = false;
      return;
    }

    for (let i = hostValueBeforeCaret.length - 1; i >= 0; i--) {
      if (hostValueBeforeCaret.charAt(i) === ' ') {
        this.mentionValue = '';
        this._isTriggerValid = false;
        return;
      }
      if (triggers.some((trigger) => trigger === hostValueBeforeCaret.charAt(i))) {
        if (hostValueBeforeCaret.charAt(i - 1) !== ' ' && i > 1) {
          return;
        }

        const trigger = hostValueBeforeCaret.charAt(i);
        const hostValueAfterTrigger = this._elementRef.nativeElement.value.slice(i);
        const mentionValues = hostValueAfterTrigger.split(' ')[0];
        const mentionValue = mentionValues.split(trigger)[1] ? mentionValues.split(trigger)[1] : '';
        this.mentionValue = mentionValue;
        this._isTriggerValid = true;
        this._presentTrigger = trigger;

        this.mentionChange.emit({
          trigger: trigger,
          searchTerm: this.mentionValue,
        });
        return;
      }
    }
  }

  private _toggleDropdown() {
    if (!this._open && this._isTriggerValid) {
      if (!this._showListOnTrigger && this.mentionValue.length < 1) {
        return;
      }
      this.open();
      this._mentionRef.instance.queryBy = this.queryBy;
      this._mentionRef.instance.noResultText = this._noResultText;
      this._mentionRef.instance.showNoResultText = this._showNoResultText;
      this._mentionRef.instance.asyncError = this._asyncError;
      this._mentionRef.instance.showImg = this._showImg;
      this._mentionRef.instance.visibleItems = this._visibleItems;

      return;
    }
    if (!this._isTriggerValid) {
      this.close();
    }
  }

  private _handleDropdownByCaret(event: Event): void {
    const target = event.target as HTMLInputElement;
    this._caretPositionIndex = target.selectionStart;
    this._updateMentionString(this._caretPositionIndex);

    this._toggleDropdown();
    if (!this._open) {
      return;
    }

    this._setDataForDropdown();
  }

  private _bindTriggerEvents(): void {
    fromEvent(this._elementRef.nativeElement, 'click')
      .pipe(takeUntil(this._destroy$))
      .subscribe((event: Event) => {
        this._handleDropdownByCaret(event);
      });

    fromEvent(this._elementRef.nativeElement, 'keydown')
      .pipe(takeUntil(this._destroy$))
      .subscribe((event: KeyboardEvent) => {
        const { key } = event;

        const isKeyEscape = key === 'Escape';
        const isKeyResponsibleForTabout = key === 'Tab';
        const isKeyResponsibleForDropdownNavigation =
          ['ArrowUp', 'ArrowDown', 'Escape', 'Home', 'End', 'Enter'].indexOf(key) > -1;
        if (isKeyResponsibleForDropdownNavigation) {
          if (isKeyEscape) {
            this.close();
          }
          event.preventDefault();
          return;
        }

        if (isKeyResponsibleForTabout) {
          return;
        }

        setTimeout(() => {
          this._handleDropdownByCaret(event);
        }, 0);
      });
  }

  private _setHostValue(value: any): void {
    const hostValueBeforeCaret = this._elementRef.nativeElement.value.slice(
      0,
      this._caretPositionIndex
    );
    for (let i = hostValueBeforeCaret.length - 1; i >= 0; i--) {
      if (hostValueBeforeCaret.charAt(i) === ' ') {
        return;
      }
      if (hostValueBeforeCaret.charAt(i) === this._presentTrigger) {
        const hostValueBeforeTrigger = this._elementRef.nativeElement.value.slice(0, i);
        const hostValueAfterTrigger = this._elementRef.nativeElement.value.slice(i);
        const hostNewValueAfterTrigger = hostValueAfterTrigger.split(' ')[1]
          ? hostValueAfterTrigger.split(' ').splice(1).join(' ')
          : '';
        this._elementRef.nativeElement.value = hostValueBeforeTrigger.concat(
          this._presentTrigger,
          value[this._outputKey ? this._outputKey : this._queryBy],
          ' ',
          hostNewValueAfterTrigger
        );
      }
    }
  }

  private _filter(value: string): any[] {
    const filterValue = value.toLowerCase();
    const filtereditems = this._items.filter((item: any) =>
      item[this._queryBy].toLowerCase().includes(filterValue)
    );
    return filtereditems;
  }

  open(): void {
    if (this._open) {
      return;
    }

    if (!this._overlayRef) {
      this._createOverlay();
    }

    if (this._overlayRef.hasAttached()) {
      this._overlayRef.detach();
    }

    const mentionPortal = new ComponentPortal(MdbMentionComponent);
    this._mentionRef = this._overlayRef.attach(mentionPortal);
    this._open = true;

    this._mentionRef.instance.optionClick.subscribe((item) => {
      this._handleOptionClick(item);
    });

    this._mentionRef.instance.tabout.subscribe(() => {
      this.close();
    });

    this._listenToOutSideClick(this._overlayRef, this._elementRef.nativeElement).subscribe(() =>
      this.close()
    );
    this.mentionOpen.emit();
  }

  close(): void {
    if (this._overlayRef) {
      if (this._overlayRef.hasAttached()) {
        this._overlayRef.detach();
      }
    }

    if (this._open) {
      this._open = false;
    }

    this.mentionClose.emit();
  }

  ngOnDestroy() {
    this._destroy$.next();
    this._destroy$.complete();

    if (this._overlayRef) {
      this.close();
      this._overlayRef.dispose();
      this._overlayRef = null;
    }
  }
}
