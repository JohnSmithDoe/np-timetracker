import {createReducer, on} from '@ngrx/store';
import {IOfficeTimeState} from '../../@types/types';
import {ApplicationActions} from '../application.actions';
import {officeTimeActions} from './office-time.actions';
import dayjs from 'dayjs';
import {deserializeIsoStringMap, deserializeIsoStrings,} from './office-time.utils';

export const initialOfficeTime: IOfficeTimeState = {
  workingHoursDefault: 40,
  workingHours: 40,
  dashboardSettings: {
    dateCard: true,
    percentageCard: true,
    officedaysCardEdit: true,
    officedaysCardList: false,
    freedaysCardEdit: true,
    freedaysCardList: false,
    holidaysCard: true,
    statsWeek: true,
    statsMonth: true,
    statsQuarter: true,
    statsYear: true,
  }
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
    if (_state.officedays?.find((day) => day.isSame(today, 'day')))
      return _state;

    return {
      ..._state,
      officedays: [...(_state.officedays ?? []), today],
    };
  }),
  on(officeTimeActions.addOfficeday, (_state, {officeday}): IOfficeTimeState => {
    if (_state.officedays?.find((day) => day.isSame(officeday, 'day')))
      return _state;

    return {
      ..._state,
      officedays: [...(_state.officedays ?? []), officeday],
    };
  }),
  on(officeTimeActions.setOfficedays, (_state, {officedays}): IOfficeTimeState => {
    return {
      ..._state,
      officedays:[...officedays],
    };
  }),
  on(officeTimeActions.addFreeday, (_state, {freeday}): IOfficeTimeState => {
    if (_state.freedays?.find((day) => day.isSame(freeday, 'day')))
      return _state;

    return {
      ..._state,
      freedays: [...(_state.freedays ?? []), freeday],
    };
  }),
  on(officeTimeActions.setFreedays, (_state, {freedays}): IOfficeTimeState => {
    return {
      ..._state,
      freedays:[...freedays],
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
    officeTimeActions.saveDashboardSettings,
    (_state, {key, active}): IOfficeTimeState => ({
      ..._state,
      dashboardSettings: {
        ..._state.dashboardSettings,
        [key]: active
      }
    })
  ),
  on(
    ApplicationActions.loadedSuccessfully,
    (_state, { datastore }): IOfficeTimeState => {
      if (!datastore.officeTime) return _state;

      return {
        ...datastore.officeTime,
        holidays: deserializeIsoStringMap(datastore.officeTime.holidays),
        officedays: deserializeIsoStrings(datastore.officeTime.officedays),
        freedays: deserializeIsoStrings(datastore.officeTime.freedays),
      };
    }
  )
);
