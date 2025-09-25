import {createFeatureSelector, createSelector} from '@ngrx/store';
import {DashboardStats, IOfficeTimeState} from '../../@types/types';
import {
  calculatePartTimeWorkdays,
  getHolidaysForMonth,
  getHolidaysForYear,
  getOfficedaysForMonth,
  getPercentage,
  getRemainingWorkdays,
  getWorkdaysForMonth,
  getWorkdaysForYear,
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

export const workdaysYear = createSelector(officeTimeState, (state) => {
  return getWorkdaysForYear(state.holidays);
});

export const workdaysMonth = createSelector(officeTimeState, (state) => {
  return getWorkdaysForMonth(state.holidays);
});

export const partTimeWorkdaysMonth = createSelector(
  officeTimeState,
  workdaysMonth,
  workingHoursDefault,
  (state, workdays, workingHoursDefault) => {
    return calculatePartTimeWorkdays(
      state.workingHours,
      workingHoursDefault,
      workdays
    );
  }
);
export const partTimeWorkDaysYear = createSelector(
  officeTimeState,
  workdaysYear,
  workingHoursDefault,
  (state, workdays, workingHoursDefault) => {
    return calculatePartTimeWorkdays(
      state.workingHours,
      workingHoursDefault,
      workdays
    );
  }
);

export const officeDaysMonth = createSelector(officeTimeState, (state) => {
  return getOfficedaysForMonth(state.officedays);
});

export const percentage = createSelector(
  workdaysMonth,
  officeDaysMonth,
  (workDays, officeDays) => {
    if (workDays && officeDays) {
      return getPercentage(officeDays, workDays);
    }
    return 0;
  }
);

export const partTimePercentage = createSelector(
  partTimeWorkdaysMonth,
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
    return getRemainingWorkdays(state.holidays, 'year');
  }
);
export const remainingWorkDaysMonth = createSelector(
  officeTimeState,
  (state) => {
    return getRemainingWorkdays(state.holidays, 'month');
  }
);

export const officedays = createSelector(officeTimeState, (state) => {
  return state.officedays;
});
export const freedays = createSelector(officeTimeState, (state) => {
  return state.freedays;
});

export const barcodeDataUrl = createSelector(officeTimeState, (state) => {
  return state.barcode;
});

export const workingHours = createSelector(officeTimeState, (state) => {
  return state.workingHours;
});

export const todayIsOfficeDay = createSelector(officedays, (officeDays) => {
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
  workdaysYear,
  workdaysMonth,
  percentage,
  (workdaysYear, workdaysMonth, percentage) => ({
    workdaysYear,
    workdaysMonth,
    percentage,
  })
);

export const partTime = createSelector(
  [partTimeWorkDaysYear, partTimeWorkdaysMonth, partTimePercentage, isPartTime],
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
