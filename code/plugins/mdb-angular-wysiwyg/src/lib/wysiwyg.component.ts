import { DOCUMENT } from '@angular/common';
import {
  AfterViewInit,
  Component,
  ElementRef,
  EventEmitter,
  forwardRef,
  Inject,
  Input,
  NgZone,
  OnDestroy,
  OnInit,
  Output,
  QueryList,
  ViewChild,
  ViewChildren,
} from '@angular/core';
import { FormControl, FormGroup, NG_VALUE_ACCESSOR } from '@angular/forms';
import { MdbDropdownDirective } from 'mdb-angular-ui-kit/dropdown';
import { fromEvent, Observable, Subject } from 'rxjs';
import { debounceTime, distinctUntilChanged, takeUntil } from 'rxjs/operators';
import {
  OPTIONS_ITEMS,
  TOOLBAR_OPTIONS,
  COLORS_OPTIONS,
  TOOLBAR_STYLE_ITEMS,
  TEXT_FORMATING_ITEMS,
  ALIGN_ITEMS,
  LIST_ITEMS,
  UNDO_REDO_ITEMS,
} from './wysiwyg-defaults';
// eslint-disable-next-line @angular-eslint/component-selector
import { MdbWysiwygOptions } from './wysiwyg-options.interface';
import { MdbWysiwygToolbarOptions } from './wysiwyg-toolbar-options.interface';

interface wysiwygSelection {
  anchorNode: Node | null;
  anchorOffset: number;
  focusNode: Node | null;
  focusOffset: number;
}

interface wysiwygTool {
  id: string;
  width: number;
}

const VALUE_ACCESSOR = {
  provide: NG_VALUE_ACCESSOR,
  // tslint:disable-next-line: no-use-before-declare
  useExisting: forwardRef(() => MdbWysiwygComponent),
  multi: true,
};

@Component({
  // eslint-disable-next-line @angular-eslint/component-selector
  selector: 'mdb-wysiwyg',
  templateUrl: 'wysiwyg.component.html',
  providers: [VALUE_ACCESSOR],
})
export class MdbWysiwygComponent implements OnInit, AfterViewInit, OnDestroy {
  @ViewChild('linkDropdown') linkDropdown: MdbDropdownDirective;
  @ViewChild('imageDropdown') imageDropdown: MdbDropdownDirective;
  @ViewChild('wysiwygContent', { static: true }) wysiwygContent: ElementRef;
  @ViewChild('toolbarToggler') toolbarToggler: ElementRef;
  @ViewChildren('tools') tools: QueryList<ElementRef>;

  @Input()
  get value(): string {
    return this._value;
  }
  set value(newValue: string) {
    if (newValue || newValue === '') {
      this._value = newValue;
      this.wysiwygContent.nativeElement.innerHTML = newValue;
    } else {
      this._value = '';
      this.wysiwygContent.nativeElement.innerHTML = '';
    }
  }
  @Input()
  get toolbarOptions(): MdbWysiwygToolbarOptions {
    return this._toolbarOptions;
  }
  set toolbarOptions(newValue: MdbWysiwygToolbarOptions) {
    this._toolbarOptions = newValue;
  }
  @Input() fixed: boolean = false;
  @Input() fixedOffsetTop: number = 0;
  @Input()
  get options(): MdbWysiwygOptions {
    return this._options;
  }
  set options(newValue: MdbWysiwygOptions) {
    this._options = newValue;
  }
  @Input()
  get colors(): string[] {
    return this._colors;
  }
  set colors(newValue: string[]) {
    this._colors = newValue;
  }

  @Output() valueChange: EventEmitter<string> = new EventEmitter<string>();
  @Output() valueContent: EventEmitter<string> = new EventEmitter<string>();

  linkForm: FormGroup;
  imageForm: FormControl;
  isCodeShown: boolean;

  toolbarStyleItems = TOOLBAR_STYLE_ITEMS;
  toolbarTextFormatingItems = TEXT_FORMATING_ITEMS;
  alignItems = ALIGN_ITEMS;
  listItems = LIST_ITEMS;
  undoRedoItems = UNDO_REDO_ITEMS;

  toolbarOptionsVisibility = {
    styles: true,
    formatting: true,
    align: true,
    lists: true,
    links: true,
    showCode: true,
    undoRedo: true,
  };

  toolbarTogglerVisible = false;

  private _toolbarOptionsWidth: wysiwygTool[] = [];
  private _value = '';
  private _selection: wysiwygSelection = {
    anchorNode: null,
    anchorOffset: 0,
    focusNode: null,
    focusOffset: 0,
  };
  private _toolbarOptions: MdbWysiwygToolbarOptions;
  private _colors = COLORS_OPTIONS;
  private _options = OPTIONS_ITEMS;

  private wysiwygValueChange$: Subject<any> = new Subject<any>();
  private _destroy = new Subject<void>();

  valueChange$(): Observable<any> {
    return this.wysiwygValueChange$;
  }

  onChange = (_: any) => {};
  onTouched = () => {};

  writeValue(value: any) {
    if (value || value === '') {
      this.value = value;
      this.wysiwygContent.nativeElement.innerHTML = this.value;
      this.wysiwygValueChange$.next(value);
      // this.valueChange.emit(value);
      this.onChange(value);
      this.onTouched();
    }
  }

  valueChanged() {
    this.onChange(this.value);
  }

  registerOnChange(fn: (_: any) => void) {
    this.onChange = fn;
  }

  registerOnTouched(fn: () => void) {
    this.onTouched = fn;
  }

  setDisableState(isDisabled: boolean): void {}

  constructor(
    private el: ElementRef,
    private _ngZone: NgZone,
    @Inject(DOCUMENT) private document: any
  ) {}

  ngOnInit(): void {
    this.linkForm = new FormGroup({
      url: new FormControl(),
      description: new FormControl(),
    });
    this.imageForm = new FormControl();

    this.toolbarOptions = this.toolbarOptions
      ? this._deepMerge(this.toolbarOptions, TOOLBAR_OPTIONS)
      : TOOLBAR_OPTIONS;

    this._ngZone.runOutsideAngular(() => {
      fromEvent(window, 'resize').subscribe((event: any) => {
        this._ngZone.run(() => {
          this._updateToolbar();
        });
      });
    });
  }

  ngAfterViewInit(): void {
    if (this.value || this.value === '') {
      this.wysiwygContent.nativeElement.innerHTML = this.value;
    } else {
      this.wysiwygContent.nativeElement.innerHTML = '';
    }
    this._getToolsWidth();

    fromEvent(this.el.nativeElement, 'input')
      .pipe(debounceTime(100), distinctUntilChanged(), takeUntil(this._destroy))
      .subscribe((event: any) => {
        this.wysiwygValueChange$.next(event.target.innerHTML);
        this.valueChange.emit(event.target.innerHTML);
        this.onChange(event.target.innerHTML);
        this.valueContent.emit(event.target.textContent);
        this.onTouched();
      });
  }

  ngOnDestroy() {
    this._destroy.next();
    this._destroy.complete();
  }

  getCode(): string {
    return this.wysiwygContent.nativeElement.innerHTML;
  }

  performAction(command: string, argument: string = ''): void {
    this.document.execCommand(command, false, argument);
  }

  insertLink(): void {
    const { anchorNode, anchorOffset, focusNode, focusOffset } = this._selection;
    const selection = document.getSelection();
    const linkString = `<a href="${this.linkForm.value.url}" target="_blank">${this.linkForm.value.description}</a>`;

    this.linkDropdown.hide();
    this.wysiwygContent.nativeElement.focus();

    selection.setBaseAndExtent(anchorNode, anchorOffset, focusNode, focusOffset);
    this.performAction('insertHTML', linkString);
    this.linkForm.reset();
  }

  insertImage(): void {
    const { anchorNode, anchorOffset, focusNode, focusOffset } = this._selection;
    const selection = document.getSelection();
    const imageString = `<img src="${this.imageForm.value}" target="_blank" class="img-fluid" />`;

    this.imageDropdown.hide();
    this.wysiwygContent.nativeElement.focus();

    selection.setBaseAndExtent(anchorNode, anchorOffset, focusNode, focusOffset);
    this.performAction('insertHTML', imageString);
    this.imageForm.reset();
  }

  toggleHtml(): void {
    if (this.isCodeShown) {
      this.wysiwygContent.nativeElement.innerHTML = this.wysiwygContent.nativeElement.textContent;
      this.isCodeShown = false;
    } else {
      this.wysiwygContent.nativeElement.textContent = this.wysiwygContent.nativeElement.innerHTML;
      this.isCodeShown = true;
    }
  }

  getSelection(): void {
    const selection = this.document.getSelection();

    this._selection.focusOffset = selection.focusOffset;
    this._selection.focusNode = selection.focusNode;
    this._selection.anchorOffset = selection.anchorOffset;
    this._selection.anchorNode = selection.anchorNode;
  }

  onLinkDropdownOpen(): void {
    const selection = this.document.getSelection();

    if (!selection.baseNode) {
      this.wysiwygContent.nativeElement.focus();
    }

    const url = selection.baseNode.parentElement.href || '';
    const description = selection.toString();

    this.linkForm.setValue({
      url: url,
      description: description,
    });
  }

  onImageDropdownOpen(): void {
    const selection = this.document.getSelection();

    if (!selection.baseNode) {
      this.wysiwygContent.nativeElement.focus();
    }

    const url = selection.baseNode.firstChild?.currentSrc || '';

    this.imageForm.setValue(url);
  }

  private _updateToolbar() {
    const contentWidth = this.wysiwygContent.nativeElement.offsetWidth;

    let toolsWidth = 0;

    if (this.toolbarTogglerVisible) {
      toolsWidth += this.toolbarToggler.nativeElement.offsetWidth;
    }

    this._toolbarOptionsWidth.forEach((tool: wysiwygTool) => {
      const isHidden = this.toolbarOptionsVisibility[tool.id];

      toolsWidth += tool.width;

      if (contentWidth < toolsWidth && isHidden) {
        this.toolbarOptionsVisibility[tool.id] = false;

        if (!this.toolbarTogglerVisible) {
          this.toolbarTogglerVisible = true;
        }
      } else if (contentWidth > toolsWidth && !isHidden) {
        this.toolbarOptionsVisibility[tool.id] = true;
        const toolbarLastOptionVisible = this.toolbarOptionsVisibility.undoRedo;

        if (toolbarLastOptionVisible) {
          this.toolbarTogglerVisible = false;
        }
      }
    });
  }

  private _getToolsWidth(): void {
    this.tools.forEach((tool: ElementRef, index: number) => {
      const toolObject = { id: tool.nativeElement.id, width: tool.nativeElement.offsetWidth };
      this._toolbarOptionsWidth[index] = toolObject;
    });
  }

  private _deepMerge(updates, defaultOptions) {
    for (const key of Object.keys(defaultOptions)) {
      if (defaultOptions[key] instanceof Object && updates[key]) {
        this._deepMerge(updates[key], defaultOptions[key]);
      } else if (!updates[key]) {
        updates[key] = defaultOptions[key];
      }
    }
    return updates;
  }
}
