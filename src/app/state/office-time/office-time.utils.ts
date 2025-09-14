import { HttpClient } from '@angular/common/http';
import { map } from 'rxjs';
import dayjs, { Dayjs } from 'dayjs';

export const loadHolidays = (http: HttpClient) => {
  const currentYear = new Date().getFullYear();
  return http
    .get<
      Record<string, { datum: string }>
    >(`assets/holidays/${currentYear}-BE.json`)
    .pipe(map((holidays) => parseHolidays(holidays)));
};

const parseHolidays = (holidays?: Record<string, { datum: string }>) => {
  const _holidays: Record<string, Dayjs> = {};
  for (const key in holidays) {
    const date = holidays[key].datum;
    _holidays[key] = dayjs(date);
  }
  return _holidays;
};

export const getWorkDaysForYear = (holidays?: Record<string, Dayjs>) => {
  const start = dayjs().startOf('year');
  const end = start.endOf('year');
  return countWorkDaysBetween(start, end, holidays);
};
export const getWorkDaysForMonth = (holidays?: Record<string, Dayjs>) => {
  const start = dayjs().startOf('month');
  const end = start.endOf('month');
  return countWorkDaysBetween(start, end, holidays);
};
const getHoliday = (
  current: dayjs.Dayjs,
  holidays: Record<string, dayjs.Dayjs> | undefined
) => {
  let holiday: { name: string; date: Dayjs } | undefined = undefined;
  for (const aHoliday in holidays) {
    const holidayDate = holidays[aHoliday];
    holiday =
      holiday ??
      (current.isSame(holidayDate, 'day')
        ? { name: aHoliday, date: holidayDate }
        : undefined);
  }
  return holiday;
};

const getHolidaysBetween = (
  start: dayjs.Dayjs,
  end: dayjs.Dayjs,
  holidays: Record<string, dayjs.Dayjs> | undefined
) => {
  const result: { name: string; date: Dayjs }[] = [];
  let current = start;
  while (current.isBefore(end) || current.isSame(end)) {
    const holiday = getHoliday(current, holidays);
    if (holiday) {
      result.push(holiday);
    }
    current = current.add(1, 'day');
  }
  return result;
};

export const getHolidaysForMonth = (holidays?: Record<string, Dayjs>) => {
  const start = dayjs().startOf('month');
  const end = start.endOf('month');

  return getHolidaysBetween(start, end, holidays);
};

export const getHolidaysForYear = (holidays?: Record<string, Dayjs>) => {
  const start = dayjs().startOf('year');
  const end = start.endOf('year');

  return getHolidaysBetween(start, end, holidays);
};

export const getRemainingWorkDaysForYear = (
  holidays?: Record<string, Dayjs>
) => {
  const start = dayjs().startOf('day');
  const end = start.endOf('year');
  return countWorkDaysBetween(start, end, holidays);
};

export const countWorkDaysBetween = (
  start: dayjs.Dayjs,
  end: dayjs.Dayjs,
  holidays?: Record<string, Dayjs>
) => {
  let workDays = 0;
  let current = start;
  while (current.isBefore(end) || current.isSame(end)) {
    if (!isHolidayOrWeekend(current, holidays)) {
      workDays++;
    }
    current = current.add(1, 'day');
  }
  return workDays;
};

export const isHolidayOrWeekend = (
  current: Dayjs,
  holidays?: Record<string, Dayjs>
) => {
  const day = current.day();
  const isSunday = day === 0;
  const isSaturday = day === 6;
  let isHoliday = !!getHoliday(current, holidays);
  return isSunday || isSaturday || isHoliday;
};
