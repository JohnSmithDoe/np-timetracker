import dayjs, { Dayjs, OpUnitType } from 'dayjs';

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
export const getOfficeDaysForMonth = (officeDays?: ReadonlyArray<Dayjs>) => {
  const start = dayjs().startOf('month');
  const end = start.endOf('month');
  return countOfficeDaysBetween(start, end, officeDays);
};

const getHolidaysBetween = (
  start: Dayjs,
  end: Dayjs,
  holidays: Record<string, Dayjs> | undefined
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

export const getRemainingWorkDays = (
  holidays?: Record<string, Dayjs>,
  unit: OpUnitType = 'year'
) => {
  const start = dayjs().startOf('day');
  const end = start.endOf(unit);
  return countWorkDaysBetween(start, end, holidays);
};

const countWorkDaysBetween = (
  start: Dayjs,
  end: Dayjs,
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

const countOfficeDaysBetween = (
  start: Dayjs,
  end: Dayjs,
  officeDays?: ReadonlyArray<Dayjs>
) => {
  let officeDaysCount = 0;
  let current = start;
  while (current.isBefore(end) || current.isSame(end)) {
    if (isOfficeDay(current, officeDays)) {
      officeDaysCount++;
    }
    current = current.add(1, 'day');
  }
  return officeDays;
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

export const isOfficeDay = (
  current: Dayjs,
  officeDays?: ReadonlyArray<Dayjs>
) => {
  return !!officeDays?.find((day) => day.isSame(current, 'day'));
};

const getHoliday = (
  current: Dayjs,
  holidays: Record<string, Dayjs> | undefined
) => {
  const holiday = Object.entries(holidays ?? {}).find(([_, date]) =>
    current.isSame(date, 'day')
  );
  return holiday ? { name: holiday[0], date: holiday[1] } : undefined;
};
export const calculatePartTimeWorkDays = (
  workingHoursWeek: number,
  workingHoursDefault: number,
  workDays: number
) => {
  const workingDaysWeek = (workingHoursWeek * 5) / workingHoursDefault;
  return (workDays / 5) * workingDaysWeek;
};
export const getPercentage = (
  officeDays: ReadonlyArray<Dayjs> | undefined,
  workDays: number
) => {
  // we consider 50% as the goal for the office days
  return Math.trunc(((officeDays?.length ?? 0) / workDays) * 100) * 2;
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
