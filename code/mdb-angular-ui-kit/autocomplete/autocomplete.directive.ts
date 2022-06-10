import {
  Directive,
  ElementRef,
  Inject,
  Input,
  OnDestroy,
  forwardRef,
  HostListener,
  ViewContainerRef,
  QueryList,
  HostBinding,
} from '@angular/core';
import { MdbAutocompleteComponent } from './autocomplete.component';

import { DOCUMENT } from '@angular/common';
import { ControlValueAccessor, NG_VALUE_ACCESSOR } from '@angular/forms';
import { TAB, ENTER, HOME, END, ESCAPE, UP_ARROW, DOWN_ARROW } from '@angular/cdk/keycodes';
import { Subject, fromEvent, merge } from 'rxjs';
import { takeUntil, filter, tap, switchMap, startWith } from 'rxjs/operators';
import {
  OverlayRef,
  Overlay,
  PositionStrategy,
  ConnectionPositionPair,
  ViewportRuler,
} from '@angular/cdk/overlay';
import { TemplatePortal } from '@angular/cdk/portal';
import { MdbOptionComponent } from 'mdb-angular-ui-kit/option';

export const MDB_AUTOCOMPLETE_VALUE_ACCESOR: any = {
  provide: NG_VALUE_ACCESSOR,
  // tslint:disable-next-line: no-use-before-declare
  useExisting: forwardRef(() => MdbAutocompleteDirective),
  multi: true,
};

@Directive({
  selector: 'input[mdbAutocomplete], textarea[mdbAutocomplete]',
  exportAs: 'mdbAutocompleteInput',
  providers: [MDB_AUTOCOMPLETE_VALUE_ACCESOR],
})
export class MdbAutocompleteDirective implements OnDestroy, ControlValueAccessor {
  @Input() mdbAutocomplete: MdbAutocompleteComponent;

  private _overlayRef: OverlayRef | null;
  private _portal: TemplatePortal;
  private _canOpenOnFocus = true;
  _isDropdownOpen = false;

  private _destroy$: Subject<void> = new Subject();

  get input(): HTMLInputElement {
    return this._elementRef.nativeElement;
  }

  // get labelActive(): boolean {
  //   return this._isDropdownOpen || this.hasValue;
  // }

  get hasValue(): boolean {
    return this._elementRef.nativeElement.value;
  }

  @HostListener('keydown', ['$event'])
  onKeydown(event: KeyboardEvent) {
    this._handleKeyDown(event);
    // tslint:disable-next-line: deprecation
    const isTabKey = event.keyCode === TAB;
    if (isTabKey) {
      this.close();
    }
  }

  @HostListener('input', ['$event'])
  _handleInput(event: any) {
    if (!this._isDropdownOpen) {
      this.open();
    }

    this._onChange(event.target.value);
  }

  @HostListener('focusin')
  _handleFocusIn() {
    if (!this._canOpenOnFocus) {
      this._canOpenOnFocus = true;
    } else {
      this.open();
    }
  }

  @HostListener('blur')
  _handleBlur() {
    this._canOpenOnFocus = this.document.activeElement !== this.input;
    this._onTouched();
  }

  @HostBinding('class.autocomplete-input') autocomplete = true;

  @HostBinding('class.focused')
  get isOpen(): boolean {
    return this._isDropdownOpen;
  }

  @HostBinding('class.autocomplete-active')
  get labelActive(): boolean {
    return this._isDropdownOpen || this.hasValue;
  }

  constructor(
    private _overlay: Overlay,
    private _vcr: ViewContainerRef,
    private _elementRef: ElementRef,
    private _viewportRuler: ViewportRuler,
    @Inject(DOCUMENT) private document: any
  ) {}

  private _handleKeyDown(event: KeyboardEvent) {
    // tslint:disable-next-line: deprecation
    const key = event.keyCode;
    const manager = this.mdbAutocomplete._keyManager;

    if (this.activeOption && this._isDropdownOpen && key === ENTER) {
      this._setValue(this.activeOption);
      this.activeOption.select();
      this._resetHighlight();
      this._clearPreviousSelection();
      this.close();
      event.preventDefault();
    }

    if (this.mdbAutocomplete) {
      const previousActiveItem = manager.activeItem;

      if (this._isDropdownOpen || key === TAB) {
        manager.onKeydown(event);
      }

      if (!this._isDropdownOpen && key === DOWN_ARROW && event.altKey) {
        this.open();
      }

      if (key === HOME) {
        manager.setFirstItemActive();
      } else if (key === END) {
        manager.setLastItemActive();
      }

      if (manager.activeItem !== previousActiveItem) {
        this._moveHighlightedIntoView();
      }
    }
  }

  private _moveHighlightedIntoView() {
    const index = this.mdbAutocomplete._keyManager.activeItemIndex;

    if (index === 0) {
      this.mdbAutocomplete._setScrollTop(0);
    } else if (index && index > -1) {
      let newScrollPosition: number;
      const option = this.mdbAutocomplete._getOptionsArray()[index];
      const optionHeight = option.offsetHeight;
      const listHeight = this.mdbAutocomplete.listHeight;

      const itemTop = index * optionHeight;
      const itemBottom = itemTop + optionHeight;

      const viewTop = this.mdbAutocomplete._getScrollTop();
      const viewBottom = viewTop + listHeight;

      if (itemBottom > viewBottom) {
        newScrollPosition = itemBottom - listHeight;
        this.mdbAutocomplete._setScrollTop(newScrollPosition);
      } else if (itemTop < viewTop) {
        newScrollPosition = itemTop;
        this.mdbAutocomplete._setScrollTop(newScrollPosition);
      }
    }
  }

  private _setValue(option: MdbOptionComponent) {
    this._clearPreviousSelection();

    const value =
      this.mdbAutocomplete && this.mdbAutocomplete.displayValue
        ? this.mdbAutocomplete.displayValue(option.value)
        : option.value;
    this._setInputValue(value);
    this._onChange(value);

    this.mdbAutocomplete.selected.emit({
      component: this.mdbAutocomplete,
      option: option,
    });
  }

  private _clearPreviousSelection() {
    this.mdbAutocomplete.options.forEach((option: MdbOptionComponent) => {
      if (option.selected) {
        option.deselect();
      }
    });
  }

  private _setInputValue(value: any) {
    this.input.value = value;
  }

  get activeOption(): MdbOptionComponent | null {
    if (this.mdbAutocomplete && this.mdbAutocomplete._keyManager) {
      return this.mdbAutocomplete._keyManager.activeItem;
    }

    return null;
  }

  private _resetHighlight() {
    this.mdbAutocomplete._keyManager.setActiveItem(0);
  }

  open() {
    let overlayRef = this._overlayRef;

    if (!overlayRef) {
      this._portal = new TemplatePortal(this.mdbAutocomplete.dropdownTemplate, this._vcr);

      overlayRef = this._overlay.create({
        width: this.input.offsetWidth,
        scrollStrategy: this._overlay.scrollStrategies.reposition(),
        positionStrategy: this._getOverlayPosition(),
      });

      this._overlayRef = overlayRef;

      overlayRef.keydownEvents().subscribe((event: KeyboardEvent) => {
        // tslint:disable-next-line: deprecation
        const key = event.keyCode;

        if (key === ESCAPE || (key === UP_ARROW && event.altKey)) {
          event.preventDefault();
          event.stopPropagation();
          this.close();
          this._resetHighlight();
        }
      });
    }

    if (overlayRef && !overlayRef.hasAttached()) {
      overlayRef.attach(this._portal);
      this._listenToOptionChange();
      this._listenToOutSideCick(overlayRef, this.input).subscribe(() => this.close());
    }

    if (this._viewportRuler) {
      this._viewportRuler
        .change()
        .pipe(takeUntil(this._destroy$))
        .subscribe(() => {
          if (this._isDropdownOpen && overlayRef) {
            overlayRef.updateSize({ width: this.input.offsetWidth });
          }
        });
    }

    this.mdbAutocomplete._keyManager.setActiveItem(0);
    this.mdbAutocomplete._markForCheck();
    this._isDropdownOpen = true;
    this.mdbAutocomplete.opened.emit();
  }

  private _listenToOptionChange() {
    this.mdbAutocomplete.options.changes
      .pipe(
        startWith(this.mdbAutocomplete.options),
        tap(() => {
          if (this._overlayRef) {
            this._overlayRef.updatePosition();
          }
        }),
        switchMap((options: QueryList<MdbOptionComponent>) => {
          Promise.resolve().then(() => this._resetHighlight());
          return merge(...options.map((option: MdbOptionComponent) => option.click$));
        }),
        takeUntil(this._destroy$)
      )
      .subscribe((clickedOption: MdbOptionComponent) => this._handleOptionClick(clickedOption));
  }

  private _handleOptionClick(option: MdbOptionComponent) {
    this._resetHighlight();
    this._clearPreviousSelection();
    this._setValue(option);
    this._canOpenOnFocus = false;
    this.input.focus();
    this.close();
    option.select();
  }

  close() {
    if (!this._isDropdownOpen) {
      return;
    }

    if (this._overlayRef && this._overlayRef.hasAttached()) {
      this._overlayRef.detach();
      this._isDropdownOpen = false;
      this.mdbAutocomplete.closed.emit();
    }
  }

  private _listenToOutSideCick(overlayRef: OverlayRef, origin: HTMLElement) {
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

  private _getOverlayPosition(): PositionStrategy {
    const positionStrategy = this._overlay
      .position()
      .flexibleConnectedTo(this.input)
      .withPositions(this._getPositions())
      .withPush(false);

    return positionStrategy;
  }

  private _getPositions(): ConnectionPositionPair[] {
    // If label floats we need to add additional offset for top position
    // Bottom offset is needed because of the box-shadow on input border
    const bottomOffset = 1;
    const topOffset = -6;
    return [
      {
        originX: 'start',
        originY: 'bottom',
        offsetY: bottomOffset,
        overlayX: 'start',
        overlayY: 'top',
      },
      {
        originX: 'start',
        originY: 'top',
        offsetY: topOffset,
        overlayX: 'start',
        overlayY: 'bottom',
      },
    ];
  }

  ngOnDestroy() {
    this._destroy$.next();
    this._destroy$.complete();
    this._destroyDropdown();
  }

  private _destroyDropdown() {
    if (this._overlayRef) {
      this.close();
      this._overlayRef.dispose();
      this._overlayRef = null;
    }
  }

  /** Control value accessor methods */

  setDisabledState(isDisabled: boolean) {
    this.input.disabled = isDisabled;
  }

  _onChange: (value: any) => void = () => {};

  _onTouched = () => {};

  writeValue(value: any): void {
    Promise.resolve().then(() => {
      this.input.value = value;
    });
  }

  registerOnChange(fn: (value: any) => {}): void {
    this._onChange = fn;
  }

  registerOnTouched(fn: () => {}) {
    this._onTouched = fn;
  }
}
