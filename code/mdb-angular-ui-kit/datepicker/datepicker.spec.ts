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
import { MdbDatepickerModule } from './datepicker.module';
import { MdbDatepickerComponent } from './datepicker.component';
import { MdbDatepickerInputDirective } from './datepicker-input.directive';
import {
  addDays,
  addMonths,
  addYears,
  getDate,
  getDaysInMonth,
  getYearsOffset,
} from './datepicker-utils';

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

describe('MDB Datepicker', () => {
  let overlayContainer: OverlayContainer;
  let overlayContainerElement: HTMLElement;
  let fixture: ComponentFixture<BasicDatepicker>;
  let basicComponent: BasicDatepicker;
  let input: HTMLInputElement;
  let datepicker: MdbDatepickerComponent;

  function createComponent<T>(component: Type<T>, providers: Provider[] = []): ComponentFixture<T> {
    TestBed.configureTestingModule({
      imports: [
        MdbDatepickerModule,
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
    fixture = createComponent(BasicDatepicker);
    fixture.detectChanges();
    basicComponent = fixture.componentInstance;
    datepicker = fixture.componentInstance.datepicker;
    input = fixture.debugElement.query(By.css('input')).nativeElement;
  });

  afterEach(inject([OverlayContainer], (currentOverlayContainer: OverlayContainer) => {
    currentOverlayContainer.ngOnDestroy();
    overlayContainer.ngOnDestroy();
  }));

  describe('Opening and closing', () => {
    it('should open and close component in modal mode by default', fakeAsync(() => {
      datepicker.open();
      fixture.detectChanges();
      flush();

      expect(datepicker._isOpen).toBe(true);
      expect(document.querySelector('.datepicker-modal-container')).toBeDefined();

      datepicker.close();
      fixture.detectChanges();
      flush();

      expect(datepicker._isOpen).toBe(false);
      expect(document.querySelector('.datepicker-modal-container')).toBeNull();
    }));

    it('should open and close component in inline mode if inline input is set to true', fakeAsync(() => {
      datepicker.inline = true;
      fixture.detectChanges();
      datepicker.open();
      fixture.detectChanges();
      flush();

      expect(datepicker._isOpen).toBe(true);
      expect(document.querySelector('.datepicker-dropdown-container')).toBeDefined();

      datepicker.close();
      fixture.detectChanges();
      flush();

      expect(datepicker._isOpen).toBe(false);
      expect(document.querySelector('.datepicker-dropdown-container')).toBeNull();
    }));

    it('should open component on toggle click', fakeAsync(() => {
      const toggleButton = fixture.nativeElement.querySelector('.datepicker-toggle-button');
      toggleButton.click();
      fixture.detectChanges();
      flush();

      expect(datepicker._isOpen).toBe(true);
      expect(document.querySelector('.datepicker-modal-container')).toBeDefined();
    }));
  });

  describe('Date selection', () => {
    it('should format date correctly', () => {
      expect(datepicker._formatDate(new Date(2020, 5, 10))).toEqual('10/06/2020');

      datepicker.format = 'dddd, dd mmm, yyyy';
      fixture.detectChanges();

      expect(datepicker._formatDate(new Date(2020, 5, 10))).toEqual('Wednesday, 10 Jun, 2020');

      datepicker.format = 'ddd, dd mmmm, yyyy';
      fixture.detectChanges();

      expect(datepicker._formatDate(new Date(2020, 5, 10))).toEqual('Wed, 10 June, 2020');

      datepicker.format = 'd/mmm/yyyy';
      fixture.detectChanges();

      expect(datepicker._formatDate(new Date(2020, 5, 5))).toEqual('5/Jun/2020');

      datepicker.format = 'd/m/yyyy';
      fixture.detectChanges();

      expect(datepicker._formatDate(new Date(2020, 5, 5))).toEqual('5/6/2020');
    });

    it('should correctly parse date string', () => {
      const format = 'dddd, dd mmm, yyyy';
      const delimeters = datepicker._getDelimeters(format);
      datepicker.format = format;
      fixture.detectChanges();

      expect(datepicker._parseDate('Wednesday, 10 Jun, 2020', format, delimeters)).toEqual(
        new Date(2020, 5, 10)
      );
    });

    it('should correctly select date in inline mode', fakeAsync(() => {
      basicComponent.startDate = new Date(2021, 4, 15);
      basicComponent.inline = true;
      fixture.detectChanges();

      datepicker.open();
      fixture.detectChanges();
      flush();

      const cells = document.querySelectorAll('td');

      cells[6].click();
      fixture.detectChanges();

      expect(datepicker._selectedDate).toEqual(new Date(2021, 4, 1));
      expect(input.value).toEqual('01/05/2021');
    }));

    it('should correctly select date in modal mode but not update input without confirmation', fakeAsync(() => {
      basicComponent.startDate = new Date(2021, 4, 15);
      basicComponent.inline = false;
      fixture.detectChanges();

      datepicker.open();
      fixture.detectChanges();
      flush();

      const cells = document.querySelectorAll('td');

      cells[6].click();
      fixture.detectChanges();

      expect(datepicker._selectedDate).toEqual(new Date(2021, 4, 1));
      expect(input.value).toEqual('');
    }));

    it('should update input value after confirmation in modal mode', fakeAsync(() => {
      basicComponent.startDate = new Date(2021, 4, 15);
      basicComponent.inline = false;
      fixture.detectChanges();

      datepicker.open();
      fixture.detectChanges();
      flush();

      const cells = document.querySelectorAll('td');

      cells[6].click();
      fixture.detectChanges();

      expect(datepicker._selectedDate).toEqual(new Date(2021, 4, 1));
      expect(input.value).toEqual('');

      const okButton = document.querySelector('.datepicker-ok-btn') as HTMLElement;
      okButton.click();
      fixture.detectChanges();
      flush();

      expect(input.value).toEqual('01/05/2021');
    }));

    it('should set todays date if input date is not valid', fakeAsync(() => {
      datepicker.format = 'dd/mm/yyyy';

      input.value = '12/13/1995';

      fixture.detectChanges();

      datepicker.open();

      fixture.detectChanges();
      flush();

      const now = new Date();
      expect(datepicker._activeDate.getDay()).toEqual(now.getDay());
      expect(datepicker._activeDate.getMonth()).toEqual(now.getMonth());
      expect(datepicker._activeDate.getFullYear()).toEqual(now.getFullYear());

      datepicker.close();

      fixture.detectChanges();
      flush();

      input.value = '12/12/1995';

      fixture.detectChanges();

      datepicker.open();

      fixture.detectChanges();
      flush();

      expect(datepicker._activeDate).toEqual(new Date(1995, 11, 12));

      datepicker.close();

      fixture.detectChanges();
      flush();

      input.value = '00/12/1995';

      fixture.detectChanges();

      datepicker.open();

      fixture.detectChanges();
      flush();

      expect(datepicker._activeDate.getDay()).toEqual(now.getDay());
      expect(datepicker._activeDate.getMonth()).toEqual(now.getMonth());
      expect(datepicker._activeDate.getFullYear()).toEqual(now.getFullYear());

      datepicker.close();

      fixture.detectChanges();
      flush();

      input.value = '32/12/1995';

      fixture.detectChanges();

      datepicker.open();

      fixture.detectChanges();
      flush();

      expect(datepicker._activeDate.getDay()).toEqual(now.getDay());
      expect(datepicker._activeDate.getMonth()).toEqual(now.getMonth());
      expect(datepicker._activeDate.getFullYear()).toEqual(now.getFullYear());
    }));

    it('should correctly select year and switch to month view', fakeAsync(() => {
      basicComponent.startDate = new Date(2021, 4, 15);
      basicComponent.view = 'years';
      fixture.detectChanges();

      datepicker.open();
      fixture.detectChanges();
      flush();

      const cells = document.querySelectorAll('td');

      cells[3].click();
      fixture.detectChanges();
      flush();

      expect(datepicker._selectedYear).toEqual(2019);
      expect(datepicker._activeDate).toEqual(new Date(2019, 4, 15));
      expect(datepicker._currentView).toEqual('months');
    }));

    it('should correctly select month and switch to days view', fakeAsync(() => {
      basicComponent.startDate = new Date(2021, 4, 15);
      basicComponent.view = 'months';
      fixture.detectChanges();

      datepicker.open();
      fixture.detectChanges();
      flush();

      const cells = document.querySelectorAll('td');

      cells[3].click();
      fixture.detectChanges();
      flush();

      expect(datepicker._selectedMonth).toEqual(3);
      expect(datepicker._activeDate).toEqual(new Date(2021, 3, 15));
      expect(datepicker._currentView).toEqual('days');
    }));
  });

  describe('controls', () => {
    it('should increase month by 1 and update view on next click in day view', fakeAsync(() => {
      const startDate = new Date(2020, 5, 15);
      datepicker.startDate = startDate;
      fixture.detectChanges();

      datepicker.open();
      fixture.detectChanges();
      flush();

      const nextButton = document.querySelector('.datepicker-next-button') as HTMLElement;
      const viewChangeButton = document.querySelector('.datepicker-view-change-button');

      expect(viewChangeButton.textContent).toBe(' June 2020 ');

      nextButton.click();
      fixture.detectChanges();
      flush();

      expect(datepicker._activeDate).toEqual(addMonths(startDate, 1));
      expect(viewChangeButton.textContent).toBe(' July 2020 ');
    }));

    it('should decrease month by 1 and update view on previous click in day view', fakeAsync(() => {
      const startDate = new Date(2020, 5, 15);
      datepicker.startDate = startDate;
      fixture.detectChanges();

      datepicker.open();
      fixture.detectChanges();
      flush();

      const container = document.querySelector('.datepicker-modal-container');
      const previousButton = document.querySelector('.datepicker-previous-button') as HTMLElement;
      const viewChangeButton = document.querySelector('.datepicker-view-change-button');

      expect(viewChangeButton.textContent).toBe(' June 2020 ');

      previousButton.click();
      fixture.detectChanges();
      flush();

      expect(datepicker._activeDate).toEqual(addMonths(startDate, -1));
      expect(viewChangeButton.textContent).toBe(' May 2020 ');
    }));

    it('should increase years by 24 and update view on next click in years view', fakeAsync(() => {
      const startDate = new Date(2020, 5, 15);
      datepicker.startDate = startDate;
      datepicker.startView = 'years';
      fixture.detectChanges();

      datepicker.open();
      fixture.detectChanges();
      flush();

      const container = document.querySelector('.datepicker-modal-container');
      const nextButton = document.querySelector('.datepicker-next-button') as HTMLElement;
      const viewChangeButton = document.querySelector('.datepicker-view-change-button');

      expect(viewChangeButton.textContent).toBe(' 2016 - 2039 ');

      nextButton.click();
      fixture.detectChanges();
      flush();

      expect(datepicker._activeDate).toEqual(addYears(startDate, 24));
      expect(viewChangeButton.textContent).toBe(' 2040 - 2063 ');
    }));

    it('should decrease years by 24 and update view on previous click in years view', fakeAsync(() => {
      const startDate = new Date(2020, 5, 15);
      datepicker.startDate = startDate;
      datepicker.startView = 'years';
      fixture.detectChanges();

      datepicker.open();
      fixture.detectChanges();
      flush();

      const container = document.querySelector('.datepicker-modal-container');
      const previousButton = document.querySelector('.datepicker-previous-button') as HTMLElement;
      const viewChangeButton = document.querySelector('.datepicker-view-change-button');

      expect(viewChangeButton.textContent).toBe(' 2016 - 2039 ');

      previousButton.click();
      fixture.detectChanges();
      flush();

      expect(datepicker._activeDate).toEqual(addYears(startDate, -24));
      expect(viewChangeButton.textContent).toBe(' 1992 - 2015 ');
    }));

    it('should increase year by 1 and update view on next click in months view', fakeAsync(() => {
      const startDate = new Date(2020, 5, 15);
      datepicker.startDate = startDate;
      datepicker.startView = 'months';
      fixture.detectChanges();

      datepicker.open();
      fixture.detectChanges();
      flush();

      const container = document.querySelector('.datepicker-modal-container');
      const nextButton = document.querySelector('.datepicker-next-button') as HTMLElement;
      const viewChangeButton = document.querySelector('.datepicker-view-change-button');

      expect(viewChangeButton.textContent).toBe(' 2020 ');

      nextButton.click();
      fixture.detectChanges();
      flush();

      expect(datepicker._activeDate).toEqual(addYears(startDate, 1));
      expect(viewChangeButton.textContent).toBe(' 2021 ');
    }));

    it('should decrease year by 1 and update view on previous click in months view', fakeAsync(() => {
      const startDate = new Date(2020, 5, 15);
      datepicker.startDate = startDate;
      datepicker.startView = 'months';
      fixture.detectChanges();

      datepicker.open();
      fixture.detectChanges();
      flush();

      const container = document.querySelector('.datepicker-modal-container');
      const previousButton = document.querySelector('.datepicker-previous-button') as HTMLElement;
      const viewChangeButton = document.querySelector('.datepicker-view-change-button');

      expect(viewChangeButton.textContent).toBe(' 2020 ');

      previousButton.click();
      fixture.detectChanges();
      flush();

      expect(datepicker._activeDate).toEqual(addYears(startDate, -1));
      expect(viewChangeButton.textContent).toBe(' 2019 ');
    }));
  });

  describe('accessibility', () => {
    it('should add correct aria attributes to the elements', fakeAsync(() => {
      datepicker.open();
      fixture.detectChanges();
      flush();

      const viewChangeButton = document.querySelector('.datepicker-view-change-button');
      const previousButton = document.querySelector('.datepicker-previous-button');
      const nextButton = document.querySelector('.datepicker-next-button');
      const okButton = document.querySelector('.datepicker-ok-btn');
      const cancelButton = document.querySelector('.datepicker-cancel-btn');
      const clearButton = document.querySelector('.datepicker-clear-btn');

      expect(viewChangeButton.getAttribute('aria-label')).toBe('Choose year and month');
      expect(previousButton.getAttribute('aria-label')).toBe('Previous month');
      expect(nextButton.getAttribute('aria-label')).toBe('Next month');
      expect(okButton.getAttribute('aria-label')).toBe('Confirm selection');
      expect(cancelButton.getAttribute('aria-label')).toBe('Cancel selection');
      expect(clearButton.getAttribute('aria-label')).toBe('Clear selection');
    }));

    it('should update aria attributes in years view', fakeAsync(() => {
      basicComponent.view = 'years';
      fixture.detectChanges();

      datepicker.open();
      fixture.detectChanges();
      flush();

      const viewChangeButton = document.querySelector('.datepicker-view-change-button');
      const previousButton = document.querySelector('.datepicker-previous-button');
      const nextButton = document.querySelector('.datepicker-next-button');

      expect(viewChangeButton.getAttribute('aria-label')).toBe('Choose date');
      expect(previousButton.getAttribute('aria-label')).toBe('Previous 24 years');
      expect(nextButton.getAttribute('aria-label')).toBe('Next 24 years');
    }));

    it('should update aria attributes in months view', fakeAsync(() => {
      basicComponent.view = 'months';
      fixture.detectChanges();

      datepicker.open();
      fixture.detectChanges();
      flush();

      const viewChangeButton = document.querySelector('.datepicker-view-change-button');
      const previousButton = document.querySelector('.datepicker-previous-button');
      const nextButton = document.querySelector('.datepicker-next-button');

      expect(viewChangeButton.getAttribute('aria-label')).toBe('Choose date');
      expect(previousButton.getAttribute('aria-label')).toBe('Previous year');
      expect(nextButton.getAttribute('aria-label')).toBe('Next year');
    }));
  });

  describe('day view keyboard navigation', () => {
    it('should increment days by 1 on right arrow keydown', fakeAsync(() => {
      const startDate = new Date();
      basicComponent.startDate = startDate;
      fixture.detectChanges();

      datepicker.open();
      fixture.detectChanges();
      flush();
      const event = createKeyboardEvent('keydown', RIGHT_ARROW);

      const tableBody = document.querySelector('.datepicker-table-body');
      tableBody.dispatchEvent(event);
      fixture.detectChanges();

      expect(datepicker._activeDate).toEqual(addDays(startDate, 1));
    }));

    it('should decrement days by 1 on left arrow keydown', fakeAsync(() => {
      const startDate = new Date();
      basicComponent.startDate = startDate;
      fixture.detectChanges();

      datepicker.open();
      fixture.detectChanges();
      flush();
      const event = createKeyboardEvent('keydown', LEFT_ARROW);

      const tableBody = document.querySelector('.datepicker-table-body');
      tableBody.dispatchEvent(event);
      fixture.detectChanges();

      expect(datepicker._activeDate).toEqual(addDays(startDate, -1));
    }));

    it('should increment days by 7 on down arrow keydown', fakeAsync(() => {
      const startDate = new Date();
      basicComponent.startDate = startDate;
      fixture.detectChanges();

      datepicker.open();
      fixture.detectChanges();
      flush();
      const event = createKeyboardEvent('keydown', DOWN_ARROW);

      const tableBody = document.querySelector('.datepicker-table-body');
      tableBody.dispatchEvent(event);
      fixture.detectChanges();

      expect(datepicker._activeDate).toEqual(addDays(new Date(), 7));
    }));

    it('should decrement days by 7 on up arrow keydown', fakeAsync(() => {
      const startDate = new Date();
      basicComponent.startDate = startDate;
      fixture.detectChanges();

      datepicker.open();
      fixture.detectChanges();
      flush();
      const event = createKeyboardEvent('keydown', UP_ARROW);

      const tableBody = document.querySelector('.datepicker-table-body');
      tableBody.dispatchEvent(event);
      fixture.detectChanges();

      expect(datepicker._activeDate).toEqual(addDays(startDate, -7));
    }));

    it('should select first day of the month on home keydown', fakeAsync(() => {
      const startDate = new Date();
      basicComponent.startDate = startDate;
      fixture.detectChanges();

      datepicker.open();
      fixture.detectChanges();
      flush();
      const event = createKeyboardEvent('keydown', HOME);

      const tableBody = document.querySelector('.datepicker-table-body');
      tableBody.dispatchEvent(event);
      fixture.detectChanges();

      const firstDayOfTheMonth = addDays(startDate, 1 - getDate(startDate));

      expect(datepicker._activeDate).toEqual(firstDayOfTheMonth);
    }));

    it('should select last day of the month on end keydown', fakeAsync(() => {
      const startDate = new Date();
      basicComponent.startDate = startDate;
      fixture.detectChanges();

      datepicker.open();
      fixture.detectChanges();
      flush();
      const event = createKeyboardEvent('keydown', END);

      const tableBody = document.querySelector('.datepicker-table-body');
      tableBody.dispatchEvent(event);
      fixture.detectChanges();

      const lastDayOfTheMonth = addDays(startDate, getDaysInMonth(startDate) - getDate(startDate));

      expect(datepicker._activeDate).toEqual(lastDayOfTheMonth);
    }));

    it('should increment months by 1 on page down keydown', fakeAsync(() => {
      const startDate = new Date();
      basicComponent.startDate = startDate;
      fixture.detectChanges();

      datepicker.open();
      fixture.detectChanges();
      flush();
      const event = createKeyboardEvent('keydown', PAGE_DOWN);

      const tableBody = document.querySelector('.datepicker-table-body');
      tableBody.dispatchEvent(event);
      fixture.detectChanges();

      expect(datepicker._activeDate).toEqual(addMonths(startDate, 1));
    }));

    it('should decrement months by 1 on page up keydown', fakeAsync(() => {
      const startDate = new Date();
      basicComponent.startDate = startDate;
      fixture.detectChanges();

      datepicker.open();
      fixture.detectChanges();
      flush();
      const event = createKeyboardEvent('keydown', PAGE_UP);

      const tableBody = document.querySelector('.datepicker-table-body');
      tableBody.dispatchEvent(event);
      fixture.detectChanges();

      expect(datepicker._activeDate).toEqual(addMonths(startDate, -1));
    }));

    it('should select date on enter keydown', fakeAsync(() => {
      const startDate = new Date();
      basicComponent.startDate = startDate;
      fixture.detectChanges();

      datepicker.open();
      fixture.detectChanges();
      flush();
      const event = createKeyboardEvent('keydown', ENTER);

      const tableBody = document.querySelector('.datepicker-table-body');
      tableBody.dispatchEvent(event);
      fixture.detectChanges();

      expect(datepicker._selectedDate).toEqual(startDate);
    }));
  });

  describe('years view keyboard navigation', () => {
    it('should increment years by 1 on right arrow keydown', fakeAsync(() => {
      const startDate = new Date();
      basicComponent.startDate = startDate;
      basicComponent.view = 'years';
      fixture.detectChanges();

      datepicker.open();
      fixture.detectChanges();
      flush();
      const event = createKeyboardEvent('keydown', RIGHT_ARROW);

      const tableBody = document.querySelector('.datepicker-table-body');
      tableBody.dispatchEvent(event);
      fixture.detectChanges();

      expect(datepicker._activeDate).toEqual(addYears(startDate, 1));
    }));

    it('should decrement years by 1 on left arrow keydown', fakeAsync(() => {
      const startDate = new Date();
      basicComponent.startDate = startDate;
      basicComponent.view = 'years';
      fixture.detectChanges();

      datepicker.open();
      fixture.detectChanges();
      flush();
      const event = createKeyboardEvent('keydown', LEFT_ARROW);

      const tableBody = document.querySelector('.datepicker-table-body');
      tableBody.dispatchEvent(event);
      fixture.detectChanges();

      expect(datepicker._activeDate).toEqual(addYears(startDate, -1));
    }));

    it('should increment years by 4 on down arrow keydown', fakeAsync(() => {
      const startDate = new Date();
      basicComponent.startDate = startDate;
      basicComponent.view = 'years';
      fixture.detectChanges();

      datepicker.open();
      fixture.detectChanges();
      flush();
      const event = createKeyboardEvent('keydown', DOWN_ARROW);

      const tableBody = document.querySelector('.datepicker-table-body');
      tableBody.dispatchEvent(event);
      fixture.detectChanges();

      expect(datepicker._activeDate).toEqual(addYears(startDate, 4));
    }));

    it('should decrement years by 4 on up arrow keydown', fakeAsync(() => {
      const startDate = new Date();
      basicComponent.startDate = startDate;
      basicComponent.view = 'years';
      fixture.detectChanges();

      datepicker.open();
      fixture.detectChanges();
      flush();
      const event = createKeyboardEvent('keydown', UP_ARROW);

      const tableBody = document.querySelector('.datepicker-table-body');
      tableBody.dispatchEvent(event);
      fixture.detectChanges();

      expect(datepicker._activeDate).toEqual(addYears(startDate, -4));
    }));

    it('should select first year in view on home keydown', fakeAsync(() => {
      const startDate = new Date();
      basicComponent.startDate = startDate;
      basicComponent.view = 'years';
      fixture.detectChanges();

      datepicker.open();
      fixture.detectChanges();
      flush();
      const event = createKeyboardEvent('keydown', HOME);

      const tableBody = document.querySelector('.datepicker-table-body');
      tableBody.dispatchEvent(event);
      fixture.detectChanges();

      const firstYearInView = addYears(startDate, -getYearsOffset(startDate, 24, null, null));

      expect(datepicker._activeDate).toEqual(firstYearInView);
    }));

    it('should select last year in view on end keydown', fakeAsync(() => {
      const startDate = new Date();
      basicComponent.startDate = startDate;
      basicComponent.view = 'years';
      fixture.detectChanges();

      datepicker.open();
      fixture.detectChanges();
      flush();
      const event = createKeyboardEvent('keydown', END);

      const tableBody = document.querySelector('.datepicker-table-body');
      tableBody.dispatchEvent(event);
      fixture.detectChanges();

      const lastYearInView = addYears(
        startDate,
        24 - getYearsOffset(startDate, 24, null, null) - 1
      );

      expect(datepicker._activeDate).toEqual(lastYearInView);
    }));

    it('should increment years by 24 on page down keydown', fakeAsync(() => {
      const startDate = new Date();
      basicComponent.startDate = startDate;
      basicComponent.view = 'years';
      fixture.detectChanges();

      datepicker.open();
      fixture.detectChanges();
      flush();
      const event = createKeyboardEvent('keydown', PAGE_DOWN);

      const tableBody = document.querySelector('.datepicker-table-body');
      tableBody.dispatchEvent(event);
      fixture.detectChanges();

      expect(datepicker._activeDate).toEqual(addYears(startDate, 24));
    }));

    it('should decrement years by 24 on page up keydown', fakeAsync(() => {
      const startDate = new Date();
      basicComponent.startDate = startDate;
      basicComponent.view = 'years';
      fixture.detectChanges();

      datepicker.open();
      fixture.detectChanges();
      flush();
      const event = createKeyboardEvent('keydown', PAGE_UP);

      const tableBody = document.querySelector('.datepicker-table-body');
      tableBody.dispatchEvent(event);
      fixture.detectChanges();

      expect(datepicker._activeDate).toEqual(addYears(startDate, -24));
    }));

    it('should select year on enter keydown', fakeAsync(() => {
      const startDate = new Date(2021, 5, 15);
      basicComponent.startDate = startDate;
      basicComponent.view = 'years';
      fixture.detectChanges();

      datepicker.open();
      fixture.detectChanges();
      flush();
      const event = createKeyboardEvent('keydown', ENTER);

      const tableBody = document.querySelector('.datepicker-table-body');
      tableBody.dispatchEvent(event);
      fixture.detectChanges();
      flush();

      expect(datepicker._selectedYear).toEqual(2021);
    }));
  });

  describe('months view keyboard navigation', () => {
    it('should increment month by 1 on right arrow keydown', fakeAsync(() => {
      const startDate = new Date();
      basicComponent.startDate = startDate;
      basicComponent.view = 'months';
      fixture.detectChanges();

      datepicker.open();
      fixture.detectChanges();
      flush();
      const event = createKeyboardEvent('keydown', RIGHT_ARROW);

      const tableBody = document.querySelector('.datepicker-table-body');
      tableBody.dispatchEvent(event);
      fixture.detectChanges();

      expect(datepicker._activeDate).toEqual(addMonths(startDate, 1));
    }));

    it('should decrement months by 1 on left arrow keydown', fakeAsync(() => {
      const startDate = new Date();
      basicComponent.startDate = startDate;
      basicComponent.view = 'months';
      fixture.detectChanges();

      datepicker.open();
      fixture.detectChanges();
      flush();
      const event = createKeyboardEvent('keydown', LEFT_ARROW);

      const tableBody = document.querySelector('.datepicker-table-body');
      tableBody.dispatchEvent(event);
      fixture.detectChanges();

      expect(datepicker._activeDate).toEqual(addMonths(startDate, -1));
    }));

    it('should increment months by 4 on down arrow keydown', fakeAsync(() => {
      const startDate = new Date();
      basicComponent.startDate = startDate;
      basicComponent.view = 'months';
      fixture.detectChanges();

      datepicker.open();
      fixture.detectChanges();
      flush();
      const event = createKeyboardEvent('keydown', DOWN_ARROW);

      const tableBody = document.querySelector('.datepicker-table-body');
      tableBody.dispatchEvent(event);
      fixture.detectChanges();

      expect(datepicker._activeDate).toEqual(addMonths(startDate, 4));
    }));

    it('should decrement months by 4 on up arrow keydown', fakeAsync(() => {
      const startDate = new Date();
      basicComponent.startDate = startDate;
      basicComponent.view = 'months';
      fixture.detectChanges();

      datepicker.open();
      fixture.detectChanges();
      flush();
      const event = createKeyboardEvent('keydown', UP_ARROW);

      const tableBody = document.querySelector('.datepicker-table-body');
      tableBody.dispatchEvent(event);
      fixture.detectChanges();

      expect(datepicker._activeDate).toEqual(addMonths(startDate, -4));
    }));

    it('should select first month in view on home keydown', fakeAsync(() => {
      const startDate = new Date();
      basicComponent.startDate = startDate;
      basicComponent.view = 'months';
      fixture.detectChanges();

      datepicker.open();
      fixture.detectChanges();
      flush();
      const event = createKeyboardEvent('keydown', HOME);

      const tableBody = document.querySelector('.datepicker-table-body');
      tableBody.dispatchEvent(event);
      fixture.detectChanges();

      const firstMonthInView = addMonths(datepicker._activeDate, -datepicker.activeMonth);

      expect(datepicker._activeDate).toEqual(firstMonthInView);
    }));

    it('should select last month in view on end keydown', fakeAsync(() => {
      const startDate = new Date();
      basicComponent.startDate = startDate;
      basicComponent.view = 'months';
      fixture.detectChanges();

      datepicker.open();
      fixture.detectChanges();
      flush();
      const event = createKeyboardEvent('keydown', END);

      const tableBody = document.querySelector('.datepicker-table-body');
      tableBody.dispatchEvent(event);
      fixture.detectChanges();

      const lastMonthInView = addMonths(datepicker._activeDate, 11 - datepicker.activeMonth);

      expect(datepicker._activeDate).toEqual(lastMonthInView);
    }));

    it('should increment years by 1 on page down keydown', fakeAsync(() => {
      const startDate = new Date();
      basicComponent.startDate = startDate;
      basicComponent.view = 'months';
      fixture.detectChanges();

      datepicker.open();
      fixture.detectChanges();
      flush();
      const event = createKeyboardEvent('keydown', PAGE_DOWN);

      const tableBody = document.querySelector('.datepicker-table-body');
      tableBody.dispatchEvent(event);
      fixture.detectChanges();

      expect(datepicker._activeDate).toEqual(addYears(startDate, 1));
    }));

    it('should decrement years by 1 on page up keydown', fakeAsync(() => {
      const startDate = new Date();
      basicComponent.startDate = startDate;
      basicComponent.view = 'months';
      fixture.detectChanges();

      datepicker.open();
      fixture.detectChanges();
      flush();
      const event = createKeyboardEvent('keydown', PAGE_UP);

      const tableBody = document.querySelector('.datepicker-table-body');
      tableBody.dispatchEvent(event);
      fixture.detectChanges();

      expect(datepicker._activeDate).toEqual(addYears(startDate, -1));
    }));

    it('should select year on enter keydown', fakeAsync(() => {
      const startDate = new Date(2021, 5, 15);
      basicComponent.startDate = startDate;
      basicComponent.view = 'months';
      fixture.detectChanges();

      datepicker.open();
      fixture.detectChanges();
      flush();
      const event = createKeyboardEvent('keydown', ENTER);

      const tableBody = document.querySelector('.datepicker-table-body');
      tableBody.dispatchEvent(event);
      fixture.detectChanges();
      flush();

      expect(datepicker._selectedMonth).toEqual(5);
    }));
  });
});

@Component({
  selector: 'mdb-basic-datepicker',
  template: `
    <mdb-form-control>
      <input
        mdbInput
        [mdbDatepicker]="basicDatepicker"
        type="text"
        class="form-control"
        id="exampleDatepicker1"
      />
      <label mdbLabel for="exampleDatepicker1" class="form-label">Select a date</label>
      <mdb-datepicker-toggle [mdbDatepicker]="basicDatepicker"></mdb-datepicker-toggle>
      <mdb-datepicker
        [inline]="inline"
        [startDate]="startDate"
        [startView]="view"
        #basicDatepicker
      ></mdb-datepicker>
    </mdb-form-control>
  `,
})
// eslint-disable-next-line @angular-eslint/component-class-suffix
class BasicDatepicker {
  inline = false;
  startDate = new Date();
  view = 'days';

  @ViewChild(MdbDatepickerComponent, { static: true }) datepicker: MdbDatepickerComponent;
  @ViewChild(MdbDatepickerInputDirective, { static: true })
  inputDirective: MdbDatepickerInputDirective;
}
