import { createSelector } from '@ngrx/store';
import { calculateStats } from './office-time.utils';
import {
  selectOfficedays,
  selectOfficeTimeState,
} from './office-time.selectors';
import dayjs from 'dayjs';

export const todayIsOfficeDay = createSelector(
  selectOfficedays,
  (officeDays) => {
    const today = dayjs();
    return officeDays?.some((day) => day.isSame(today, 'day'));
  }
);

export const selectDashboardStatsYear = createSelector(
  selectOfficeTimeState,
  (state) => {
    return calculateStats('year', state);
  }
);
export const selectDashboardStatsQuarter = createSelector(
  selectOfficeTimeState,
  (state) => {
    return calculateStats('quarter', state);
  }
);
export const selectDashboardStatsMonth = createSelector(
  selectOfficeTimeState,
  (state) => {
    return calculateStats('month', state);
  }
);
export const selectDashboardStatsWeek = createSelector(
  selectOfficeTimeState,
  (state) => {
    return calculateStats('week', state);
  }
);
