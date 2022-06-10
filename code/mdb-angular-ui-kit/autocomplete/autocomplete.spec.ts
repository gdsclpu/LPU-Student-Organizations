import {
  Component,
  OnInit,
  Provider,
  Type,
  ViewChild,
  ViewChildren,
  QueryList,
} from '@angular/core';
import { Subject, Observable } from 'rxjs';
import { startWith, map, tap } from 'rxjs/operators';
import { TestBed, ComponentFixture, inject, fakeAsync, flush } from '@angular/core/testing';
import { MdbAutocompleteModule } from './autocomplete.module';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { By } from '@angular/platform-browser';
import { OverlayContainer } from '@angular/cdk/overlay';
import { MdbAutocompleteDirective } from './autocomplete.directive';
import { MdbFormsModule } from 'mdb-angular-ui-kit/forms';
import { DOWN_ARROW, ESCAPE, UP_ARROW, TAB, HOME, END } from '@angular/cdk/keycodes';
import { MdbOptionComponent } from 'mdb-angular-ui-kit/option';
import { Browser } from 'protractor';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';

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

@Component({
  template: `
    <div class="md-form">
      <input
        type="text"
        class="completer-input form-control mdb-autocomplete"
        [ngModel]="searchText | async"
        (ngModelChange)="searchText.next($event)"
        [mdbAutocomplete]="auto"
        mdbInput
      />
      <label>Example label</label>
      <mdb-autocomplete #auto="mdbAutocomplete">
        <mdb-option *ngFor="let option of results | async" [value]="option">
          {{ option }}
        </mdb-option>
      </mdb-autocomplete>
    </div>
  `,
})
class BasicAutocompleteComponent implements OnInit {
  @ViewChild(MdbAutocompleteDirective, { static: true }) trigger: MdbAutocompleteDirective;
  @ViewChildren(MdbOptionComponent) options: QueryList<MdbOptionComponent>;
  searchText = new Subject();
  searchVal: string;
  results: Observable<string[]>;
  data: string[] = ['Red', 'Green', 'Blue', 'Cyan', 'Magenta', 'Yellow', 'Black'];

  ngOnInit() {
    this.results = this.searchText.pipe(
      startWith(''),
      tap((value: string) => {
        this.searchVal = value;
      }),
      map((value: string) => this.filter(value))
    );
  }

  filter(value: string): string[] {
    const filterValue = value.toLowerCase();
    return this.data.filter((item: string) => item.toLowerCase().includes(filterValue));
  }
}

describe('MdbAutocomplete', () => {
  let overlayContainer: OverlayContainer;
  let overlayContainerElement: HTMLElement;

  function createComponent<T>(component: Type<T>, providers: Provider[] = []) {
    TestBed.configureTestingModule({
      imports: [
        MdbAutocompleteModule,
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
    let fixture: ComponentFixture<BasicAutocompleteComponent>;
    let input: HTMLElement;

    beforeEach(() => {
      fixture = createComponent(BasicAutocompleteComponent);
      fixture.detectChanges();
      input = fixture.debugElement.query(By.css('input')).nativeElement;
    });

    it('should open the dropdown on input focus', fakeAsync(() => {
      expect(fixture.componentInstance.trigger._isDropdownOpen).toBe(false);
      input.focus();
      fixture.detectChanges();
      flush();

      expect(fixture.componentInstance.trigger._isDropdownOpen).toBe(true);
      expect(overlayContainerElement.textContent).toContain('Red');
      expect(overlayContainerElement.textContent).toContain('Green');
    }));

    it('should open the dropdown when pressing alt and down arrow', fakeAsync(() => {
      expect(fixture.componentInstance.trigger._isDropdownOpen).toBe(false);
      const event = createKeyboardEvent('keydown', DOWN_ARROW, 'alt');
      input.dispatchEvent(event);
      fixture.detectChanges();
      flush();

      expect(fixture.componentInstance.trigger._isDropdownOpen).toBe(true);
      expect(overlayContainerElement.textContent).toContain('Red');
      expect(overlayContainerElement.textContent).toContain('Green');
    }));

    it('should open the dropdown programatically', fakeAsync(() => {
      expect(fixture.componentInstance.trigger._isDropdownOpen).toBe(false);
      fixture.componentInstance.trigger.open();
      fixture.detectChanges();
      flush();

      expect(fixture.componentInstance.trigger._isDropdownOpen).toBe(true);
      expect(overlayContainerElement.textContent).toContain('Red');
      expect(overlayContainerElement.textContent).toContain('Green');
    }));

    it('should close the dropdown programatically', fakeAsync(() => {
      fixture.componentInstance.trigger.open();
      fixture.detectChanges();
      flush();
      expect(fixture.componentInstance.trigger._isDropdownOpen).toBe(true);

      fixture.componentInstance.trigger.close();
      fixture.detectChanges();
      flush();

      expect(fixture.componentInstance.trigger._isDropdownOpen).toBe(false);
      expect(overlayContainerElement.textContent).toEqual('');
    }));

    it('should close the dropdown when pressing escape', fakeAsync(() => {
      fixture.componentInstance.trigger.open();
      fixture.detectChanges();
      flush();
      expect(fixture.componentInstance.trigger._isDropdownOpen).toBe(true);

      const event = createKeyboardEvent('keydown', ESCAPE);
      document.body.dispatchEvent(event);
      fixture.detectChanges();
      flush();

      expect(fixture.componentInstance.trigger._isDropdownOpen).toBe(false);
      expect(overlayContainerElement.textContent).toEqual('');
    }));

    it('should close the dropdown when pressing alt and up arrow', fakeAsync(() => {
      fixture.componentInstance.trigger.open();
      fixture.detectChanges();
      flush();
      expect(fixture.componentInstance.trigger._isDropdownOpen).toBe(true);

      const event = createKeyboardEvent('keydown', UP_ARROW, 'alt');

      document.body.dispatchEvent(event);
      fixture.detectChanges();
      flush();

      expect(fixture.componentInstance.trigger._isDropdownOpen).toBe(false);
      expect(overlayContainerElement.textContent).toEqual('');
    }));

    it('should close the dropdown when clicking outside the component', fakeAsync(() => {
      fixture.componentInstance.trigger.open();
      fixture.detectChanges();
      flush();
      expect(fixture.componentInstance.trigger._isDropdownOpen).toBe(true);

      const clickEvent = new Event('click');
      document.dispatchEvent(clickEvent);
      fixture.detectChanges();
      flush();

      expect(fixture.componentInstance.trigger._isDropdownOpen).toBe(false);
      expect(overlayContainerElement.textContent).toEqual('');
    }));

    it('should close the dropdown when tabbing away from the input', fakeAsync(() => {
      fixture.componentInstance.trigger.open();
      fixture.detectChanges();
      flush();
      expect(fixture.componentInstance.trigger._isDropdownOpen).toBe(true);

      const tabEvent = createKeyboardEvent('keydown', TAB);
      fixture.componentInstance.trigger.onKeydown(tabEvent);
      fixture.detectChanges();
      flush();

      expect(fixture.componentInstance.trigger._isDropdownOpen).toBe(false);
      expect(overlayContainerElement.textContent).toEqual('');
    }));

    it('should close the dropdown when an option is clicked', fakeAsync(() => {
      fixture.componentInstance.trigger.open();
      fixture.detectChanges();
      flush();
      expect(fixture.componentInstance.trigger._isDropdownOpen).toBe(true);

      const option = overlayContainerElement.querySelector('mdb-option') as HTMLElement;
      option.click();
      fixture.detectChanges();
      flush();

      expect(fixture.componentInstance.trigger._isDropdownOpen).toBe(false);
      expect(overlayContainerElement.textContent).toEqual('');
    }));

    it('should not close the dropdown on input click', fakeAsync(() => {
      fixture.componentInstance.trigger.open();
      fixture.detectChanges();
      flush();
      expect(fixture.componentInstance.trigger._isDropdownOpen).toBe(true);

      input.click();
      fixture.detectChanges();
      flush();

      expect(fixture.componentInstance.trigger._isDropdownOpen).toBe(true);
      expect(overlayContainerElement.textContent).toContain('Red');
      expect(overlayContainerElement.textContent).toContain('Green');
    }));
  });

  describe('Option selection', () => {
    let fixture: ComponentFixture<BasicAutocompleteComponent>;

    beforeEach(() => {
      fixture = createComponent(BasicAutocompleteComponent);
      fixture.detectChanges();
    });

    it('should select clicked option', fakeAsync(() => {
      fixture.componentInstance.trigger.open();
      fixture.detectChanges();
      flush();

      const options = fixture.componentInstance.options.toArray();
      const optionsList = overlayContainerElement.querySelectorAll(
        'mdb-option'
      ) as NodeListOf<HTMLElement>;
      optionsList[0].click();
      fixture.detectChanges();
      flush();

      expect(options[0].selected).toBe(true);
    }));
  });

  // describe('Integration with forms', () => {
  //   let fixture: ComponentFixture<BasicAutocompleteComponent>;
  //   let input: HTMLElement;

  //   beforeEach(() => {
  //     fixture = createComponent(BasicAutocompleteComponent);
  //     fixture.detectChanges();
  //     input = fixture.debugElement.query(By.css('input')).nativeElement;
  //   });

  //   it('should update form control value when user types', () => {
  //     typeInElement(input, 'r');
  //     fixture.detectChanges();

  //     expect(fixture.componentInstance.searchVal).toEqual('r');

  //     typeInElement(input, 'ed');
  //     fixture.detectChanges();

  //     expect(fixture.componentInstance.searchVal).toEqual('red');
  //   });

  //   it('should update form control if user select option', () => {
  //     fixture.componentInstance.trigger.open();
  //     fixture.detectChanges();
  //     const option = overlayContainerElement.querySelector('mdb-option') as HTMLElement;

  //     option.click();
  //     fixture.detectChanges();

  //     expect(fixture.componentInstance.searchVal).toEqual('Red');
  //   });
  // });

  describe('Keyboard navigation', () => {
    let fixture: ComponentFixture<BasicAutocompleteComponent>;
    let downArrowEvent: KeyboardEvent;
    let upArrowEvent: KeyboardEvent;
    let homeEvent: KeyboardEvent;
    let endEvent: KeyboardEvent;

    beforeEach(() => {
      fixture = createComponent(BasicAutocompleteComponent);
      fixture.detectChanges();

      downArrowEvent = createKeyboardEvent('keydown', DOWN_ARROW);
      upArrowEvent = createKeyboardEvent('keydown', UP_ARROW);
      homeEvent = createKeyboardEvent('keydown', HOME);
      endEvent = createKeyboardEvent('keydown', END);
    });

    it('should highlight next option when pressing down arrow', fakeAsync(() => {
      fixture.componentInstance.trigger.open();
      fixture.detectChanges();
      flush();
      const options = fixture.componentInstance.options.toArray();
      fixture.detectChanges();

      expect(options[0].active).toBe(true);

      fixture.componentInstance.trigger.onKeydown(downArrowEvent);
      fixture.detectChanges();
      flush();

      expect(options[0].active).toBe(false);
      // expect(options[1].active).toBe(true);
    }));

    it('should highlight previous option when pressing up arrow', fakeAsync(() => {
      fixture.componentInstance.trigger.open();
      fixture.detectChanges();
      flush();
      const options = fixture.componentInstance.options.toArray();
      fixture.detectChanges();

      expect(options[0].active).toBe(true);

      fixture.componentInstance.trigger.onKeydown(downArrowEvent);
      fixture.componentInstance.trigger.onKeydown(upArrowEvent);
      fixture.detectChanges();
      flush();

      expect(options[0].active).toBe(true);
    }));

    it('should highlight first option when pressing home', fakeAsync(() => {
      fixture.componentInstance.trigger.open();
      fixture.detectChanges();
      flush();
      const options = fixture.componentInstance.options.toArray();
      fixture.detectChanges();

      fixture.componentInstance.trigger.onKeydown(downArrowEvent);
      expect(options[1].active).toBe(true);

      fixture.componentInstance.trigger.onKeydown(homeEvent);
      fixture.detectChanges();
      flush();

      expect(options[0].active).toBe(true);
    }));

    it('should highlight last option when pressing down arrow', fakeAsync(() => {
      fixture.componentInstance.trigger.open();
      fixture.detectChanges();
      flush();
      const options = fixture.componentInstance.options.toArray();
      fixture.detectChanges();

      expect(options[0].active).toBe(true);

      fixture.componentInstance.trigger.onKeydown(endEvent);
      fixture.detectChanges();
      flush();

      expect(options[options.length - 1].active).toBe(true);
    }));
  });
});
