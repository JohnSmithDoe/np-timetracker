import { inject, Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { map, of } from 'rxjs';
import dayjs, { Dayjs } from 'dayjs';

@Injectable({
  providedIn: 'root',
})
export class OfficeTimeService {
  readonly #http = inject(HttpClient);

  #holidays?: Record<string, Dayjs>;

  #getHolidays() {
    if (this.#holidays) return of(this.#holidays);
    const currentYear = new Date().getFullYear();
    return this.#http
      .get<
        Record<string, { datum: string }>
      >(`assets/holidays/${currentYear}-BE.json`)
      .pipe(map((holidays) => this.#parseHolidays(holidays)));
  }

  #parseHolidays(holidays: Record<string, { datum: string }>) {
    this.#holidays = {};
    for (const key in holidays) {
      const date = holidays[key].datum;
      this.#holidays[key] = dayjs(date);
    }
    return this.#holidays;
  }

  getWorkDaysForYear() {
    return this.#getHolidays().pipe(
      map((holidays) => {
        const start = dayjs().startOf('year');
        const end = start.endOf('year');
        return this.#countWorkDays(start, end, holidays);
      })
    );
  }
  getWorkDaysForMonth() {
    return this.#getHolidays().pipe(
      map((holidays) => {
        const start = dayjs().startOf('month');
        const end = start.endOf('month');
        return this.#countWorkDays(start, end, holidays);
      })
    );
  }

  #countWorkDays(
    start: dayjs.Dayjs,
    end: dayjs.Dayjs,
    holidays: Record<string, Dayjs>
  ) {
    let workDays = 0;
    let current = start;
    while (current.isBefore(end) || current.isSame(end)) {
      if (!this.#isHolidayOrWeekend(current, holidays)) {
        workDays++;
      }
      current = current.add(1, 'day');
    }
    return workDays;
  }

  #isHolidayOrWeekend(current: Dayjs, holidays: Record<string, Dayjs>) {
    const day = current.day();
    const isSunday = day === 0;
    const isSaturday = day === 6;
    let isHoliday = false;
    for (const holiday in holidays) {
      const holidayDate = holidays[holiday];
      isHoliday = isHoliday || current.isSame(holidayDate, 'day');
    }
    return isSunday || isSaturday || isHoliday;
  }
}
