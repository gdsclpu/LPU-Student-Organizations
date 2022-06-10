import {
  getDate,
  getYear,
  getMonth,
  getDayNumber,
  getDaysInMonth,
  getMonthEnd,
  getToday,
  addYears,
  addMonths,
  addDays,
  createDate,
  isDateDisabled,
  isSameDate,
  getStartYear,
  getYearsOffset,
  areDatesInSameView,
  isValidDate,
} from './datepicker-utils';

describe('Date utils', () => {
  it('should return day of the month', () => {
    expect(getDate(new Date(2020, 5, 26))).toBe(26);
  });

  it('should return year', () => {
    expect(getYear(new Date(2020, 5, 26))).toBe(2020);
  });

  it('should return month', () => {
    expect(getMonth(new Date(2020, 5, 26))).toBe(5);
  });

  it('should return day of the week index', () => {
    expect(getDayNumber(new Date(2020, 5, 26))).toBe(5);
  });

  it('should return number of days in the month', () => {
    expect(getDaysInMonth(new Date(2020, 7, 15))).toEqual(31);
  });

  it('should return date of the last day of the month', () => {
    expect(getMonthEnd(new Date(2020, 5, 26))).toEqual(new Date(2020, 5, 30));
  });

  it('should return current date', () => {
    expect(isSameDate(getToday(), new Date())).toBe(true);
  });

  it('should add or remove one year', () => {
    expect(addYears(new Date(2020, 6, 15), 1)).toEqual(new Date(2021, 6, 15));
    expect(addYears(new Date(2020, 6, 15), -1)).toEqual(new Date(2019, 6, 15));
  });

  it('should add or remove one month', () => {
    expect(addMonths(new Date(2020, 6, 15), 1)).toEqual(new Date(2020, 7, 15));
    expect(addMonths(new Date(2020, 6, 15), -1)).toEqual(new Date(2020, 5, 15));
  });

  it('should add or remove one day', () => {
    expect(addDays(new Date(2020, 6, 15), 1)).toEqual(new Date(2020, 6, 16));
    expect(addDays(new Date(2020, 6, 15), -1)).toEqual(new Date(2020, 6, 14));
  });

  it('should create date', () => {
    expect(createDate(2020, 6, 15)).toEqual(new Date(2020, 6, 15));
  });

  it('should correctly convert years when creating date for years between 0 and 100', () => {
    expect(createDate(57, 6, 15).getFullYear()).toEqual(57);
  });

  it('should return true if date is disabled and false if date is enabled', () => {
    const minDate = new Date(2020, 1, 15);
    const maxDate = new Date(2020, 9, 15);
    const beforeMinDate = new Date(2020, 1, 10);
    const afterMaxDate = new Date(2020, 9, 25);
    const enabledDate = new Date(2020, 7, 28);
    const disabledDate = new Date(2020, 6, 17);
    const filter = (date) => {
      return date > new Date(2020, 7, 20);
    };

    expect(isDateDisabled(beforeMinDate, minDate, maxDate, filter)).toBe(true);
    expect(isDateDisabled(afterMaxDate, minDate, maxDate, filter)).toBe(true);
    expect(isDateDisabled(disabledDate, minDate, maxDate, filter)).toBe(true);
    expect(isDateDisabled(enabledDate, minDate, maxDate, filter)).toBe(false);
  });

  it('should return true if date is valid date object', () => {
    expect(isValidDate(new Date(2025, 2, 5))).toBe(true);
    expect(isValidDate(new Date(NaN))).toBe(false);
  });

  it('should return true if both dates are equal', () => {
    const date1 = new Date(2020, 7, 25);
    const date2 = new Date(2020, 5, 19);

    expect(isSameDate(date1, date1)).toBe(true);
    expect(isSameDate(date1, date2)).toBe(false);
  });

  it('should return start year for min and max date and number of years in the view', () => {
    const yearsInView = 24;
    const minDate = new Date(2020, 4, 15);
    const maxDate = new Date(2045, 6, 25);

    expect(getStartYear(yearsInView, minDate, maxDate)).toEqual(2022);
  });

  it('should return correct years offset for specific date and number of years in view', () => {
    const date = new Date(2020, 5, 14);
    const yearsInView = 24;
    const minDate = null;
    const maxDate = null;
    expect(getYearsOffset(date, yearsInView, minDate, maxDate)).toEqual(4);
  });

  it('should return true if two dates are in the same view', () => {
    const date1 = new Date(2020, 8, 15);
    const date2 = new Date(2020, 8, 4);
    const date3 = new Date(2021, 9, 3);
    const date4 = new Date(2059, 9, 17);
    const yearsInView = 24;
    const minDate = new Date(2020, 1, 1);
    const maxDate = new Date(2060, 5, 15);
    const dayView = 'days';
    const yearsView = 'years';
    const monthsView = 'months';

    expect(areDatesInSameView(date1, date2, dayView, yearsInView, minDate, maxDate)).toBe(true);
    expect(areDatesInSameView(date1, date3, dayView, yearsInView, minDate, maxDate)).toBe(false);
    expect(areDatesInSameView(date1, date2, yearsView, yearsInView, minDate, maxDate)).toBe(true);
    expect(areDatesInSameView(date1, date4, yearsView, yearsInView, minDate, maxDate)).toBe(false);
    expect(areDatesInSameView(date1, date2, monthsView, yearsInView, minDate, maxDate)).toBe(true);
    expect(areDatesInSameView(date1, date3, monthsView, yearsInView, minDate, maxDate)).toBe(false);
  });
});
