import {
  startOfMonth,
  endOfMonth,
  eachDayOfInterval,
  startOfWeek,
  endOfWeek,
  isSameDay,
  isSameMonth,
  isToday,
  addMonths,
  subMonths,
  format,
  isWithinInterval,
  parseISO,
} from 'date-fns';

export function getDaysInMonth(date: Date): Date[] {
  const start = startOfWeek(startOfMonth(date));
  const end = endOfWeek(endOfMonth(date));
  return eachDayOfInterval({ start, end });
}

export function isDateInRange(date: Date, start: Date | null, end: Date | null): boolean {
  if (!start || !end) return false;
  const [rangeStart, rangeEnd] = start <= end ? [start, end] : [end, start];
  return isWithinInterval(date, { start: rangeStart, end: rangeEnd });
}

export function isDateRangeStart(date: Date, start: Date | null, end: Date | null): boolean {
  if (!start) return false;
  const [rangeStart] = start <= (end || start) ? [start, end] : [end, start];
  return isSameDay(date, rangeStart!);
}

export function isDateRangeEnd(date: Date, start: Date | null, end: Date | null): boolean {
  if (!start) return false;
  const [, rangeEnd] = start <= (end || start) ? [start, end] : [end, start];
  return isSameDay(date, rangeEnd || start);
}

export function formatDateRange(start: Date | null, end: Date | null): string {
  if (!start) return 'Select dates';
  if (!end) return format(start, 'MMM d');
  return `${format(start, 'MMM d')} → ${format(end, 'MMM d')}`;
}

export function getWeeks(date: Date): Date[][] {
  const days = getDaysInMonth(date);
  const weeks: Date[][] = [];
  for (let i = 0; i < days.length; i += 7) {
    weeks.push(days.slice(i, i + 7));
  }
  return weeks;
}

export function isDateHoliday(date: Date, holidays: { date: Date; name: string }[]): string | null {
  const holiday = holidays.find(h => isSameDay(h.date, date));
  return holiday ? holiday.name : null;
}

export function nextMonth(date: Date): Date {
  return addMonths(date, 1);
}

export function prevMonth(date: Date): Date {
  return subMonths(date, 1);
}

export function getMonthYear(date: Date): string {
  return format(date, 'MMMM yyyy');
}

export function getMonthDayYear(date: Date): string {
  return format(date, 'EEEE, MMMM d, yyyy');
}

export function saveDateToLocalStorage(key: string, date: Date | null): void {
  if (date) {
    localStorage.setItem(key, date.toISOString());
  } else {
    localStorage.removeItem(key);
  }
}

export function loadDateFromLocalStorage(key: string): Date | null {
  const stored = localStorage.getItem(key);
  return stored ? new Date(stored) : null;
}
