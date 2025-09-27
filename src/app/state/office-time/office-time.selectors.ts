import { createFeatureSelector, createSelector } from '@ngrx/store';
import { IOfficeTimeState } from '../../@types/types';

export const selectOfficeTimeState =
  createFeatureSelector<IOfficeTimeState>('officeTime');

export const selectWorkingHoursDefault = createSelector(
  selectOfficeTimeState,
  (state) => {
    return state.workingHoursDefault;
  }
);

export const selectDashboardSettings = createSelector(
  selectOfficeTimeState,
  (state) => {
    return state.dashboardSettings;
  }
);

export const selectHolidays = createSelector(selectOfficeTimeState, (state) => {
  return state.holidays;
});
export const selectHolidayDays = createSelector(selectHolidays, (holidays) => {
  return Object.values(holidays ?? {});
});

export const selectOfficedays = createSelector(
  selectOfficeTimeState,
  (state) => {
    return state.officedays ?? [];
  }
);

export const selectFreedays = createSelector(selectOfficeTimeState, (state) => {
  return state.freedays ?? [];
});

export const barcodeDataUrl = createSelector(selectOfficeTimeState, (state) => {
  return state.barcode;
});
