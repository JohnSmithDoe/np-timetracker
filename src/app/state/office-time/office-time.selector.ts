import {createFeatureSelector, createSelector} from '@ngrx/store';
import {DashboardStats, IOfficeTimeState} from '../../@types/types';
import {
  calculatePartTimeWorkDays,
  getHolidaysForMonth,
  getHolidaysForYear,
  getOfficeDaysForMonth,
  getPercentage,
  getRemainingWorkDays,
  getWorkDaysForMonth,
  getWorkDaysForYear,
} from './office-time.utils';
import dayjs from 'dayjs';

export const officeTimeState =
  createFeatureSelector<IOfficeTimeState>('officeTime');

export const holidays = createSelector(officeTimeState, (state) => {
  return getHolidaysForYear(state.holidays);
});

export const workingHoursDefault = createSelector(officeTimeState, (state) => {
  return state.workingHoursDefault;
});
export const dashboardSettings = createSelector(officeTimeState, (state) => {
  return state.dashboardSettings;
});

export const holidaysForMonth = createSelector(officeTimeState, (state) => {
  return getHolidaysForMonth(state.holidays);
});

export const workDaysYear = createSelector(officeTimeState, (state) => {
  return getWorkDaysForYear(state.holidays);
});

export const workDaysMonth = createSelector(officeTimeState, (state) => {
  return getWorkDaysForMonth(state.holidays);
});

export const partTimeWorkDaysMonth = createSelector(
  officeTimeState,
  workDaysMonth,
  workingHoursDefault,
  (state, workdays, workingHoursDefault) => {
    return calculatePartTimeWorkDays(
      state.workingHours,
      workingHoursDefault,
      workdays
    );
  }
);
export const partTimeWorkDaysYear = createSelector(
  officeTimeState,
  workDaysYear,
  workingHoursDefault,
  (state, workdays, workingHoursDefault) => {
    return calculatePartTimeWorkDays(
      state.workingHours,
      workingHoursDefault,
      workdays
    );
  }
);

export const officeDaysMonth = createSelector(officeTimeState, (state) => {
  return getOfficeDaysForMonth(state.officeDays);
});

export const percentage = createSelector(
  workDaysMonth,
  officeDaysMonth,
  (workDays, officeDays) => {
    if (workDays && officeDays) {
      return getPercentage(officeDays, workDays);
    }
    return 0;
  }
);

export const partTimePercentage = createSelector(
  partTimeWorkDaysMonth,
  officeDaysMonth,
  (workDays, officeDays) => {
    if (workDays && officeDays) {
      return getPercentage(officeDays, workDays);
    }
    return 0;
  }
);
export const remainingWorkDaysYear = createSelector(
  officeTimeState,
  (state) => {
    return getRemainingWorkDays(state.holidays, 'year');
  }
);
export const remainingWorkDaysMonth = createSelector(
  officeTimeState,
  (state) => {
    return getRemainingWorkDays(state.holidays, 'month');
  }
);

export const officeDays = createSelector(officeTimeState, (state) => {
  return state.officeDays;
});

export const barcodeDataUrl = createSelector(officeTimeState, (state) => {
  return state.barcode;
});

export const workingHours = createSelector(officeTimeState, (state) => {
  return state.workingHours;
});

export const todayIsOfficeDay = createSelector(officeDays, (officeDays) => {
  const today = dayjs();
  return officeDays?.some((day) => day.isSame(today, 'day'));
});

export const isPartTime = createSelector(
  workingHours,
  workingHoursDefault,
  (workingHours, workingHoursDefault) => {
    return workingHours !== workingHoursDefault;
  }
);

export const fullTime = createSelector(
  workDaysYear,
  workDaysMonth,
  percentage,
  (workdaysYear, workdaysMonth, percentage) => ({
    workdaysYear,
    workdaysMonth,
    percentage,
  })
);

export const partTime = createSelector(
  [partTimeWorkDaysYear, partTimeWorkDaysMonth, partTimePercentage, isPartTime],
  (
    workdaysYear: number,
    workdaysMonth: number,
    percentage: number,
    isPartTime: boolean
  ) => ({
    workdaysYear,
    workdaysMonth,
    percentage,
    isPartTime,
  })
);
export const dashboardStatsMonth = createSelector(
  fullTime,
  partTime,
  remainingWorkDaysMonth,
  (fullTime, partTime, remaining) => {
    const stats: DashboardStats = {
      isPartTime: partTime.isPartTime,
      fullTime: {
        ...fullTime,
        remaining,
        officedays: 0,
        workdays: fullTime.workdaysMonth,
      },
      partTime: {
        ...partTime,
        officedays: 0,
        remaining,
        workdays: partTime.workdaysMonth,
      },
    };
    return stats;
  }
);

export const dashboardStatsYear = createSelector(
  fullTime,
  partTime,
  remainingWorkDaysYear,
  (fullTime, partTime, remaining) => {
    const stats: DashboardStats = {
      isPartTime: partTime.isPartTime,
      fullTime: {
        ...fullTime,
        remaining,
        officedays: 0,
        workdays: fullTime.workdaysYear,
      },
      partTime: {
        ...partTime,
        officedays: 0,
        remaining,
        workdays: partTime.workdaysYear,
      },
    };
    return stats;
  }
);
