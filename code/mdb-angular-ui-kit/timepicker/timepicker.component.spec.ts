import { Component, Provider, Type, ViewChild } from '@angular/core';
import { TestBed, ComponentFixture, inject, fakeAsync, flush } from '@angular/core/testing';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { By } from '@angular/platform-browser';
import { OverlayContainer } from '@angular/cdk/overlay';
import { MdbFormsModule } from 'mdb-angular-ui-kit/forms';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import {
  DOWN_ARROW,
  END,
  ENTER,
  HOME,
  LEFT_ARROW,
  PAGE_DOWN,
  PAGE_UP,
  RIGHT_ARROW,
  UP_ARROW,
} from '@angular/cdk/keycodes';
import { MdbTimepickerModule } from './timepicker.module';
import { MdbTimepickerComponent } from './timepicker.component';
import { MdbTimepickerDirective } from './timepicker.directive';

const NAME = 'timepicker';
const SELECTOR_CONTAINER = `.${NAME}-container`;
const SELECTOR_INLINE = `${SELECTOR_CONTAINER} .${NAME}-elements-inline`;
const SELECTOR_BTN_TOGGLE = `.${NAME}-toggle-button`;
const SELECTOR_CURRENT_HOUR = `.${NAME}-hour`;
const SELECTOR_CURRENT_MINUTE = `.${NAME}-minute`;
const SELECTOR_AM_BTN = `.${NAME}-am`;
const SELECTOR_PM_BTN = `.${NAME}-pm`;
const SELECTOR_INLINE_HOUR_ARROW_UP_BTN = `.${NAME}-icon-up.${NAME}-icon-inline-hour`;
const SELECTOR_INLINE_HOUR_ARROW_DOWN_BTN = `.${NAME}-icon-down.${NAME}-icon-inline-hour`;
const SELECTOR_INLINE_MINUTE_ARROW_UP_BTN = `.${NAME}-icon-up.${NAME}-icon-inline-minute`;
const SELECTOR_INLINE_MINUTE_ARROW_DOWN_BTN = `.${NAME}-icon-down.${NAME}-icon-inline-minute`;
const SELECTOR_OK_BTN = `.${NAME}-ok`;
const SELECTOR_INLINE_OK_BTN = `.${NAME}-submit-inline`;
const SELECTOR_TIPS_HOUR = `.${NAME}-time-tips-hours`;
const SELECTOR_TIPS_MINUTE = `.${NAME}-time-tips-minutes`;

@Component({
  selector: 'mdb-basic-datepicker',
  template: `
    <mdb-form-control>
      <input
        mdbInput
        type="text"
        id="form1"
        class="form-control"
        [mdbTimepicker]="timepicker"
        required
      />
      <label mdbLabel class="form-label" for="form1">Example label</label>
      <mdb-timepicker-toggle [mdbTimepickerToggle]="timepicker"></mdb-timepicker-toggle>
      <mdb-timepicker
        #timepicker
        [inline]="inline"
        [format12]="format12"
        [format24]="format24"
        [disabled]="disabled"
        [increment]="increment"
      ></mdb-timepicker>
    </mdb-form-control>
  `,
})
// eslint-disable-next-line @angular-eslint/component-class-suffix
class BasicTimepicker {
  inline = false;
  startDate = new Date();
  view = 'days';
  format12 = true;
  format24 = false;
  disabled = false;
  increment = false;

  @ViewChild(MdbTimepickerComponent, { static: true }) timepicker: MdbTimepickerComponent;
  @ViewChild(MdbTimepickerDirective, { static: true })
  timepickerDirective: MdbTimepickerDirective;
}

describe('MDB Datepicker', () => {
  let overlayContainer: OverlayContainer;
  let overlayContainerElement: HTMLElement;
  let fixture: ComponentFixture<BasicTimepicker>;
  let input: HTMLInputElement;
  let timepicker: MdbTimepickerComponent;
  let timepickerDirective: MdbTimepickerDirective;
  let testComponent: BasicTimepicker;

  function createComponent<T>(component: Type<T>, providers: Provider[] = []): ComponentFixture<T> {
    TestBed.configureTestingModule({
      imports: [
        MdbTimepickerModule,
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

  beforeEach(() => {
    fixture = createComponent(BasicTimepicker);
    fixture.detectChanges();
    testComponent = fixture.componentInstance;
    timepicker = testComponent.timepicker;
    timepickerDirective = testComponent.timepickerDirective;
    input = fixture.debugElement.query(By.css('input')).nativeElement;
  });

  afterEach(inject([OverlayContainer], (currentOverlayContainer: OverlayContainer) => {
    currentOverlayContainer.ngOnDestroy();
    overlayContainer.ngOnDestroy();
  }));

  describe('Opening and closing', () => {
    it('should open and close component in modal mode by default', fakeAsync(() => {
      timepicker.open();
      fixture.detectChanges();
      flush();

      expect(document.querySelector(SELECTOR_CONTAINER)).not.toBeNull();

      timepicker.close();
      fixture.detectChanges();
      flush();

      expect(document.querySelector(SELECTOR_CONTAINER)).toBeNull();
    }));

    it('should open and close component in inline mode if inline input is set to true', fakeAsync(() => {
      testComponent.inline = true;
      fixture.detectChanges();
      timepicker.open();
      fixture.detectChanges();
      flush();

      expect(document.querySelector(SELECTOR_INLINE)).not.toBeNull();

      timepicker.close();
      fixture.detectChanges();
      flush();

      expect(document.querySelector(SELECTOR_INLINE)).toBeNull();
    }));

    it('should open component on toggle click', fakeAsync(() => {
      const toggleButton = fixture.nativeElement.querySelector(SELECTOR_BTN_TOGGLE);
      timepicker.inline = true;

      toggleButton.click();
      fixture.detectChanges();
      flush();

      expect(document.querySelector(SELECTOR_CONTAINER)).not.toBeNull();
      expect(document.querySelector(SELECTOR_INLINE)).not.toBeNull();
    }));

    it('should dont open component on toggle click if disabled', fakeAsync(() => {
      const toggleButton = fixture.nativeElement.querySelector(SELECTOR_BTN_TOGGLE);
      timepicker.disabled = true;

      toggleButton.click();
      fixture.detectChanges();
      flush();

      expect(document.querySelector(SELECTOR_CONTAINER)).toBeNull();
      expect(document.querySelector(SELECTOR_INLINE)).toBeNull();
    }));

    it('should dont open component on toggle click if disabled in inline mode', fakeAsync(() => {
      const toggleButton = fixture.nativeElement.querySelector(SELECTOR_BTN_TOGGLE);
      timepicker.inline = true;
      timepicker.disabled = true;

      toggleButton.click();
      fixture.detectChanges();
      flush();

      expect(document.querySelector(SELECTOR_CONTAINER)).toBeNull();
      expect(document.querySelector(SELECTOR_INLINE)).toBeNull();
    }));
  });

  describe('change view', () => {
    it('should change wiev to minute and back to hour', fakeAsync(() => {
      timepicker.inline = false;

      timepicker.open();
      fixture.detectChanges();
      flush();

      expect(document.querySelector(SELECTOR_TIPS_HOUR)).not.toBeNull();
      expect(document.querySelector(SELECTOR_TIPS_MINUTE)).toBeNull();

      const curenMinute: HTMLElement = document.querySelector(SELECTOR_CURRENT_MINUTE);
      curenMinute.click();

      fixture.detectChanges();
      flush();

      expect(document.querySelector(SELECTOR_TIPS_HOUR)).toBeNull();
      expect(document.querySelector(SELECTOR_TIPS_MINUTE)).not.toBeNull();

      const curenHour: HTMLElement = document.querySelector(SELECTOR_CURRENT_HOUR);
      curenHour.click();

      fixture.detectChanges();
      flush();

      expect(document.querySelector(SELECTOR_TIPS_HOUR)).not.toBeNull();
      expect(document.querySelector(SELECTOR_TIPS_MINUTE)).toBeNull();
    }));
  });

  describe('Time selection', () => {
    it('should update time', fakeAsync(() => {
      let hour = '10';
      let minute = '52';
      let amPm = 'AM';

      expect(timepickerDirective.value).toBeUndefined();

      timepicker.format12 = true;
      timepickerDirective.value = `${hour}:${minute} ${amPm}`;

      timepicker.open();
      fixture.detectChanges();
      flush();

      expect(document.querySelector(SELECTOR_CURRENT_HOUR).textContent.trim()).toBe(hour);
      expect(document.querySelector(SELECTOR_CURRENT_MINUTE).textContent.trim()).toBe(minute);
      expect(document.querySelector(SELECTOR_AM_BTN).classList.contains('active')).toBe(true);
      expect(document.querySelector(SELECTOR_PM_BTN).classList.contains('active')).toBe(false);

      timepicker.close();
      fixture.detectChanges();
      flush();

      hour = '11';
      minute = '26';
      amPm = 'PM';

      timepickerDirective.value = `${hour}:${minute} ${amPm}`;

      timepicker.open();
      fixture.detectChanges();
      flush();

      expect(document.querySelector(SELECTOR_CURRENT_HOUR).textContent.trim()).toBe(hour);
      expect(document.querySelector(SELECTOR_CURRENT_MINUTE).textContent.trim()).toBe(minute);
      expect(document.querySelector(SELECTOR_AM_BTN).classList.contains('active')).toBe(false);
      expect(document.querySelector(SELECTOR_PM_BTN).classList.contains('active')).toBe(true);

      timepicker.close();
      fixture.detectChanges();
      flush();

      hour = '14';
      minute = '33';
      timepicker.format12 = false;
      timepicker.format24 = true;

      timepickerDirective.value = `${hour}:${minute}`;

      timepicker.open();
      fixture.detectChanges();
      flush();

      expect(document.querySelector(SELECTOR_CURRENT_HOUR).textContent.trim()).toBe(hour);
      expect(document.querySelector(SELECTOR_CURRENT_MINUTE).textContent.trim()).toBe(minute);
      expect(document.querySelector(SELECTOR_AM_BTN)).toBeNull();
      expect(document.querySelector(SELECTOR_PM_BTN)).toBeNull();
    }));

    it('should correctly select time in inline mode', fakeAsync(() => {
      timepickerDirective.value = `09:10 AM`;
      testComponent.inline = true;
      fixture.detectChanges();

      timepicker.open();
      fixture.detectChanges();
      flush();

      const hourArrowUp: HTMLElement = document.querySelector(SELECTOR_INLINE_HOUR_ARROW_UP_BTN);
      hourArrowUp.click();

      const minuteArrowUp: HTMLElement = document.querySelector(
        SELECTOR_INLINE_MINUTE_ARROW_UP_BTN
      );
      minuteArrowUp.click();

      const pmBtn: HTMLElement = document.querySelector(SELECTOR_PM_BTN);
      pmBtn.click();

      const okBtn: HTMLElement = document.querySelector(SELECTOR_INLINE_OK_BTN);
      okBtn.click();

      fixture.detectChanges();

      expect(timepickerDirective.value).toBe('10:11 PM');
      expect(input.value).toBe('10:11 PM');
    }));

    it('should increase minutes by 5 if increment option is set', fakeAsync(() => {
      timepickerDirective.value = `09:10 AM`;
      testComponent.inline = true;
      testComponent.increment = true;

      fixture.detectChanges();

      timepicker.open();
      fixture.detectChanges();
      flush();

      const hourArrowUp: HTMLElement = document.querySelector(SELECTOR_INLINE_HOUR_ARROW_UP_BTN);
      hourArrowUp.click();

      const minuteArrowUp: HTMLElement = document.querySelector(
        SELECTOR_INLINE_MINUTE_ARROW_UP_BTN
      );
      minuteArrowUp.click();

      const pmBtn: HTMLElement = document.querySelector(SELECTOR_PM_BTN);
      pmBtn.click();

      const okBtn: HTMLElement = document.querySelector(SELECTOR_INLINE_OK_BTN);
      okBtn.click();

      fixture.detectChanges();

      expect(timepickerDirective.value).toBe('10:15 PM');
      expect(input.value).toBe('10:15 PM');
    }));

    it('should decrease minutes by 5 if increment option is set', fakeAsync(() => {
      timepickerDirective.value = `09:10 AM`;
      testComponent.inline = true;
      testComponent.increment = true;

      fixture.detectChanges();

      timepicker.open();
      fixture.detectChanges();
      flush();

      const hourArrowUp: HTMLElement = document.querySelector(SELECTOR_INLINE_HOUR_ARROW_DOWN_BTN);
      hourArrowUp.click();

      const minuteArrowUp: HTMLElement = document.querySelector(
        SELECTOR_INLINE_MINUTE_ARROW_DOWN_BTN
      );
      minuteArrowUp.click();

      const pmBtn: HTMLElement = document.querySelector(SELECTOR_PM_BTN);
      pmBtn.click();

      const okBtn: HTMLElement = document.querySelector(SELECTOR_INLINE_OK_BTN);
      okBtn.click();

      fixture.detectChanges();

      expect(timepickerDirective.value).toBe('08:05 PM');
      expect(input.value).toBe('08:05 PM');
    }));
  });

  describe('Hours view keyboard navigation', () => {
    it('should increment hours by 1 on up arrow keydown', fakeAsync(() => {
      timepickerDirective.value = `09:10 AM`;
      fixture.detectChanges();

      timepicker.open();
      fixture.detectChanges();
      flush();

      const currentHour = document.querySelector(SELECTOR_CURRENT_HOUR).parentElement;
      currentHour.dispatchEvent(new KeyboardEvent('keydown', { key: 'ArrowUp' }));
      fixture.detectChanges();

      expect(currentHour.textContent.trim()).toBe('10');

      const okBtn: HTMLElement = document.querySelector(SELECTOR_OK_BTN);
      okBtn.click();

      fixture.detectChanges();
      flush();

      expect(timepickerDirective.value).toBe('10:10 AM');
      expect(input.value).toBe('10:10 AM');
    }));

    it('should decrease hours by 1 on down arrow keydown', fakeAsync(() => {
      timepickerDirective.value = `09:10 AM`;
      fixture.detectChanges();

      timepicker.open();
      fixture.detectChanges();
      flush();

      const currentHour = document.querySelector(SELECTOR_CURRENT_HOUR).parentElement;
      currentHour.dispatchEvent(new KeyboardEvent('keydown', { key: 'ArrowDown' }));
      fixture.detectChanges();

      expect(currentHour.textContent.trim()).toBe('08');

      const okBtn: HTMLElement = document.querySelector(SELECTOR_OK_BTN);
      okBtn.click();

      fixture.detectChanges();
      flush();

      expect(timepickerDirective.value).toBe('08:10 AM');
      expect(input.value).toBe('08:10 AM');
    }));

    it('should increment hour by 1 on up arrow keydown in inline mode', fakeAsync(() => {
      timepickerDirective.value = `09:10 AM`;
      testComponent.inline = true;
      fixture.detectChanges();

      timepicker.open();
      fixture.detectChanges();
      flush();

      const currentHour = document.querySelector(SELECTOR_CURRENT_HOUR).parentElement;
      currentHour.dispatchEvent(new KeyboardEvent('keydown', { key: 'ArrowUp' }));
      fixture.detectChanges();

      expect(currentHour.textContent.trim()).toBe('10');

      const okBtn: HTMLElement = document.querySelector(SELECTOR_INLINE_OK_BTN);
      okBtn.click();

      fixture.detectChanges();
      flush();

      expect(timepickerDirective.value).toBe('10:10 AM');
      expect(input.value).toBe('10:10 AM');
    }));

    it('should increment hour by 1 on up arrow keydown in inline mode', fakeAsync(() => {
      timepickerDirective.value = `09:10 AM`;
      testComponent.inline = true;
      fixture.detectChanges();

      timepicker.open();
      fixture.detectChanges();
      flush();

      const currentHour = document.querySelector(SELECTOR_CURRENT_HOUR).parentElement;
      currentHour.dispatchEvent(new KeyboardEvent('keydown', { key: 'ArrowUp' }));
      fixture.detectChanges();

      expect(currentHour.textContent.trim()).toBe('10');

      const okBtn: HTMLElement = document.querySelector(SELECTOR_INLINE_OK_BTN);
      okBtn.click();

      fixture.detectChanges();
      flush();

      expect(timepickerDirective.value).toBe('10:10 AM');
      expect(input.value).toBe('10:10 AM');
    }));
  });

  describe('Minutes view keyboard navigation', () => {
    it('should increment minute by 1 on up arrow keydown', fakeAsync(() => {
      timepickerDirective.value = `09:10 AM`;
      fixture.detectChanges();

      timepicker.open();

      fixture.detectChanges();
      flush();

      let currentMinute: HTMLElement =
        document.querySelector(SELECTOR_CURRENT_MINUTE).parentElement;
      currentMinute.click();

      fixture.detectChanges();
      flush();

      currentMinute = document.querySelector(SELECTOR_CURRENT_MINUTE).parentElement;
      currentMinute.dispatchEvent(new KeyboardEvent('keydown', { key: 'ArrowUp' }));
      fixture.detectChanges();

      expect(currentMinute.textContent.trim()).toBe('11');

      const okBtn: HTMLElement = document.querySelector(SELECTOR_OK_BTN);
      okBtn.click();

      fixture.detectChanges();
      flush();

      expect(timepickerDirective.value).toBe('09:11 AM');
      expect(input.value).toBe('09:11 AM');
    }));

    it('should decrease minute by 1 on down arrow keydown', fakeAsync(() => {
      timepickerDirective.value = `09:10 AM`;
      fixture.detectChanges();

      timepicker.open();
      fixture.detectChanges();
      flush();

      let currentMinute: HTMLElement =
        document.querySelector(SELECTOR_CURRENT_MINUTE).parentElement;
      currentMinute.click();

      fixture.detectChanges();
      flush();

      currentMinute = document.querySelector(SELECTOR_CURRENT_MINUTE).parentElement;
      currentMinute.dispatchEvent(new KeyboardEvent('keydown', { key: 'ArrowDown' }));
      fixture.detectChanges();

      expect(currentMinute.textContent.trim()).toBe('09');

      const okBtn: HTMLElement = document.querySelector(SELECTOR_OK_BTN);
      okBtn.click();

      fixture.detectChanges();
      flush();

      expect(timepickerDirective.value).toBe('09:09 AM');
      expect(input.value).toBe('09:09 AM');
    }));

    it('should increment minute by 1 on up arrow keydown in inline mode', fakeAsync(() => {
      timepickerDirective.value = `09:10 AM`;
      testComponent.inline = true;
      fixture.detectChanges();

      timepicker.open();
      fixture.detectChanges();
      flush();

      let currentMinute: HTMLElement =
        document.querySelector(SELECTOR_CURRENT_MINUTE).parentElement;
      currentMinute.click();

      fixture.detectChanges();
      flush();

      currentMinute = document.querySelector(SELECTOR_CURRENT_MINUTE).parentElement;
      currentMinute.dispatchEvent(new KeyboardEvent('keydown', { key: 'ArrowUp' }));
      fixture.detectChanges();

      expect(currentMinute.textContent.trim()).toBe('11');

      const okBtn: HTMLElement = document.querySelector(SELECTOR_INLINE_OK_BTN);
      okBtn.click();

      fixture.detectChanges();
      flush();

      expect(timepickerDirective.value).toBe('09:11 AM');
      expect(input.value).toBe('09:11 AM');
    }));

    it('should decrease minute by 1 on up arrow keydown in inline mode', fakeAsync(() => {
      timepickerDirective.value = `09:10 AM`;
      testComponent.inline = true;
      fixture.detectChanges();

      timepicker.open();
      fixture.detectChanges();
      flush();

      let currentMinute: HTMLElement =
        document.querySelector(SELECTOR_CURRENT_MINUTE).parentElement;
      currentMinute.click();

      fixture.detectChanges();
      flush();

      currentMinute = document.querySelector(SELECTOR_CURRENT_MINUTE).parentElement;
      currentMinute.dispatchEvent(new KeyboardEvent('keydown', { key: 'ArrowDown' }));
      fixture.detectChanges();

      expect(currentMinute.textContent.trim()).toBe('09');

      const okBtn: HTMLElement = document.querySelector(SELECTOR_INLINE_OK_BTN);
      okBtn.click();

      fixture.detectChanges();
      flush();

      expect(timepickerDirective.value).toBe('09:09 AM');
      expect(input.value).toBe('09:09 AM');
    }));
  });
});
