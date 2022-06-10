export function getDate(date: Date): number {
  return date.getDate();
}

export function getDayNumber(date: Date): number {
  return date.getDay();
}

export function getMonth(date: Date): number {
  return date.getMonth();
}

export function getYear(date: Date): number {
  return date.getFullYear();
}

export function getFirstDayOfWeek(year: number, month: number, startDay: number): number {
  const firstDayIndex = startDay;
  const sundayIndex = firstDayIndex > 0 ? 7 - firstDayIndex : 0;
  const date = new Date(year, month);
  const index = date.getDay() + sundayIndex;
  const newIndex = index >= 7 ? index - 7 : index;
  return newIndex;
}

export function getDaysInMonth(date: Date): number {
  return getMonthEnd(date).getDate();
}

export function getMonthEnd(date: Date): Date {
  return createDate(date.getFullYear(), date.getMonth() + 1, 0);
}

export function getToday(): Date {
  return new Date();
}

export function addYears(date: Date, years: number): Date {
  return addMonths(date, years * 12);
}

export function addMonths(date: Date, months: number): Date {
  const month = createDate(date.getFullYear(), date.getMonth() + months, date.getDate());
  const dayOfPreviousMonth = getDate(date);
  const dayOfNewMonth = getDate(month);

  // Solution for edge cases, like moving from a month with a greater number
  // of days than the destination month. For example, when we move from 31 Mar 2020 to
  // February, createDate(2020, 2, 31) will return 2 Mar 2020, not the desired 29 Feb 2020.
  // We need to use setDate(0) to move back to the last day of the previous month (29 Feb 2020)
  if (dayOfPreviousMonth !== dayOfNewMonth) {
    month.setDate(0);
  }

  return month;
}

export function addDays(date: Date, days: number): Date {
  return createDate(date.getFullYear(), date.getMonth(), date.getDate() + days);
}

export function createDate(year: number, month: number, day: number): Date {
  const result = new Date(year, month, day);

  // In js native date years from 0 to 99 are treated as abbreviation
  // for dates like 19xx
  if (year >= 0 && year < 100) {
    result.setFullYear(result.getFullYear() - 1900);
  }
  return result;
}

export function convertStringToDate(dateString: string): Date {
  const dateArr = dateString.split('-');
  const year = Number(dateArr[0]);
  const month = Number(dateArr[1]);
  const day = Number(dateArr[2]);

  return createDate(year, month, day);
}

export function isValidDate(date: Date): boolean {
  return !Number.isNaN(date.getTime());
}

export function compareDates(date1: Date, date2: Date): number {
  return (
    getYear(date1) - getYear(date2) ||
    getMonth(date1) - getMonth(date2) ||
    getDate(date1) - getDate(date2)
  );
}

export function isSameDate(date1: Date, date2: Date): boolean {
  date1.setHours(0, 0, 0, 0);
  date2.setHours(0, 0, 0, 0);

  return date1.getTime() === date2.getTime();
}

export function getYearsOffset(
  activeDate: Date,
  yearsInView: number,
  minDate: Date,
  maxDate: Date
): number {
  const activeYear = getYear(activeDate);
  const yearsDifference = activeYear - getStartYear(yearsInView, minDate, maxDate);
  return modulo(yearsDifference, yearsInView);
}

function modulo(a: number, b: number): number {
  return ((a % b) + b) % b;
}

export function getStartYear(yearsInView: number, minDate: Date, maxDate: Date): number {
  let startYear = 0;

  if (maxDate) {
    const maxYear = getYear(maxDate);
    startYear = maxYear - yearsInView + 1;
  } else if (minDate) {
    startYear = getYear(minDate);
  }

  return startYear;
}

export function isDateDisabled(date: Date, minDate: Date, maxDate: Date, filter: any): boolean {
  const isBeforeMin = minDate && compareDates(date, minDate) <= 0;
  const isAfterMax = maxDate && compareDates(date, maxDate) >= 0;

  const isDisabled = filter && filter(date) === false;

  return isBeforeMin || isAfterMax || isDisabled;
}

export function isMonthDisabled(
  month: number,
  year: number,
  minDate: Date,
  maxDate: Date
): boolean {
  const maxYear = maxDate && getYear(maxDate);
  const maxMonth = maxDate && getMonth(maxDate);
  const minYear = minDate && getYear(minDate);
  const minMonth = minDate && getMonth(minDate);

  const isMonthAndYearAfterMax =
    maxMonth && maxYear && (year > maxYear || (year === maxYear && month > maxMonth));

  const isMonthAndYearBeforeMin =
    minMonth && minYear && (year < minYear || (year === minYear && month < minMonth));

  return isMonthAndYearAfterMax || isMonthAndYearBeforeMin;
}

export function isYearDisabled(year: number, minDate: Date, maxDate: Date): boolean {
  const min = minDate && getYear(minDate);
  const max = maxDate && getYear(maxDate);

  const isAfterMax = max && year > max;
  const isBeforeMin = min && year < min;

  return isAfterMax || isBeforeMin;
}

export function isNextDateDisabled(
  activeDate: Date,
  view: string,
  yearsInView: number,
  minDate: Date,
  maxDate: Date
): boolean {
  return maxDate && areDatesInSameView(activeDate, maxDate, view, yearsInView, minDate, maxDate);
}

export function isPreviousDateDisabled(
  activeDate: Date,
  view: string,
  yearsInView: number,
  minDate: Date,
  maxDate: Date
): boolean {
  return minDate && areDatesInSameView(activeDate, minDate, view, yearsInView, minDate, maxDate);
}

export function areDatesInSameView(
  date1: Date,
  date2: Date,
  view: string,
  yearsInView: number,
  minDate: Date,
  maxDate: Date
): boolean {
  if (view === 'days') {
    return getYear(date1) === getYear(date2) && getMonth(date1) === getMonth(date2);
  }

  if (view === 'months') {
    return getYear(date1) === getYear(date2);
  }

  if (view === 'years') {
    const startYear = getStartYear(yearsInView, minDate, maxDate);

    return (
      Math.floor((getYear(date1) - startYear) / yearsInView) ===
      Math.floor((getYear(date2) - startYear) / yearsInView)
    );
  }

  return false;
}
