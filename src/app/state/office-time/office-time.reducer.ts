import { createReducer, on } from '@ngrx/store';
import { IOfficeTimeState } from '../../@types/types';
import { ApplicationActions } from '../application.actions';
import { officeTimeActions } from './office-time.actions';
import dayjs from 'dayjs';

export const initialOfficeTime: IOfficeTimeState = {
  workingHoursWeek: 35,
};

export const officeTimeReducer = createReducer(
  initialOfficeTime,
  on(
    officeTimeActions.loadHolidaysSuccess,
    (_state, { holidays }): IOfficeTimeState => ({
      ..._state,
      holidays,
    })
  ),
  on(
    officeTimeActions.loadHolidaysFailure,
    (_state): IOfficeTimeState => ({ ..._state, holidays: undefined })
  ),
  on(
    officeTimeActions.addOfficeTime,
    (_state): IOfficeTimeState => ({
      ..._state,
      officeDays: [...(_state.officeDays ?? []), dayjs()],
    })
  ),
  on(
    ApplicationActions.loadedSuccessfully,
    (_state, { datastore }): IOfficeTimeState => datastore.officeTime ?? _state
  )
);
