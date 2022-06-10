import { Component, Input } from '@angular/core';

@Component({
  // eslint-disable-next-line @angular-eslint/component-selector
  selector: 'mention-item',
  templateUrl: `mention-item.component.html`,
  styles: [],
})
export class MdbMentionItemComponent {
  constructor() {}
  @Input() item: any;
  @Input() queryBy: string;
  @Input() optionHeight = 35;
  @Input() showImg = false;

  @Input() mentionValue = '';
  active = false;

  setActiveStyles(): void {
    if (!this.active) {
      this.active = true;
    }
  }

  setInactiveStyles(): void {
    if (this.active) {
      this.active = false;
    }
  }

  highlightMatchingLetters(itemName) {
    const matchingLetters = new RegExp(`(?<captureGroup>${this.mentionValue})`, 'gi');

    return itemName.replace(matchingLetters, '<strong>$<captureGroup></strong>');
  }
}
