export interface MdbCalendarEvent {
  id?: string;
  order?: number;
  summary: string;
  startDate: Date | string;
  endDate: Date | string;
  startData?: {
    date: string;
    day: number | string;
    month: number | string;
    string: string;
    time: string;
    year: number;
  };
  endData?: {
    date: string;
    day: number | string;
    month: number | string;
    string: string;
    time: string;
    year: number;
  };
  eventStart?: boolean;
  eventEnd?: boolean;
  description?: string;
  longEvent?: boolean;
  color: {
    background: string;
    foreground?: 'white';
  };
  allDay?: boolean;
  oneDay?: boolean;
}
