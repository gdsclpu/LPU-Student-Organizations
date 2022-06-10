import { Component, Provider, Type, ViewChild, ViewChildren, QueryList } from '@angular/core';
import { TestBed, ComponentFixture, inject, fakeAsync, flush, tick } from '@angular/core/testing';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { By } from '@angular/platform-browser';
import { OverlayContainer } from '@angular/cdk/overlay';
import { MdbFormsModule } from 'mdb-angular-ui-kit/forms';
import { MdbOptionComponent } from 'mdb-angular-ui-kit/option';
import { MdbSelectComponent } from './select.component';
import { MdbSelectModule } from './select.module';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import { DOWN_ARROW, END, ESCAPE, HOME, TAB, UP_ARROW } from '@angular/cdk/keycodes';

function createKeyboardEvent(type: string, keyCode: number, modifier?: string): KeyboardEvent {
  const event = new KeyboardEvent(type);

  Object.defineProperty(event, 'keyCode', {
    get: () => keyCode,
  });

  if (modifier === 'alt') {
    Object.defineProperty(event, 'altKey', {
      get: () => true,
    });
  }

  return event;
}

describe('MDB Select', () => {
  let overlayContainer: OverlayContainer;
  let overlayContainerElement: HTMLElement;

  function createComponent<T>(component: Type<T>, providers: Provider[] = []): ComponentFixture<T> {
    TestBed.configureTestingModule({
      imports: [
        MdbSelectModule,
        MdbFormsModule,
        FormsModule,
        ReactiveFormsModule,
        NoopAnimationsModule,
      ],
      declarations: [component],
      providers: [...providers],
      teardown: { destroyAfterEach: false },
    });

    TestBed.compileComponents();

    inject([OverlayContainer], (oc: OverlayContainer) => {
      overlayContainer = oc;
      overlayContainerElement = oc.getContainerElement();
    })();

    return TestBed.createComponent<T>(component);
  }

  afterEach(inject([OverlayContainer], (currentOverlayContainer: OverlayContainer) => {
    currentOverlayContainer.ngOnDestroy();
    overlayContainer.ngOnDestroy();
  }));

  describe('Dropdown opening and closing', () => {
    let fixture: ComponentFixture<BasicSelect>;
    let input: HTMLElement;
    let select: MdbSelectComponent;

    beforeEach(() => {
      fixture = createComponent(BasicSelect);
      fixture.detectChanges();
      select = fixture.componentInstance.select;
      input = fixture.debugElement.query(By.css('input')).nativeElement;
    });

    it('should toggle the dropdown on input click', fakeAsync(() => {
      input.click();
      fixture.detectChanges();
      flush();
      expect(select._isOpen).toBe(true);
      expect(overlayContainerElement.textContent).toContain('One');

      input.click();
      fixture.detectChanges();
      flush();
      expect(select._isOpen).toBe(false);
      expect(overlayContainerElement.textContent).toEqual('');
    }));

    it('should open the dropdown when alt + down arrow key is pressed', fakeAsync(() => {
      const event = createKeyboardEvent('keydown', DOWN_ARROW, 'alt');
      const selectEl = document.querySelector('mdb-select') as HTMLElement;
      selectEl.dispatchEvent(event);
      fixture.detectChanges();
      flush();

      expect(select._isOpen).toBe(true);
    }));

    it('should open the dropdown programatically', () => {
      expect(select._isOpen).toBe(false);
      select.open();
      fixture.detectChanges();

      expect(select._isOpen).toBe(true);
    });

    it('should close the dropdown programatically', () => {
      select.open();
      fixture.detectChanges();
      expect(select._isOpen).toBe(true);

      select.close();
      fixture.detectChanges();
      expect(select._isOpen).toBe(false);
    });

    it('should close the dropdown when escape key is pressed', fakeAsync(() => {
      input.click();
      fixture.detectChanges();
      flush();
      expect(select._isOpen).toBe(true);

      const escapeEvent = createKeyboardEvent('keydown', 27);
      const dropdown = document.querySelector('.select-dropdown-container') as HTMLElement;
      dropdown.dispatchEvent(escapeEvent);
      fixture.detectChanges();
      flush();

      expect(select._isOpen).toBe(false);
      expect(overlayContainerElement.textContent).toEqual('');
    }));

    it('should close the dropdown when arrow up key is pressed', fakeAsync(() => {
      input.click();
      fixture.detectChanges();
      flush();
      expect(select._isOpen).toBe(true);

      const event = createKeyboardEvent('keydown', UP_ARROW, 'alt');
      const dropdown = document.querySelector('.select-dropdown-container') as HTMLElement;
      dropdown.dispatchEvent(event);
      fixture.detectChanges();
      flush();

      expect(select._isOpen).toBe(false);
      expect(overlayContainerElement.textContent).toEqual('');
    }));

    it('should close the dropdown when clicking outside the component', () => {
      select.open();
      fixture.detectChanges();

      const event = new MouseEvent('click');
      document.dispatchEvent(event);
      fixture.detectChanges();

      expect(select._isOpen).toBe(false);
    });

    // it('should close the dropdown when tabbing away from the input', fakeAsync(() => {
    //   select.open();
    //   fixture.detectChanges();
    //   flush();
    //   expect(select._isOpen).toBe(true);

    //   const tabEvent = createKeyboardEvent('keydown', TAB);
    //   const selectEl = document.querySelector('mdb-select') as HTMLElement;
    //   selectEl.dispatchEvent(tabEvent);
    //   fixture.detectChanges();
    //   flush();

    //   expect(select._isOpen).toBe(false);
    //   expect(overlayContainerElement.textContent).toEqual('');
    // }));

    it('should close the dropdown when single option is clicked', () => {
      select.open();
      fixture.detectChanges();

      const option = overlayContainerElement.querySelector('mdb-option') as HTMLElement;
      option.click();
      fixture.detectChanges();

      expect(select._isOpen).toBe(false);
    });
  });

  describe('Selection', () => {
    let fixture: ComponentFixture<BasicSelect>;
    let input: HTMLElement;
    let select: MdbSelectComponent;

    beforeEach(() => {
      fixture = createComponent(BasicSelect);
      fixture.detectChanges();
      select = fixture.componentInstance.select;
      input = fixture.debugElement.query(By.css('input')).nativeElement;
    });

    it('should select option when its clicked', fakeAsync(() => {
      select.open();
      fixture.detectChanges();
      flush();

      let option = overlayContainerElement.querySelector('mdb-option') as HTMLElement;

      option.click();
      fixture.detectChanges();
      flush();

      select.open();
      fixture.detectChanges();
      flush();

      option = overlayContainerElement.querySelector('mdb-option') as HTMLElement;

      expect(option.classList).toContain('selected');
      expect(fixture.componentInstance.options.first.selected).toBe(true);
    }));

    it('should not select disabled option', fakeAsync(() => {
      select.open();
      fixture.detectChanges();
      flush();

      let options = overlayContainerElement.querySelectorAll(
        'mdb-option'
      ) as NodeListOf<HTMLElement>;

      options[3].click();
      fixture.detectChanges();
      flush();

      select.open();
      fixture.detectChanges();
      flush();

      options = overlayContainerElement.querySelectorAll('mdb-option') as NodeListOf<HTMLElement>;

      expect(options[3].classList).not.toContain('selected');
      const optionInstances = fixture.componentInstance.options.toArray();
      expect(optionInstances[3].selected).toBe(false);
    }));

    it('should deselect other options on option click in single mode', fakeAsync(() => {
      select.open();
      fixture.detectChanges();
      flush();

      let options = overlayContainerElement.querySelectorAll(
        'mdb-option'
      ) as NodeListOf<HTMLElement>;

      options[1].click();
      fixture.detectChanges();

      expect(options[1].classList).toContain('selected');

      options[0].click();
      fixture.detectChanges();
      flush();

      select.open();
      fixture.detectChanges();
      flush();

      options = overlayContainerElement.querySelectorAll('mdb-option') as NodeListOf<HTMLElement>;
      expect(options[1].classList).not.toContain('selected');

      const optionInstances = fixture.componentInstance.options.toArray();
      expect(optionInstances[1].selected).toBe(false);
    }));

    it('should display selected option in input', fakeAsync(() => {
      select.open();
      fixture.detectChanges();
      flush();

      const option = overlayContainerElement.querySelector('mdb-option') as HTMLElement;
      const selectInput = document.querySelector('.select-input') as HTMLInputElement;

      option.click();
      fixture.detectChanges();
      flush();

      expect(selectInput.value).toBe(' One ');
    }));
  });

  describe('Keyboard navigation', () => {
    let fixture: ComponentFixture<BasicSelect>;
    let input: HTMLElement;
    let select: MdbSelectComponent;

    beforeEach(() => {
      fixture = createComponent(BasicSelect);
      fixture.detectChanges();
      select = fixture.componentInstance.select;
      input = fixture.debugElement.query(By.css('input')).nativeElement;
    });

    it('should highlight next option when down arrow key is pressed', fakeAsync(() => {
      select.open();
      fixture.detectChanges();
      flush();

      const options = overlayContainerElement.querySelectorAll(
        'mdb-option'
      ) as NodeListOf<HTMLElement>;

      const optionInstances = fixture.componentInstance.options.toArray();

      expect(optionInstances[0].active).toBe(true);
      expect(options[0].classList).toContain('active');

      const event = createKeyboardEvent('keydown', DOWN_ARROW);
      const dropdown = document.querySelector('.select-dropdown-container');
      dropdown.dispatchEvent(event);

      fixture.detectChanges();

      expect(optionInstances[1].active).toBe(true);
      expect(options[1].classList).toContain('active');
    }));

    it('should highlight previous option when up arrow key is pressed', fakeAsync(() => {
      select.open();
      fixture.detectChanges();
      flush();

      const options = overlayContainerElement.querySelectorAll(
        'mdb-option'
      ) as NodeListOf<HTMLElement>;
      const optionInstances = fixture.componentInstance.options.toArray();
      const dropdown = document.querySelector('.select-dropdown-container');

      const downArrowEvent = createKeyboardEvent('keydown', DOWN_ARROW);
      const upArrowEvent = createKeyboardEvent('keydown', UP_ARROW);
      dropdown.dispatchEvent(downArrowEvent);

      fixture.detectChanges();

      expect(optionInstances[1].active).toBe(true);
      expect(options[1].classList).toContain('active');

      dropdown.dispatchEvent(upArrowEvent);
      fixture.detectChanges();

      expect(optionInstances[0].active).toBe(true);
      expect(options[0].classList).toContain('active');
    }));

    it('should highlight first option when home key is pressed', fakeAsync(() => {
      select.open();
      fixture.detectChanges();
      flush();

      const options = overlayContainerElement.querySelectorAll(
        'mdb-option'
      ) as NodeListOf<HTMLElement>;
      const optionInstances = fixture.componentInstance.options.toArray();
      const dropdown = document.querySelector('.select-dropdown-container');

      const downArrowEvent = createKeyboardEvent('keydown', DOWN_ARROW);
      const homeEvent = createKeyboardEvent('keydown', HOME);
      dropdown.dispatchEvent(downArrowEvent);
      dropdown.dispatchEvent(downArrowEvent);

      fixture.detectChanges();

      expect(optionInstances[2].active).toBe(true);
      expect(options[2].classList).toContain('active');

      dropdown.dispatchEvent(homeEvent);
      fixture.detectChanges();

      expect(optionInstances[0].active).toBe(true);
      expect(options[0].classList).toContain('active');
    }));

    it('should highlight last option when end key is pressed', fakeAsync(() => {
      select.open();
      fixture.detectChanges();
      flush();

      const options = overlayContainerElement.querySelectorAll(
        'mdb-option'
      ) as NodeListOf<HTMLElement>;
      const optionInstances = fixture.componentInstance.options.toArray();
      const dropdown = document.querySelector('.select-dropdown-container');

      const endEvent = createKeyboardEvent('keydown', END);

      dropdown.dispatchEvent(endEvent);
      fixture.detectChanges();

      expect(optionInstances[5].active).toBe(true);
      expect(options[5].classList).toContain('active');
    }));
  });

  describe('Filter', () => {
    let fixture: ComponentFixture<BasicSelect>;
    let input: HTMLElement;
    let select: MdbSelectComponent;

    beforeEach(() => {
      fixture = createComponent(BasicSelect);
      fixture.detectChanges();
      select = fixture.componentInstance.select;
      input = fixture.debugElement.query(By.css('input')).nativeElement;
    });

    it('should properly allow to navigate by keyboard after filtering', fakeAsync(() => {
      fixture.componentInstance.filter = true;
      fixture.detectChanges();

      select.open();
      fixture.detectChanges();
      flush();

      const options = overlayContainerElement.querySelectorAll(
        'mdb-option'
      ) as NodeListOf<HTMLElement>;

      const optionInstances = fixture.componentInstance.options.toArray();

      expect(optionInstances[0].active).toBe(true);
      expect(options[0].classList).toContain('active');

      const searchEl = document.querySelector('.select-filter-input') as HTMLInputElement;
      const eventInput = new Event('input');
      searchEl.value = 's';
      searchEl.dispatchEvent(eventInput);

      tick(300);
      fixture.detectChanges();

      expect(optionInstances[5].active).toBe(false);
      expect(options[5].classList).not.toContain('active');

      const dropdown = document.querySelector('.select-dropdown-container');
      const downArrowEvent = createKeyboardEvent('keydown', DOWN_ARROW);
      dropdown.dispatchEvent(downArrowEvent);
      fixture.detectChanges();

      expect(optionInstances[5].active).toBe(true);
      expect(options[5].classList).toContain('active');

      select.close();
      fixture.detectChanges();
      flush();

      select.open();
      fixture.detectChanges();
      flush();

      dropdown.dispatchEvent(downArrowEvent);
      fixture.detectChanges();

      expect(optionInstances[5].active).toBe(false);
      expect(options[5].classList).not.toContain('active');
      expect(optionInstances[1].active).toBe(true);
      expect(options[1].classList).toContain('active');
    }));
  });
});

@Component({
  selector: 'mdb-basic-select',
  template: `
    <mdb-form-control>
      <mdb-select [filter]="filter">
        <mdb-option
          *ngFor="let number of numbers"
          [value]="number.value"
          [disabled]="number.disabled"
        >
          {{ number.label }}
        </mdb-option>
      </mdb-select>
    </mdb-form-control>
  `,
})
// eslint-disable-next-line @angular-eslint/component-class-suffix
class BasicSelect {
  numbers: any[] = [
    { value: 'one', label: 'One', disabled: false },
    { value: 'two', label: 'Two', disabled: false },
    { value: 'three', label: 'Three', disabled: false },
    { value: 'four', label: 'Four', disabled: true },
    { value: 'five', label: 'Five', disabled: false },
    { value: 'six', label: 'Six', disabled: false },
  ];

  filter = false;
  @ViewChild(MdbSelectComponent, { static: true }) select: MdbSelectComponent;
  @ViewChildren(MdbOptionComponent) options: QueryList<MdbOptionComponent>;
}
