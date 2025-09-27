import dayjs, { Dayjs } from 'dayjs';
import { DashboardStats, IOfficeTimeState } from '../../@types/types';
import quarterOfYear from 'dayjs/plugin/quarterOfYear';

dayjs.extend(quarterOfYear);

type TimePeriod = 'year' | 'quarter' | 'month' | 'week';

export const getWorkdays = (
  type: TimePeriod,
  holidays: Dayjs[],
  freedays: Dayjs[]
) => {
  const start = dayjs().startOf(type);
  const end = start.endOf(type);
  return daysBetween(
    start,
    end,
    (current) => !isHolidayOrFreeday(current, holidays, freedays)
  );
};

export const getOfficedays = (type: TimePeriod, officedays: Dayjs[]) => {
  const start = dayjs().startOf(type);
  const end = start.endOf(type);
  return daysBetween(start, end, isOfficeDay, officedays ?? []);
};
export const getFreedays = (type: TimePeriod, freedays: Dayjs[]) => {
  const start = dayjs().startOf(type);
  const end = start.endOf(type);
  return daysBetween(start, end, (current) => isFreeday(current, freedays));
};

export const getHolidays = (
  type: TimePeriod,
  holidays: Record<string, Dayjs>
) => {
  const holidayDays = Object.values(holidays);
  const start = dayjs().startOf(type);
  const end = start.endOf(type);
  return daysBetween(start, end, (current) => isHoliday(current, holidayDays));
};
export const getRemainingWorkdays = (
  unit: TimePeriod,
  holidays: Dayjs[],
  freedays: Dayjs[]
) => {
  const start = dayjs().startOf('day');
  const end = start.endOf(unit);
  return daysBetween(
    start,
    end,
    (current) => !isHolidayOrFreeday(current, holidays, freedays)
  );
};

const allDaysBetween = (start: Dayjs, end: Dayjs) => {
  const days: Dayjs[] = [];
  let current = start;
  while (current.isBefore(end) || current.isSame(end)) {
    days.push(current.clone());
    current = current.add(1, 'day');
  }
  return days;
};

const daysBetween = (
  start: Dayjs,
  end: Dayjs,
  condition: (current: Dayjs) => boolean,
  options?: Dayjs[]
) => {
  const days = options ?? allDaysBetween(start, end);
  return days.filter(
    (current) =>
      (current.isAfter(start, 'day') || current.isSame(start, 'day')) &&
      (current.isBefore(end, 'day') || current.isSame(end, 'day')) &&
      condition(current)
  );
};

export const isFreeday = (current: Dayjs, freedays: Dayjs[]) => {
  return !!freedays?.some((freeday) => freeday.isSame(current, 'day'));
};

export const isHoliday = (current: Dayjs, holidays: Dayjs[]) => {
  return !!holidays?.some((holiday) => holiday.isSame(current, 'day'));
};

export const isHolidayOrFreeday = (
  current: Dayjs,
  holidays: Dayjs[],
  freedays: Dayjs[]
) => {
  return (
    isWeekend(current) ||
    isFreeday(current, freedays) ||
    isHoliday(current, holidays)
  );
};
export const isWeekend = (current: Dayjs) => {
  const day = current.day();
  const isSunday = day === 0;
  const isSaturday = day === 6;
  return isSunday || isSaturday;
};

export const isOfficeDay = (current: Dayjs, officeDays?: Array<Dayjs>) => {
  return !!officeDays?.find((officeday) => officeday.isSame(current, 'day'));
};

export const getPercentage = (officeDays: number, workDays: number) => {
  // we consider 50% as the goal for the office days
  return Math.trunc((officeDays / workDays) * 100) * 2;
};

export const calculateStats = (
  period: TimePeriod,
  state: IOfficeTimeState
): DashboardStats => {
  const officedays = getOfficedays(period, state.officedays);
  const freedays = getFreedays(period, state.freedays);
  const holidays = getHolidays(period, state.holidays);
  const workdays = getWorkdays(period, holidays, freedays);
  const remaining = getRemainingWorkdays(period, holidays, freedays);
  return {
    percentage: getPercentage(officedays.length, state.workingHoursDefault),
    officedays: officedays.length,
    workdays: workdays.length,
    remaining: remaining.length,
  };
};

export const rotateBase64 = async (dataUrl?: string, deg = 90) => {
  if (!dataUrl) return;
  const img = new Image();
  img.crossOrigin = 'anonymous';
  await new Promise((res, rej) => {
    img.onload = res;
    img.onerror = rej;
    img.src = dataUrl.startsWith('data:')
      ? dataUrl
      : `data:image/*;base64,${dataUrl}`;
  });

  const radians = ((deg % 360) * Math.PI) / 180;
  const sin = Math.abs(Math.sin(radians));
  const cos = Math.abs(Math.cos(radians));

  const w = img.naturalWidth;
  const h = img.naturalHeight;

  // canvas size of rotated bounding box
  const cw = Math.round(w * cos + h * sin);
  const ch = Math.round(w * sin + h * cos);

  const canvas = document.createElement('canvas');
  canvas.width = cw;
  canvas.height = ch;
  const ctx = canvas.getContext('2d');

  // move to center, rotate, draw centered
  ctx?.translate(cw / 2, ch / 2);
  ctx?.rotate(radians);
  ctx?.drawImage(img, -w / 2, -h / 2);

  // export (match your source mime if needed)
  return canvas.toDataURL('image/*');
};

export const dayjsToString = (day: Dayjs) => day.hour(12).toISOString();
export const dayjsFromString = (date?: string) => dayjs(date).hour(12);

export const deserializeIsoStringMap = (
  isoStringMap?: Record<string, string>
) =>
  Object.entries(isoStringMap ?? {}).reduce(
    (acc, [name, isoString]) => {
      acc[name] = dayjsFromString(isoString);
      return acc;
    },
    {} as Record<string, Dayjs>
  );

export const deserializeIsoStrings = (isoStrings?: string[]) =>
  isoStrings?.map((day) => dayjsFromString(day)) ?? [];

export const serializeDateMap = (dateMap?: Record<string, Dayjs>) =>
  Object.entries(dateMap ?? {}).reduce(
    (acc, [name, date]) => {
      acc[name] = dayjsToString(date);
      return acc;
    },
    {} as Record<string, string>
  );

export const serializeDates = (dates?: Dayjs[]) =>
  dates?.map((day) => dayjsToString(day));

export const validateFreedays = (
  freedays: (string | undefined | null)[],
  holidays: Record<string, Dayjs> | undefined
) => {
  return freedays
    .filter((date): date is string => !!date)
    .filter(
      (date) =>
        !Object.values(holidays ?? {}).some((holiday) =>
          holiday.isSame(dayjsFromString(date))
        )
    )
    .map(dayjsFromString);
};
