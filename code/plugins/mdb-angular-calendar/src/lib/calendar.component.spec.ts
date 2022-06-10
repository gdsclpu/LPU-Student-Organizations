import { Component, Provider, Type } from '@angular/core';
import { ComponentFixture, fakeAsync, flush, TestBed } from '@angular/core/testing';
import { MdbCalendarModule } from './calendar.module';
import { MdbCalendarEvent } from './calendar.event.interface';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';

const captions = {
  weekdays: ['Nd', 'Pon', 'Wt', 'Śr', 'Czw', 'Pt', 'Sb'],
  months: [
    'Styczeń',
    'Luty',
    'Marzec',
    'Kwiecień',
    'Maj',
    'Czerwiec',
    'Lipiec',
    'Sierpień',
    'Wrzesień',
    'Październik',
    'Listopad',
    'Grudzień',
  ],
  monthsShort: ['Sty', 'Lut', 'Mar', 'Kwi', 'Maj', 'Cze', 'Lip', 'Sie', 'Wrz', 'Paź', 'Lis', 'Gru'],
  todayCaption: 'Dzisiaj',
  monthCaption: 'Miesiąc',
  weekCaption: 'Tydzień',
  listCaption: 'Lista',
  allDayCaption: 'Cały dzień',
  noEventsCaption: 'Brak wydarzeń',
  summaryCaption: 'Nazwa wydarzenia',
  descriptionCaption: 'Szczegółowy opis wydarzenia',
  startCaption: 'Początek',
  endCaption: 'Koniec',
  addCaption: 'Dodaj',
  deleteCaption: 'Usuń',
  editCaption: 'Edytuj',
  closeCaption: 'Zamknij',
  addEventModalCaption: 'Dodaj wydarzenie',
  editEventModalCaption: 'Edytuj wydarzenie',
};
const exampleDate = new Date('2020/11/03');
@Component({
  // eslint-disable-next-line @angular-eslint/component-selector
  selector: 'mdb-test-calendar',
  template: ` <mdb-calendar [events]="events"></mdb-calendar>`,
})
class DefaultCalendarComponent {
  events: MdbCalendarEvent[] = [
    {
      id: 'event1',
      summary: 'JS Conference',
      startDate: new Date(new Date().setHours(0, 0, 0, 0)),
      endDate: new Date(new Date().setHours(23, 59, 59, 999)),
      color: {
        background: 'primary',
        foreground: 'white',
      },
    },
  ];
}

@Component({
  // eslint-disable-next-line @angular-eslint/component-selector
  selector: 'mdb-test-calendar',
  template: ` <mdb-calendar [options]="options" [events]="events"></mdb-calendar>`,
})
class OptionsCalendarComponent {
  options = captions;
  events: MdbCalendarEvent[] = [
    {
      id: 'event6',
      summary: 'Call',
      startDate: new Date(
        new Date(new Date().setDate(new Date().getDate() + 2)).setHours(11, 0, 0, 0)
      ),
      endDate: new Date(
        new Date(new Date().setDate(new Date().getDate() + 2)).setHours(14, 0, 0, 0)
      ),
      color: {
        background: 'warning',
      },
    },
  ];
}

@Component({
  // eslint-disable-next-line @angular-eslint/component-selector
  selector: 'mdb-test-calendar',
  template: ` <mdb-calendar [mondayFirst]="mondayFirst"></mdb-calendar>`,
})
class MondayFirstCalendarComponent {
  mondayFirst = true;
}

@Component({
  // eslint-disable-next-line @angular-eslint/component-selector
  selector: 'mdb-test-calendar',
  template: ` <mdb-calendar [defaultView]="defaultView"></mdb-calendar>`,
})
class DefaultViewCalendarComponent {
  defaultView = 'week';
}

@Component({
  // eslint-disable-next-line @angular-eslint/component-selector
  selector: 'mdb-test-calendar',
  template: ` <mdb-calendar [defaultDate]="defaultDate"></mdb-calendar>`,
})
class DefaultDateCalendarComponent {
  defaultDate = exampleDate;
}

describe('Mdb Calendar', () => {
  describe('MDB Calendar options', () => {
    it('should change default captions', fakeAsync(() => {
      let fixture: ComponentFixture<OptionsCalendarComponent>;
      let element: any;
      let component: any;

      TestBed.configureTestingModule({
        imports: [MdbCalendarModule, NoopAnimationsModule],
        declarations: [OptionsCalendarComponent],
      });
      fixture = TestBed.createComponent(OptionsCalendarComponent);
      component = fixture.componentInstance;
      element = fixture.nativeElement;
      fixture.detectChanges();

      const weekdays = document.querySelectorAll('.month thead tr th');
      const toolsBtns = document.querySelectorAll('.calendar-tools button');
      const activeMonth = document.querySelector('.calendar-heading');

      weekdays.forEach((el, index) => {
        expect(el.textContent.trim()).toBe(captions.weekdays[index]);
      });

      expect(toolsBtns[2].textContent.trim()).toBe(captions.todayCaption);
      expect(toolsBtns[3].textContent.trim()).toBe(captions.monthCaption);
      expect(toolsBtns[4].textContent.trim()).toBe(captions.weekCaption);
      expect(toolsBtns[5].textContent.trim()).toBe(captions.listCaption);

      expect(activeMonth.textContent.trim()).toBe(
        `${captions.months[new Date().getMonth()]} ${new Date().getFullYear()}`
      );

      const dayEl = document.querySelector('table tbody tr td') as HTMLElement;
      dayEl.click();

      fixture.detectChanges();
      flush();

      const modalTitle = document.querySelector('.modal-header .modal-title');
      const modalSummaryLabel = document.querySelector('label[for="eventModalSummary"]');
      const modalDescriptionLabel = document.querySelector('label[for="eventModalDescription"]');
      const modalAllDayCheckboxLabel = document.querySelector(
        'label[for="eventModalAllDayCheckbox"]'
      );
      const modalStartDateLabel = document.querySelector('label[for="eventModalStartDate"]');
      const modalEndDateLabel = document.querySelector('label[for="eventModalEndDate"]');
      const modalBtns = document.querySelectorAll('.modal-footer button');

      expect(modalTitle.textContent.trim()).toBe(captions.addEventModalCaption);
      expect(modalSummaryLabel.textContent.trim()).toBe(captions.summaryCaption);
      expect(modalDescriptionLabel.textContent.trim()).toBe(captions.descriptionCaption);
      expect(modalAllDayCheckboxLabel.textContent.trim()).toBe(captions.allDayCaption);
      expect(modalStartDateLabel.textContent.trim()).toBe(captions.startCaption);
      expect(modalEndDateLabel.textContent.trim()).toBe(captions.endCaption);
      expect(modalBtns[0].textContent.trim()).toBe(captions.closeCaption);
      expect(modalBtns[1].textContent.trim()).toBe(captions.addCaption);

      const closeBtn = document.querySelector('.btn-close') as HTMLElement;
      closeBtn.click();

      fixture.detectChanges();
      flush();

      const event = document.querySelector('.event') as HTMLElement;
      event.click();

      fixture.detectChanges();
      flush();

      const eventModalTitle = document.querySelector('.modal-header .modal-title');
      const eventModalSummaryLabel = document.querySelector('label[for="eventModalSummary"]');
      const eventModalDescriptionLabel = document.querySelector(
        'label[for="eventModalDescription"]'
      );
      const eventModalAllDayCheckboxLabel = document.querySelector(
        'label[for="eventModalAllDayCheckbox"]'
      );
      const eventModalStartDateLabel = document.querySelector('label[for="eventModalStartDate"]');
      const eventModalEndDateLabel = document.querySelector('label[for="eventModalEndDate"]');
      const eventModalStartTimeLabel = document.querySelector('label[for="eventModalStartTime"]');
      const eventModalEndTimeLabel = document.querySelector('label[for="eventModalEndTime"]');
      const eventModalBtns = document.querySelectorAll('.modal-footer button');

      expect(eventModalTitle.textContent.trim()).toBe(captions.editEventModalCaption);
      expect(eventModalSummaryLabel.textContent.trim()).toBe(captions.summaryCaption);
      expect(eventModalDescriptionLabel.textContent.trim()).toBe(captions.descriptionCaption);
      expect(eventModalAllDayCheckboxLabel.textContent.trim()).toBe(captions.allDayCaption);
      expect(eventModalStartDateLabel.textContent.trim()).toBe(captions.startCaption);
      expect(eventModalEndDateLabel.textContent.trim()).toBe(captions.endCaption);
      expect(eventModalBtns[0].textContent.trim()).toBe(captions.deleteCaption);
      expect(eventModalBtns[1].textContent.trim()).toBe(captions.editCaption);
      expect(eventModalStartTimeLabel.textContent.trim()).toBe(captions.startCaption);
      expect(eventModalEndTimeLabel.textContent.trim()).toBe(captions.endCaption);
    }));

    it('should set mondayFirst', () => {
      let fixture: ComponentFixture<MondayFirstCalendarComponent>;
      let element: any;
      let component: any;

      TestBed.configureTestingModule({
        imports: [MdbCalendarModule, NoopAnimationsModule],
        declarations: [MondayFirstCalendarComponent],
      });
      fixture = TestBed.createComponent(MondayFirstCalendarComponent);
      component = fixture.componentInstance;
      element = fixture.nativeElement;
      fixture.detectChanges();

      const weekdays = document.querySelector('.month thead tr th');

      expect(weekdays.textContent.trim()).toBe('Mon');
    });

    it('should set defaultView', () => {
      let fixture: ComponentFixture<DefaultViewCalendarComponent>;
      let element: any;
      let component: any;

      TestBed.configureTestingModule({
        imports: [MdbCalendarModule, NoopAnimationsModule],
        declarations: [DefaultViewCalendarComponent],
      });
      fixture = TestBed.createComponent(DefaultViewCalendarComponent);
      component = fixture.componentInstance;
      element = fixture.nativeElement;
      fixture.detectChanges();

      const calendarTable = document.querySelector('table');

      expect(calendarTable.classList.contains('month')).not.toBe(true);
      expect(calendarTable.classList.contains('list')).not.toBe(true);
    });

    it('should set defaultDate', () => {
      let fixture: ComponentFixture<DefaultDateCalendarComponent>;
      let element: any;
      let component: any;

      TestBed.configureTestingModule({
        imports: [MdbCalendarModule, NoopAnimationsModule],
        declarations: [DefaultDateCalendarComponent],
      });
      fixture = TestBed.createComponent(DefaultDateCalendarComponent);
      component = fixture.componentInstance;
      element = fixture.nativeElement;
      fixture.detectChanges();

      const calendarHead = document.querySelector('.calendar-heading');

      expect(calendarHead.textContent).toBe('November 2020');
    });
  });

  describe('onClick', () => {
    let fixture: ComponentFixture<DefaultCalendarComponent>;
    let element: any;
    let component: any;

    function createComponent<T>(
      component: Type<T>,
      providers: Provider[] = []
    ): ComponentFixture<T> {
      TestBed.configureTestingModule({
        imports: [MdbCalendarModule],
        declarations: [component],
        providers: [...providers],
      });

      TestBed.compileComponents();

      return TestBed.createComponent<T>(component);
    }

    beforeEach(() => {
      fixture = createComponent(DefaultCalendarComponent);
      fixture.detectChanges();
      component = fixture.componentInstance;
      element = fixture.nativeElement;
    });

    it('should open modal on day click', fakeAsync(() => {
      const dayEl = document.querySelector('table tbody tr td') as HTMLElement;
      dayEl.click();

      fixture.detectChanges();
      flush();

      const modal = document.querySelector('.modal');

      expect(modal).not.toBeFalsy();
    }));

    it('should open modal on event click', fakeAsync(() => {
      const dayEl = document.querySelector('table tbody tr td') as HTMLElement;
      dayEl.click();

      fixture.detectChanges();
      flush();

      const modal = document.querySelector('.event');

      expect(modal).not.toBeFalsy();
    }));

    it('should change view', fakeAsync(() => {
      const toolsBtns = document.querySelectorAll('.calendar-tools button');
      const monthBtn = toolsBtns[3] as HTMLElement;
      const weekBtn = toolsBtns[4] as HTMLElement;
      const listBtn = toolsBtns[5] as HTMLElement;

      weekBtn.click();
      fixture.detectChanges();
      flush();

      expect(document.querySelector('.month')).toBeFalsy();
      expect(document.querySelector('.list')).toBeFalsy();

      monthBtn.click();
      fixture.detectChanges();
      flush();

      expect(document.querySelector('.month')).not.toBeFalsy();
      expect(document.querySelector('.list')).toBeFalsy();

      listBtn.click();
      fixture.detectChanges();
      flush();

      expect(document.querySelector('.month')).toBeFalsy();
      expect(document.querySelector('.list')).not.toBeFalsy();
    }));

    it('should change month', fakeAsync(() => {
      const toolsBtns = document.querySelectorAll('.calendar-tools button');
      const prevBtn = toolsBtns[0] as HTMLElement;
      const nextBtn = toolsBtns[1] as HTMLElement;
      const todayBtn = toolsBtns[2] as HTMLElement;
      const months = [
        'January',
        'February',
        'March',
        'April',
        'May',
        'June',
        'July',
        'August',
        'September',
        'October',
        'November',
        'December',
      ];

      prevBtn.click();
      fixture.detectChanges();
      flush();

      let calendarHeading = document.querySelector('.calendar-heading');

      expect(calendarHeading.textContent).toBe(
        `${months[new Date().getMonth() - 1]} ${new Date().getFullYear()}`
      );

      todayBtn.click();
      fixture.detectChanges();
      flush();

      calendarHeading = document.querySelector('.calendar-heading');

      expect(calendarHeading.textContent).toBe(
        `${months[new Date().getMonth()]} ${new Date().getFullYear()}`
      );

      nextBtn.click();
      fixture.detectChanges();
      flush();

      calendarHeading = document.querySelector('.calendar-heading');

      expect(calendarHeading.textContent).toBe(
        `${months[new Date().getMonth() + 1]} ${new Date().getFullYear()}`
      );
    }));
  });
});
