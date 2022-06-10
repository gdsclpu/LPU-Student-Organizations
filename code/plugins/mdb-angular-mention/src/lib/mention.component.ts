import { ActiveDescendantKeyManager } from '@angular/cdk/a11y';
import {
  AfterViewInit,
  Component,
  ElementRef,
  EventEmitter,
  HostListener,
  Input,
  Output,
  QueryList,
  ViewChild,
  ViewChildren,
} from '@angular/core';
import { MdbMentionItemComponent } from './mention-item.component';
import { dropdownAnimation, dropdownContainerAnimation } from './mention.animations';
@Component({
  // eslint-disable-next-line @angular-eslint/component-selector
  selector: 'mdb-mention',
  templateUrl: `mention.component.html`,
  styles: [],
  animations: [dropdownAnimation, dropdownContainerAnimation],
})
export class MdbMentionComponent implements AfterViewInit {
  constructor() {}
  @ViewChildren(MdbMentionItemComponent) options: QueryList<MdbMentionItemComponent>;
  @ViewChild('dropdownList') _dropdownList: ElementRef;
  @Input() optionHeight = 35;

  noResultText = 'No result found';
  visibleItems = 5;
  items: any[] = [];
  queryBy = 'username';
  showNoResultText = true;
  asyncError = false;
  showImg = false;
  mentionValue = '';

  @Output() optionClick: EventEmitter<any> = new EventEmitter();
  @Output() tabout: EventEmitter<any> = new EventEmitter();

  keyManager: ActiveDescendantKeyManager<MdbMentionItemComponent>;

  ngAfterViewInit() {
    this.keyManager = new ActiveDescendantKeyManager<MdbMentionItemComponent>(this.options);
    setTimeout(() => {
      this.keyManager.setFirstItemActive();
    }, 0);

    this.options.changes.subscribe(() => {
      setTimeout(() => {
        this.keyManager.setFirstItemActive();
      }, 0);
    });

    this.keyManager.tabOut.subscribe(() => {
      this.tabout.emit();
    });
  }

  @HostListener('window:keydown', ['$event'])
  handleKeyDown(event: KeyboardEvent) {
    if (!this.items) {
      return;
    }
    const key = event.code;
    this.keyManager.onKeydown(event);
    switch (key) {
      case 'Home':
        this.keyManager.setFirstItemActive();
        break;
      case 'End':
        this.keyManager.setLastItemActive();
        break;
      case 'Enter':
        const activeItem = this.keyManager.activeItem.item;
        this.handleOptionClick(activeItem);
        break;
    }
    this._moveHighlightedIntoView();
  }

  handleOptionClick(item: any) {
    this.optionClick.emit(item);
  }

  private _setScrollTop(scrollPosition: number) {
    if (this._dropdownList) {
      this._dropdownList.nativeElement.scrollTop = scrollPosition;
    }
  }

  private _moveHighlightedIntoView() {
    const index = this.keyManager.activeItemIndex;

    if (index === 0) {
      this._setScrollTop(0);
    } else if (index && index > -1) {
      let newScrollPosition: number;
      const optionHeight = this.optionHeight;
      const listHeight = this._dropdownList.nativeElement.clientHeight;

      const itemTop = index * optionHeight;
      const itemBottom = itemTop + optionHeight;

      const viewTop = this._dropdownList.nativeElement.scrollTop;
      const viewBottom = viewTop + listHeight;
      if (itemBottom > viewBottom) {
        newScrollPosition = itemBottom - listHeight;
        this._setScrollTop(newScrollPosition);
      } else if (itemTop < viewTop) {
        newScrollPosition = itemTop;
        this._setScrollTop(newScrollPosition);
      }
    }
  }
}
