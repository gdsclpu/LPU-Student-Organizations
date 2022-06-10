import { Component, Provider, Type } from '@angular/core';
import { ComponentFixture, fakeAsync, flush, inject, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import { MdbMentionDirective } from './mention.directive';
import { MdbMentionModule } from './mention.module';
import { MdbFormsModule } from '../../../mdb-angular-ui-kit/forms/forms.module';
import { OverlayContainer } from '@angular/cdk/overlay';

describe('MDB Mention', () => {
  let overlayContainer: OverlayContainer;
  let overlayContainerElement: HTMLElement;

  function createComponent<T>(component: Type<T>, providers: Provider[] = []): ComponentFixture<T> {
    TestBed.configureTestingModule({
      imports: [MdbMentionModule, NoopAnimationsModule, MdbFormsModule],
      declarations: [TestMentionComponent],
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

  describe('after init', () => {
    let fixture: ComponentFixture<TestMentionComponent>;
    let element: HTMLElement;
    let component: TestMentionComponent;
    let directive: MdbMentionDirective;

    beforeEach(async () => {
      fixture = createComponent(TestMentionComponent);
      component = fixture.componentInstance;
      element = fixture.nativeElement;
      fixture.detectChanges();

      directive = fixture.debugElement
        .query(By.directive(MdbMentionDirective))
        .injector.get(MdbMentionDirective) as MdbMentionDirective;
      jest.spyOn(directive, 'open');
      jest.spyOn(directive, 'close');
    });

    it('should create the component', () => {
      expect(component).toBeTruthy();
    });

    it('should open and close using public methods', fakeAsync(() => {
      const inputEl = document.querySelector('input');

      inputEl.value = '@';
      inputEl.dispatchEvent(new MouseEvent('click'));
      fixture.detectChanges();

      expect(directive.open).toHaveBeenCalled();
      document.dispatchEvent(new MouseEvent('click', { screenX: 1, screenY: 1 }));
      fixture.detectChanges();
      flush();
      expect(directive.close).toHaveBeenCalled();
      expect(overlayContainerElement.textContent).toEqual('');
    }));

    it('should open dropdown on click next to trigger with overlay containing proper items', fakeAsync(() => {
      const inputEl = document.querySelector('input');

      inputEl.value = '@becky';
      inputEl.dispatchEvent(new MouseEvent('click'));

      fixture.detectChanges();
      flush();

      expect(directive.open).toHaveBeenCalled();
      expect(overlayContainerElement.textContent).toEqual('becky');
    }));

    it('shouldnt open dropdown on click next to trigger if showListOnTrigger is set to false', () => {
      component.testShowListOnTrigger = false;
      fixture.detectChanges();

      const inputEl = document.querySelector('input');

      inputEl.value = '@';
      inputEl.dispatchEvent(new MouseEvent('click'));
      fixture.detectChanges();

      let listEl = document.querySelector('.mention-items-list');
      expect(listEl).toBeFalsy();
      expect(overlayContainerElement.textContent).toEqual('');
    });

    it('should open dropdown on keydown and close on esc key', fakeAsync(() => {
      const arrowRightEvent = createKeyboardEvent('keydown', 39, 'ArrowRight');
      const inputEl = document.querySelector('input');
      inputEl.value = '@';
      inputEl.focus();
      inputEl.dispatchEvent(arrowRightEvent);

      fixture.detectChanges();
      flush();

      expect(directive.open).toHaveBeenCalled();

      let listEl = document.querySelector('.mention-items-list');
      expect(listEl).toBeTruthy();

      const escapeEvent = createKeyboardEvent('keydown', 27, 'Escape');
      inputEl.dispatchEvent(escapeEvent);

      fixture.detectChanges();
      flush();

      expect(directive.close).toHaveBeenCalled();

      listEl = document.querySelector('.mention-items-list');
      expect(listEl).toBeFalsy();
      expect(overlayContainerElement.textContent).toEqual('');
    }));

    it('should open when clicking on mention string', () => {
      const inputEl = document.querySelector('input');

      inputEl.value = '@maximus l';
      inputEl.selectionStart = inputEl.value.length - 1;
      inputEl.dispatchEvent(new MouseEvent('click'));
      fixture.detectChanges();
      let listEl = document.querySelector('.mention-items-list');
      expect(listEl).toBeFalsy();

      inputEl.selectionStart = inputEl.value.length - 4;
      inputEl.dispatchEvent(new MouseEvent('click'));
      fixture.detectChanges();
      listEl = document.querySelector('.mention-items-list');

      expect(listEl).toBeTruthy();
      let firstListElementContent = document.querySelector('.mention-item').textContent.trim();

      expect(firstListElementContent).toEqual('maximus');
    });

    it('should display data by queryBy property', () => {
      const inputEl = document.querySelector('input');
      component.testQueryBy = 'name';

      inputEl.value = '@';
      inputEl.dispatchEvent(new MouseEvent('click'));
      fixture.detectChanges();
      let listEl = document.querySelector('.mention-items-list');
      let firstListElementContent = document.querySelector('.mention-item').textContent.trim();
      expect(listEl).toBeTruthy();
      expect(firstListElementContent).toEqual('Max');
    });

    it('should display data by outputKey property', () => {
      const inputEl = document.querySelector('input');
      component.testQueryBy = 'name';
      component.testOutputKey = 'username';

      inputEl.value = '@';
      inputEl.dispatchEvent(new MouseEvent('click'));
      fixture.detectChanges();
      let listEl = document.querySelector('.mention-items-list');
      let firstListElement = document.querySelector('.mention-item');
      let firstMentionItem = document.querySelector('mention-item');
      let firstListElementContent = firstListElement.textContent.trim();
      expect(listEl).toBeTruthy();
      expect(firstListElementContent).toEqual('Max');
      firstMentionItem.dispatchEvent(new MouseEvent('click'));
      fixture.detectChanges();
      expect(inputEl.value).toEqual('@maximus ');
    });

    it('should display images when showImg is set to true and images are provided', () => {
      const inputEl = document.querySelector('input');
      component.testShowImg = true;
      component.testItems = [
        {
          name: 'Max',
          username: 'maximus',
          image: 'https://mdbcdn.b-cdn.net/img/Photos/Others/images/43.webp',
        },
        {
          name: 'Andrew',
          username: 'andrew00',
          image: 'https://mdbcdn.b-cdn.net/img/Photos/Others/images/43.webp',
        },
        { name: 'Rebecca', username: 'becky', image: '' },
        { name: 'Thomas', username: 'tommy16', image: '' },
        { name: 'Alexander', username: 'xander', image: '' },
        { name: 'Jessica', username: 'jessyJ12', image: '' },
      ];
      inputEl.value = '@';
      fixture.detectChanges();

      inputEl.dispatchEvent(new MouseEvent('click'));

      let listEl = document.querySelector('.mention-items-list');
      let firstListElementImage = document.querySelector('.mention-item-image');
      let thirdListElementImage = document.querySelectorAll('.mention-item-image')[2];
      expect(listEl).toBeTruthy();
      expect(firstListElementImage).toBeTruthy();
      expect(thirdListElementImage).toBeFalsy();
    });

    it('shouldnt display images when showImg is set to false and images are provided', () => {
      const inputEl = document.querySelector('input');
      component.testShowImg = false;
      component.testItems = [
        {
          name: 'Max',
          username: 'maximus',
          image: 'https://mdbcdn.b-cdn.net/img/Photos/Others/images/43.webp',
        },
        {
          name: 'Andrew',
          username: 'andrew00',
          image: 'https://mdbcdn.b-cdn.net/img/Photos/Others/images/43.webp',
        },
        { name: 'Rebecca', username: 'becky', image: '' },
        { name: 'Thomas', username: 'tommy16', image: '' },
        { name: 'Alexander', username: 'xander', image: '' },
        { name: 'Jessica', username: 'jessyJ12', image: '' },
      ];
      inputEl.value = '@';
      fixture.detectChanges();

      inputEl.dispatchEvent(new MouseEvent('click'));

      let listEl = document.querySelector('.mention-items-list');
      let firstListElementImage = document.querySelector('.mention-item-image');
      let thirdListElementImage = document.querySelectorAll('.mention-item-image')[2];
      expect(listEl).toBeTruthy();
      expect(firstListElementImage).toBeFalsy();
      expect(thirdListElementImage).toBeFalsy();
    });

    it('should display as much items as it is stated in visibleItems input', () => {
      const inputEl = document.querySelector('input');
      component.testVisibleItems = 2;

      inputEl.value = '@';
      inputEl.dispatchEvent(new MouseEvent('click'));
      fixture.detectChanges();
      let listEl = document.querySelector('.mention-items-list') as HTMLElement;
      expect(listEl).toBeTruthy();
      expect(listEl.style['max-height']).toEqual('70px');

      component.testVisibleItems = 4;

      inputEl.value = '@';
      inputEl.dispatchEvent(new MouseEvent('click'));
      fixture.detectChanges();
      listEl = document.querySelector('.mention-items-list') as HTMLElement;
      expect(listEl).toBeTruthy();
      expect(listEl.style['max-height']).toEqual('140px');
    });

    it('should respect multiple lists and multiple triggers', () => {
      component.testTrigger = ['@', '#', '$', '%'];
      component.testDisableFilter = true;
      fixture.detectChanges();
      const inputEl = document.querySelector('input');
      inputEl.value = '#';
      inputEl.focus();
      inputEl.dispatchEvent(new MouseEvent('click'));
      fixture.detectChanges();

      let listEl = document.querySelector('.mention-items-list');
      let firstListElementContent = document.querySelector('.mention-item').textContent.trim();
      expect(listEl).toBeTruthy();
      expect(firstListElementContent).toEqual('fish');
      expect(component.testQueryBy).toEqual('productName');

      inputEl.value = '$';
      inputEl.focus();
      inputEl.dispatchEvent(new MouseEvent('click'));
      fixture.detectChanges();

      listEl = document.querySelector('.mention-items-list');
      firstListElementContent = document.querySelector('.mention-item').textContent.trim();
      expect(listEl).toBeTruthy();
      expect(firstListElementContent).toEqual('1234');
      expect(component.testQueryBy).toEqual('id');

      inputEl.value = '%';
      inputEl.focus();
      inputEl.dispatchEvent(new MouseEvent('click'));
      fixture.detectChanges();

      listEl = document.querySelector('.mention-items-list');
      firstListElementContent = document.querySelector('.mention-item').textContent.trim();
      expect(listEl).toBeTruthy();
      expect(firstListElementContent).toEqual('Warsaw');
      expect(component.testQueryBy).toEqual('city');
    });

    it('should show no results when filtering is disabled', () => {
      const noResultText = 'No results found';
      component.testDisableFilter = true;
      component.testNoResultText = noResultText;
      fixture.detectChanges();
      const inputEl = document.querySelector('input');
      inputEl.value = '@';
      inputEl.focus();
      inputEl.dispatchEvent(new MouseEvent('click'));
      fixture.detectChanges();

      let listEl = document.querySelector('.mention-items-list');
      expect(listEl).toBeTruthy();
      let firstListElementContent = document.querySelector('.mention-result').textContent.trim();
      expect(firstListElementContent).toEqual(noResultText);
      expect(overlayContainerElement.textContent).toEqual(' No results found ');
    });

    it('should correctly filter items when user is typing', fakeAsync(() => {
      let inputEl = document.querySelector('input');
      inputEl.value = '@';
      inputEl.focus();
      inputEl.dispatchEvent(new MouseEvent('click'));

      fixture.detectChanges();
      flush();

      let listEl = document.querySelector('.mention-items-list');
      expect(listEl).toBeTruthy();

      inputEl.value = '@m';
      inputEl.focus();
      inputEl.dispatchEvent(new MouseEvent('click'));

      fixture.detectChanges();
      flush();
      listEl = document.querySelector('.mention-items-list');
      expect(listEl).toBeTruthy();
      expect(overlayContainerElement.textContent).toBeTruthy();
      expect(overlayContainerElement.textContent.startsWith('maximus')).toBeTruthy();
      expect(overlayContainerElement.textContent.endsWith('tommy16')).toBeTruthy();
    }));
  });
});

@Component({
  // eslint-disable-next-line @angular-eslint/component-selector
  selector: 'mdb-test-mention',
  template: `
    <mdb-form-control>
      <input
        mdbInput
        [showListOnTrigger]="testShowListOnTrigger"
        [outputKey]="testOutputKey"
        [showImg]="testShowImg"
        [disableFilter]="testDisableFilter"
        (mentionChange)="onTriggerChange($event)"
        mdbMention
        [visibleItems]="testVisibleItems"
        [noResultText]="testNoResultText"
        [queryBy]="testQueryBy"
        [placement]="testPosition"
        [trigger]="testTrigger"
        type="text"
        id="form1"
        class="form-control"
        [items]="testItems"
      />
      <label mdbLabel class="form-label" for="form1">Example label</label>
    </mdb-form-control>
  `,
})
class TestMentionComponent {
  testShowListOnTrigger = true;
  testOutputKey = 'name';
  testShowImg = true;
  testNoResultText = 'No results found';
  testVisibleItems = 5;
  testDisableFilter = false;
  testQueryBy = 'username';
  testPosition = 'bottom';
  testTrigger: string | string[] = '@';
  testItems: any[] = [
    { name: 'Max', username: 'maximus', image: '' },
    { name: 'Andrew', username: 'andrew00', image: '' },
    { name: 'Rebecca', username: 'becky', image: '' },
    { name: 'Thomas', username: 'tommy16', image: '' },
    { name: 'Alexander', username: 'xander', image: '' },
    { name: 'Jessica', username: 'jessyJ12', image: '' },
  ];
  activeTriggerMultipleExample = '';

  onTriggerChange(mentionChange) {
    const triggerChanged = this.testTrigger !== mentionChange.trigger;
    if (!triggerChanged) {
      return;
    }

    this.activeTriggerMultipleExample = mentionChange.trigger;
    switch (this.activeTriggerMultipleExample) {
      case '@':
        this.testItems = [
          { name: 'James', username: 'james123', image: '' },
          { name: 'John', username: 'john322', image: '' },
          { name: 'Mary', username: 'maryx', image: '' },
          { name: 'Diane', username: 'didiane92', image: '' },
        ];
        this.testQueryBy = 'name';
        break;
      case '#':
        this.testItems = [
          { productName: 'fish' },
          { productName: 'meat' },
          { productName: 'vegetables' },
        ];
        this.testQueryBy = 'productName';
        break;
      case '$':
        this.testItems = [{ id: '1234' }, { id: '4955' }, { id: '3455' }];
        this.testQueryBy = 'id';
        break;
      case '%':
        this.testItems = [{ city: 'Warsaw' }, { city: 'Berlin' }, { city: 'Amsterdam' }];
        this.testQueryBy = 'city';

        break;
    }
  }
}

function createKeyboardEvent(type: string, keyCode: number, key?: string): KeyboardEvent {
  const event = new KeyboardEvent(type);

  Object.defineProperty(event, 'keyCode', {
    get: () => keyCode,
  });

  Object.defineProperty(event, 'key', {
    get: () => key,
  });

  return event;
}
