import {
  Component,
  Input,
  Output,
  EventEmitter,
  ViewEncapsulation,
  ChangeDetectionStrategy,
  ViewChildren,
  QueryList,
  Renderer2,
  ElementRef,
  ChangeDetectorRef,
} from '@angular/core';

@Component({
  // eslint-disable-next-line @angular-eslint/component-selector
  selector: 'mdb-treeview',
  exportAs: 'mdbTreeview',
  templateUrl: 'treeview.component.html',
  encapsulation: ViewEncapsulation.None,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class MdbTreeviewComponent {
  @ViewChildren('activeElement') activeElement: QueryList<ElementRef>;

  @Input() nodes: any;
  @Input() textField: string;
  @Input() childrenField: string;
  @Input() checkedField: string;
  @Input() selectable = false;
  @Input() checkboxesField: string;
  @Input() accordion = false;
  @Input() openOnClick = true;
  @Input() line = false;
  @Input() color = 'primary';
  @Input() rotationAngle = '90';

  @Output() selected = new EventEmitter();
  @Output() activeItemChange = new EventEmitter();

  constructor(private _renderer: Renderer2, private _cdRef: ChangeDetectorRef) {}

  expand(id: string): void {
    const node = this._deepFind(id, 'expandId');

    if (!node) {
      return;
    }

    this._expandParentsNode(node[this.textField]);

    node.collapsed = false;

    this._cdRef.markForCheck();
  }

  collapse(): void {
    this._collapseAll(this.nodes);
    this._cdRef.markForCheck();
  }

  _checkboxChange(element: HTMLInputElement, node: any): void {
    node[this.checkedField] = element.checked;
  }

  _handleCheckboxClick(element: HTMLInputElement, isChecked: boolean, node: any): void {
    const isParentField = () => node[this.childrenField];

    const toggleAllDirectChildrenCheckboxes = (actualNode: any, state: boolean): void => {
      actualNode[this.childrenField].forEach((childrenNode) => {
        childrenNode[this.checkedField] = state;
      });
    };

    const toggleAllChildrenCheckboxes = (actualNode: any, state: boolean): void => {
      toggleAllDirectChildrenCheckboxes(actualNode, state);
      actualNode[this.childrenField]?.forEach((childrenNode) => {
        if (childrenNode[this.childrenField]) {
          toggleAllChildrenCheckboxes(childrenNode, state);
        }
      });
    };

    if (isChecked && isParentField()) {
      toggleAllChildrenCheckboxes(node, true);
    }
    if (!isChecked && isParentField()) {
      toggleAllChildrenCheckboxes(node, false);
    }

    node[this.checkedField] = element.checked;

    const iterator = (actualNode: any = this.nodes): void => {
      actualNode.forEach((childrenNode) => {
        if (childrenNode[this.childrenField]) {
          iterator(childrenNode[this.childrenField]);
          let isAllChildrenChecked = childrenNode[this.childrenField].every(
            (sibling) => sibling[this.checkedField] === true
          );

          childrenNode[this.checkedField] = isAllChildrenChecked;
        }
      });
    };
    iterator(this.nodes);
  }

  checkboxSelected(node: any, isChecked: boolean): void {
    if (isChecked) {
      this.selected.emit(node);
    }
  }

  setActive(target: ElementRef, preventClick: boolean): void {
    if (preventClick) {
      return;
    }

    this.activeElement.forEach((element: ElementRef) => {
      this._renderer.removeClass(element.nativeElement, 'active');
    });

    this._renderer.addClass(target, 'active');

    this.activeItemChange.emit(target);
  }

  filter(value: string): void {
    this.collapse();

    const node = this._deepFind(value, 'name');

    if (!node) {
      return;
    }

    this._expandParentsNode(node[this.textField]);

    node.collapsed = false;

    this._cdRef.markForCheck();
  }

  generateUid(): string {
    const uid = Math.random().toString(36).substr(2, 9);
    return `mdb-treeview-${uid}`;
  }

  private _deepFind(value: string, key: string = this.textField): any {
    let result: any;

    const findInNode = (nodes: any[], value: string) => {
      nodes.forEach((node: any) => {
        const includes = node[key]?.toLowerCase().includes(value.toLowerCase());

        if (includes) {
          result = node;
        } else if (node[this.childrenField]) {
          findInNode(node[this.childrenField], value);
        }
      });
    };

    findInNode(this.nodes, value);

    return result;
  }

  private _expandParentsNode(value: string, key: string = this.textField): void {
    const findInNode = (nodes: any, value: string) => {
      nodes.forEach((parentNode: any) => {
        parentNode[this.childrenField]?.forEach((childrenNode: any) => {
          const includes = childrenNode[key]?.toLowerCase().includes(value.toLowerCase());

          if (includes) {
            parentNode.collapsed = false;
          } else if (childrenNode[this.childrenField]) {
            findInNode(parentNode[this.childrenField], value);
          }
        });
      });
    };

    findInNode(this.nodes, value);
  }

  private _collapseAll(nodes: any): void {
    nodes.forEach((node: any) => {
      node.collapsed = true;

      if (node[this.childrenField]) {
        this._collapseAll(node[this.childrenField]);
      }
    });
  }
}
