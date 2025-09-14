import { createReducer, on } from '@ngrx/store';
import { IOfficeTimeState } from '../../@types/types';
import { ApplicationActions } from '../application.actions';
import { officeTimeActions } from './office-time.actions';

export const initialOfficeTime: IOfficeTimeState = {};

export const officeTimeReducer = createReducer(
  initialOfficeTime,
  on(
    officeTimeActions.loadHolidaysSuccess,
    (_state, { holidays }): IOfficeTimeState =>
      ({
        ...(_state), holidays,
      })
  ),
  on(
    officeTimeActions.loadHolidaysFailure,
    (_state): IOfficeTimeState => ({ ..._state, holidays: undefined })
  ),
  on(
    ApplicationActions.loadedSuccessfully,
    (_state, { datastore }): IOfficeTimeState => datastore.officeTime ?? _state
  )
);
