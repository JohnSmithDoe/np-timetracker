import { createFeatureSelector, createSelector } from '@ngrx/store';
import { IOfficeTimeState } from '../../@types/types';
import {
  getHolidaysForMonth,
  getHolidaysForYear,
  getRemainingWorkDaysForYear,
  getWorkDaysForMonth,
  getWorkDaysForYear,
} from './office-time.utils';

export const selectOfficeTimeState =
  createFeatureSelector<IOfficeTimeState>('officeTime');

export const selectHolidays = createSelector(selectOfficeTimeState, (state) => {
  debugger;
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
export const selectRemainingWorkDays = createSelector(
  selectOfficeTimeState,
  (state) => {
    return getRemainingWorkDaysForYear(state.holidays);
  }
);
