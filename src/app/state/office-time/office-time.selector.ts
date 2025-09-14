import { createFeatureSelector, createSelector } from '@ngrx/store';
import { IOfficeTimeState } from '../../@types/types';
import {
  getHolidaysForMonth,
  getHolidaysForYear,
  getOfficeDaysForMonth,
  getRemainingWorkDaysForYear,
  getWorkDaysForMonth,
  getWorkDaysForYear,
  partTime,
} from './office-time.utils';
import { Dayjs } from 'dayjs';

export const selectOfficeTimeState =
  createFeatureSelector<IOfficeTimeState>('officeTime');

export const selectHolidays = createSelector(selectOfficeTimeState, (state) => {
  return getHolidaysForYear(state.holidays);
});

export const selectHolidaysForMonth = createSelector(
  selectOfficeTimeState,
  (state) => {
    return getHolidaysForMonth(state.holidays);
  }
);

export const selectWorkDaysYear = createSelector(
  selectOfficeTimeState,
  (state) => {
    return getWorkDaysForYear(state.holidays);
  }
);

export const selectWorkDaysMonth = createSelector(
  selectOfficeTimeState,
  (state) => {
    return getWorkDaysForMonth(state.holidays);
  }
);

export const selectPartTimeWorkDaysMonth = createSelector(
  selectOfficeTimeState,
  selectWorkDaysMonth,
  (state, workdays) => {
    return partTime(state.workingHoursWeek, workdays);
  }
);
export const selectPartTimeWorkDaysYear = createSelector(
  selectOfficeTimeState,
  selectWorkDaysYear,
  (state, workdays) => {
    return partTime(state.workingHoursWeek, workdays);
  }
);

export const selectOfficeDaysMonth = createSelector(
  selectOfficeTimeState,
  (state) => {
    return getOfficeDaysForMonth(state.officeDays);
  }
);
const getPercentage = (
  officeDays: ReadonlyArray<Dayjs> | undefined,
  workDays: number
) => {
  // we consider 50% as the goal for the office days
  return Math.trunc(((officeDays?.length ?? 0) / workDays) * 100) * 2;
};
export const selectCurrentPercentage = createSelector(
  selectWorkDaysMonth,
  selectOfficeDaysMonth,
  (workDays, officeDays) => {
    if (workDays && officeDays) {
      return getPercentage(officeDays, workDays);
    }
    return 0;
  }
);

export const selectPartTimePercentage = createSelector(
  selectPartTimeWorkDaysMonth,
  selectOfficeDaysMonth,
  (workDays, officeDays) => {
    if (workDays && officeDays) {
      return getPercentage(officeDays, workDays);
    }
    return 0;
  }
);
export const selectRemainingWorkDays = createSelector(
  selectOfficeTimeState,
  (state) => {
    return getRemainingWorkDaysForYear(state.holidays);
  }
);

export const selectOfficeTime = createSelector(
  selectWorkDaysYear,
  selectWorkDaysMonth,
  selectRemainingWorkDays,
  selectCurrentPercentage,
  selectPartTimeWorkDaysYear,
  selectPartTimeWorkDaysMonth,
  selectPartTimePercentage,
  (
    workDaysYear,
    workDaysMonth,
    remainingWorkDays,
    percentage,
    partTimeWorkDaysYear,
    partTimeWorkDaysMonth,
    partTimePercentage
  ) => {
    return {
      workDaysYear,
      workDaysMonth,
      remainingWorkDays,
      percentage,
      partTimeWorkDaysYear,
      partTimeWorkDaysMonth,
      partTimePercentage,
    };
  }
);
