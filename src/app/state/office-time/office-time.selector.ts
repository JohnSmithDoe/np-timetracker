import {createFeatureSelector, createSelector} from '@ngrx/store';
import {DashboardStats, IOfficeTimeState} from '../../@types/types';
import {
  calculatePartTimeWorkdays,
  dayjsFromString,
  getHolidaysForMonth,
  getHolidaysForYear,
  getOfficedaysForMonth,
  getPercentage,
  getRemainingWorkdays,
  getWorkdaysForMonth,
  getWorkdaysForYear,
} from './office-time.utils';

export const selectOfficeTimeState =
  createFeatureSelector<IOfficeTimeState>('officeTime');

export const selectHolidaysForYear = createSelector(selectOfficeTimeState, (state) => {
  return getHolidaysForYear(state.holidays);
});

export const selectHolidays = createSelector(selectOfficeTimeState, (state) => {
  return state.holidays;
});
export const selectHolidayDates = createSelector(selectHolidays, (holidays) => {
  return Object.values(holidays ?? {});
});
export const selectWorkingHoursDefault = createSelector(selectOfficeTimeState, (state) => {
  return state.workingHoursDefault;
});
export const selectDashboardSettings = createSelector(selectOfficeTimeState, (state) => {
  return state.dashboardSettings;
});

export const selectHolidaysForMonth = createSelector(selectOfficeTimeState, (state) => {
  return getHolidaysForMonth(state.holidays);
});

export const selectWorkdaysYear = createSelector(selectOfficeTimeState, (state) => {
  return getWorkdaysForYear(state.holidays);
});

export const selectWorkdaysMonth = createSelector(selectOfficeTimeState, (state) => {
  return getWorkdaysForMonth(state.holidays);
});

export const selectPartTimeWorkdaysMonth = createSelector(
  selectOfficeTimeState,
  selectWorkdaysMonth,
  selectWorkingHoursDefault,
  (state, workdays, workingHoursDefault) => {
    return calculatePartTimeWorkdays(
      state.workingHours,
      workingHoursDefault,
      workdays
    );
  }
);
export const selectPartTimeWorkDaysYear = createSelector(
  selectOfficeTimeState,
  selectWorkdaysYear,
  selectWorkingHoursDefault,
  (state, workdays, workingHoursDefault) => {
    return calculatePartTimeWorkdays(
      state.workingHours,
      workingHoursDefault,
      workdays
    );
  }
);

export const selectOfficeDaysMonth = createSelector(selectOfficeTimeState, (state) => {
  return getOfficedaysForMonth(state.officedays);
});

export const selectPercentage = createSelector(
  selectWorkdaysMonth,
  selectOfficeDaysMonth,
  (workDays, officeDays) => {
    if (workDays && officeDays) {
      return getPercentage(officeDays, workDays);
    }
    return 0;
  }
);

export const selectPartTimePercentage = createSelector(
  selectPartTimeWorkdaysMonth,
  selectOfficeDaysMonth,
  (workDays, officeDays) => {
    if (workDays && officeDays) {
      return getPercentage(officeDays, workDays);
    }
    return 0;
  }
);
export const selectRemainingWorkDaysYear = createSelector(
  selectOfficeTimeState,
  (state) => {
    return getRemainingWorkdays(state.holidays, 'year');
  }
);
export const selectRemainingWorkDaysMonth = createSelector(
  selectOfficeTimeState,
  (state) => {
    return getRemainingWorkdays(state.holidays, 'month');
  }
);

export const selectOfficedays = createSelector(selectOfficeTimeState, (state) => {
  return state.officedays;
});
export const selectFreedays = createSelector(selectOfficeTimeState, (state) => {
  return [...(state.freedays ?? [])];
});

export const barcodeDataUrl = createSelector(selectOfficeTimeState, (state) => {
  return state.barcode;
});

export const workingHours = createSelector(selectOfficeTimeState, (state) => {
  return state.workingHours;
});

export const todayIsOfficeDay = createSelector(selectOfficedays, (officeDays) => {
  const today = dayjsFromString();
  return officeDays?.some((day) => day.isSame(today, 'day'));
});

export const isPartTime = createSelector(
  workingHours,
  selectWorkingHoursDefault,
  (workingHours, workingHoursDefault) => {
    return workingHours !== workingHoursDefault;
  }
);

export const fullTime = createSelector(
  selectWorkdaysYear,
  selectWorkdaysMonth,
  selectPercentage,
  (workdaysYear, workdaysMonth, percentage) => ({
    workdaysYear,
    workdaysMonth,
    percentage,
  })
);

export const partTime = createSelector(
  [selectPartTimeWorkDaysYear, selectPartTimeWorkdaysMonth, selectPartTimePercentage, isPartTime],
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
  selectRemainingWorkDaysMonth,
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
  selectRemainingWorkDaysYear,
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
