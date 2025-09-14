import { createFeatureSelector, createSelector } from '@ngrx/store';
import { IOfficeTimeState } from '../../@types/types';
import {
  getHolidaysForMonth,
  getHolidaysForYear,
  getOfficeDaysForMonth,
  getPercentage,
  getRemainingWorkDaysForYear,
  getWorkDaysForMonth,
  getWorkDaysForYear,
  partTime,
} from './office-time.utils';

export const selectOfficeTimeState =
  createFeatureSelector<IOfficeTimeState>('officeTime');

export const selectHolidays = createSelector(selectOfficeTimeState, (state) => {
  return getHolidaysForYear(state.holidays);
});


export const selectWorkingHoursDefault = createSelector(selectOfficeTimeState, (state) => {
  return state.workingHoursDefault;
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
  selectWorkingHoursDefault,
  (state, workdays, workingHoursDefault) => {
    return partTime(state.workingHours, workdays, workingHoursDefault);
  }
);
export const selectPartTimeWorkDaysYear = createSelector(
  selectOfficeTimeState,
  selectWorkDaysYear,
  selectWorkingHoursDefault,
  (state, workdays, workingHoursDefault) => {
    return partTime(state.workingHours, workdays, workingHoursDefault);
  }
);

export const selectOfficeDaysMonth = createSelector(
  selectOfficeTimeState,
  (state) => {
    return getOfficeDaysForMonth(state.officeDays);
  }
);

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

export const selectOfficeDays = createSelector(
  selectOfficeTimeState,
  (state) => {
    return state.officeDays;
  }
);

export const selectBarcodeBlob = createSelector(
  selectOfficeTimeState,
  (state) => {
    return state.barcode;
  }
);

export const selectWorkingHours = createSelector(
  selectOfficeTimeState,
  (state) => {
    return state.workingHours;
  }
);


export const selectIsPartTime = createSelector(
  selectWorkingHours,
  selectWorkingHoursDefault,
  (workingHours, workingHoursDefault) => {
    return workingHours !== workingHoursDefault;
  }
);

export const selectOfficeTime = createSelector(
  selectWorkDaysYear,
  selectWorkDaysMonth,
  selectRemainingWorkDays,
  selectCurrentPercentage,
  (
    workDaysYear,
    workDaysMonth,
    remainingWorkDays,
    percentage,
  ) => {
    return {
      workDaysYear,
      workDaysMonth,
      remainingWorkDays,
      percentage,
    };
  }
);
export const selectPartTime = createSelector(
  selectPartTimeWorkDaysYear,
  selectPartTimeWorkDaysMonth,
  selectPartTimePercentage,
  selectIsPartTime,
  (
    partTimeWorkDaysYear,
    partTimeWorkDaysMonth,
    partTimePercentage,
    isPartTime
  ) => {
    return {
      partTimeWorkDaysYear,
      partTimeWorkDaysMonth,
      partTimePercentage,
      isPartTime,
    };
  }
);
