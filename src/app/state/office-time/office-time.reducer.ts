import { createReducer, on } from '@ngrx/store';
import { IOfficeTimeState } from '../../@types/types';
import { ApplicationActions } from '../application.actions';
import { officeTimeActions } from './office-time.actions';
import dayjs from 'dayjs';
import {
  deserializeIsoStringMap,
  deserializeIsoStrings,
} from './office-time.utils';

export const initialOfficeTime: IOfficeTimeState = {
  workingHoursDefault: 40,
  workingHours: 40,
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
  on(officeTimeActions.addOfficeTime, (_state): IOfficeTimeState => {
    const today = dayjs();
    if (_state.officeDays?.find((day) => day.isSame(today, 'day')))
      return _state;

    return {
      ..._state,
      officeDays: [...(_state.officeDays ?? []), today],
    };
  }),
  on(
    officeTimeActions.saveBarcode,
    (_state, { base64Blob }): IOfficeTimeState => ({
      ..._state,
      barcode: base64Blob,
    })
  ),
  on(
    officeTimeActions.rotateBarcodeSuccess,
    (_state, { barcode }): IOfficeTimeState => ({
      ..._state,
      barcode,
    })
  ),
  on(
    officeTimeActions.deleteBarcode,
    (_state): IOfficeTimeState => ({ ..._state, barcode: undefined })
  ),
  on(
    officeTimeActions.saveWorkingHours,
    (_state, { hours }): IOfficeTimeState => ({
      ..._state,
      workingHours: hours,
    })
  ),
  on(
    officeTimeActions.saveWorkingHoursDefault,
    (_state, { hours }): IOfficeTimeState => ({
      ..._state,
      workingHoursDefault: hours,
    })
  ),
  on(
    ApplicationActions.loadedSuccessfully,
    (_state, { datastore }): IOfficeTimeState => {
      if (!datastore.officeTime) return _state;

      return {
        ...datastore.officeTime,
        holidays: deserializeIsoStringMap(datastore.officeTime.holidays),
        officeDays: deserializeIsoStrings(datastore.officeTime.officeDays),
      };
    }
  )
);
