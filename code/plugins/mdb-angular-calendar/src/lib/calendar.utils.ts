import { MdbCalendarEvent } from './calendar.event.interface';

const MS_IN_DAY = 24 * 60 * 60 * 1000;
const MS_IN_HOUR = 1000 * 60 * 60;

export function getToday(): Date {
  return new Date();
}

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

export function getDaysInMonth(date: Date): number {
  return getMonthEnd(date).getDate();
}

export function getMonthEnd(date: Date): Date {
  return createDate(date.getFullYear(), date.getMonth() + 1, 0, 23, 59, 59, 999);
}

export function differenceInDays(dateStart: Date, dateEnd: Date) {
  return Math.floor((dateEnd.getTime() - dateStart.getTime()) / MS_IN_DAY);
}

export function differenceInHours(dateStart: Date, dateEnd: Date) {
  return Math.floor((dateEnd.getTime() - dateStart.getTime()) / MS_IN_HOUR);
}

export function isSameDate(date1: Date, date2: Date): boolean {
  date1.setHours(0, 0, 0, 0);
  date2.setHours(0, 0, 0, 0);

  return date1.getTime() === date2.getTime();
}

export function getFirstDayOfWeek(year: number, month: number, mondayFirst: boolean): number {
  const firstDayIndex = mondayFirst ? 1 : 0;
  const sundayIndex = firstDayIndex > 0 ? 7 - firstDayIndex : 0;
  const date = new Date(year, month);
  const index = getDayNumber(date) + sundayIndex;
  const newIndex = index >= 7 ? index - 7 : index;
  return newIndex;
}

export function addMonths(date: Date, months: number): Date {
  const month = createDate(
    date.getFullYear(),
    date.getMonth() + months,
    date.getDate(),
    date.getHours(),
    date.getMinutes(),
    date.getSeconds(),
    date.getMilliseconds()
  );
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
  return createDate(
    date.getFullYear(),
    date.getMonth(),
    date.getDate() + days,
    date.getHours(),
    date.getMinutes(),
    date.getSeconds(),
    date.getMilliseconds()
  );
}

export function addHours(date: Date, hours: number): Date {
  const currentHour = date.getHours();
  return new Date(date.setHours(currentHour + hours));
}

export function addMinutes(date: Date, minutes: number): Date {
  const currentMinutes = date.getMinutes();
  return new Date(date.setMinutes(currentMinutes + minutes));
}

export function startOfDay(date: Date): Date {
  return new Date(date.setHours(0, 0, 0, 0));
}

export function endOfDay(date: Date): Date {
  return new Date(date.setHours(23, 59, 59, 999));
}

export function createDate(
  year: number,
  month: number,
  day: number,
  hours: number,
  minutes: number,
  seconds: number,
  milliseconds: number
): Date {
  const result = new Date(year, month, day, hours, minutes, seconds, milliseconds);

  // In js native date years from 0 to 99 are treated as abbreviation
  // for dates like 19xx
  if (year >= 0 && year < 100) {
    result.setFullYear(result.getFullYear() - 1900);
  }
  return result;
}

export function format(dateToFormat: Date) {
  let month: number | string = getMonth(new Date(dateToFormat)) + 1;
  let day: number | string = getDate(new Date(dateToFormat));
  let hours: number | string = new Date(dateToFormat).getHours();
  let minutes: number | string = new Date(dateToFormat).getMinutes();

  if (month < 10) {
    month = '0' + month;
  }

  if (day < 10) {
    day = '0' + day;
  }

  if (minutes < 10) {
    minutes = '0' + minutes;
  }

  if (hours < 10) {
    hours = '0' + hours;
  }

  let time = `${hours}:${minutes}`;

  const year = getYear(new Date(dateToFormat));
  const date = `${day}/${month}/${year}`;
  const shouldReturnTime = time !== '00:00' && time !== '23:59';
  const string = shouldReturnTime ? `${date} ${time}` : `${date}`;

  return { day, month, year, time, string, date };
}

export function convertDateTo24h(dateTime: string): string {
  let [date, time, modifier] = dateTime.split(' ');
  time = convertTimeTo24h(`${time} ${modifier}`);

  return `${date} ${time}`;
}

export function convertDateTo12h(dateTime: string): string {
  let [date, time] = dateTime.split(' ');

  if (time) {
    time = convertTimeTo12h(time);
  }

  return time ? `${date} ${time}` : `${date}`;
}

export function convertTimeTo24h(timeToFormat: string): string {
  let [time, modifier] = timeToFormat.split(' ');
  let [hours, minutes] = time.split(':');

  if (hours === '12') {
    hours = '00';
  }

  if (modifier === 'PM') {
    hours = `${parseInt(hours, 10) + 12}`;
  }

  return `${hours}:${minutes}`;
}

export function convertTimeTo12h(timeToFormat: string): string {
  let hours;
  let minutes;
  let modifier = 'AM';

  [hours, minutes] = timeToFormat.split(':');

  if (hours === '00') {
    hours = 12;
  } else if (hours > 12) {
    hours -= 12;
    hours = hours < 10 ? '0' + hours : hours;
    modifier = 'PM';
  } else if (hours === 12) {
    modifier = 'PM';
  }

  return `${hours}:${minutes} ${modifier}`;
}

export function getEvents(
  events: MdbCalendarEvent[],
  startDate: Date,
  endDate: Date,
  hourEvent = false
): MdbCalendarEvent[] {
  if (!events) {
    return;
  }

  let filteredEvents = filterEvents(events, startDate, endDate).sort((a, b) => {
    const aStartDate = a.startDate as Date;
    const bStartDate = b.startDate as Date;

    return aStartDate.getTime() - bStartDate.getTime();
  });

  let result = mapEvents(filteredEvents, startDate, endDate);

  if (hourEvent) {
    return result.filter((event) => !event.allDay && !event.longEvent);
  }

  return result;
}

export function filterEvents(events: any, startDate: Date, endDate: Date): MdbCalendarEvent[] {
  return events.filter((event: any) => {
    if (event.startDate >= startDate && event.endDate <= endDate) {
      return true;
    }

    if (event.endDate >= startDate && event.endDate <= endDate) {
      return true;
    }

    if (event.startDate <= startDate && event.endDate >= endDate) {
      return true;
    }

    if (event.startDate >= startDate && event.startDate <= endDate) {
      return true;
    }

    return false;
  });
}

export function mapEvents(
  events: MdbCalendarEvent[],
  startDate: Date,
  endDate: Date
): MdbCalendarEvent[] {
  let order = 1;

  events.forEach((event: MdbCalendarEvent) => {
    const eventStart = (event.startDate as Date) >= startDate;

    if (eventStart) {
      event.order = order;
      order += 1;
    } else {
      order = event.order + 1;
    }
  });

  return events.map((event: MdbCalendarEvent) => {
    const startData = format(event.startDate as Date);
    const endData = format(event.endDate as Date);
    const eventStartDate = event.startDate as Date;
    const eventEndDate = event.endDate as Date;
    const eventDuration = differenceInDays(eventStartDate, eventEndDate as Date);

    return {
      ...event,
      startData: startData,
      endData: endData,
      eventStart: eventStartDate >= startDate,
      eventEnd: event.endDate <= endDate,
      oneDay:
        startData.date == endData.date &&
        eventEndDate.getTime() - eventStartDate.getTime() < MS_IN_DAY,
      allDay:
        eventEndDate.getTime() - eventStartDate.getTime() - eventDuration * MS_IN_DAY ==
        MS_IN_DAY - 1,
      longEvent: eventEndDate.getTime() - eventStartDate.getTime() >= MS_IN_DAY,
    };
  });
}

export function generateEvent(selectionStartDate: Date, selectionEndDate?: Date): MdbCalendarEvent {
  let startDate = selectionStartDate;
  let endDate = selectionStartDate;

  if (selectionEndDate) {
    startDate = selectionStartDate < selectionEndDate ? selectionStartDate : selectionEndDate;
    endDate = selectionStartDate > selectionEndDate ? selectionStartDate : selectionEndDate;
  }

  const eventDuration = differenceInDays(startDate, endDate);
  const isAllDayEvent = endDate.getTime() - startDate.getTime() - eventDuration * MS_IN_DAY === 0;

  if (isAllDayEvent) {
    startDate = startOfDay(startDate);
    endDate = endOfDay(endDate);
  }

  const newEvent = {
    id: generateUid(),
    summary: '',
    startDate,
    endDate,
    startData: format(startDate),
    endData: format(endDate),
    description: '',
    allDay: isAllDayEvent,
    color: {
      background: 'primary',
    },
  };

  return newEvent;
}

export function generateUid(): string {
  const uid = Math.random().toString(36).substr(2, 9);
  return `mdb-calendar-event-${uid}`;
}
