import { createReducer, on } from '@ngrx/store';
import { IOfficeTimeState } from '../../@types/types';
import { ApplicationActions } from '../application.actions';
import { officeTimeActions } from './office-time.actions';
import dayjs from 'dayjs';

export const initialOfficeTime: IOfficeTimeState = {
  workingHoursDefault: 40,
  workingHours: 40,
  barcodeRot: 0,
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
    officeTimeActions.saveBarcode,
    (_state, { base64Blob }): IOfficeTimeState => ({
      ..._state,
      barcode: base64Blob,
    })
  ),
  on(
    officeTimeActions.rotateBarcode,
    (_state): IOfficeTimeState => ({
      ..._state,
      barcodeRot: _state.barcodeRot + 90,
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
    (_state, { datastore }): IOfficeTimeState => datastore.officeTime ?? _state
  )
);
