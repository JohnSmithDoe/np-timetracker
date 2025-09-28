import {createReducer, on} from '@ngrx/store';
import {IOfficeTimeState} from '../../@types/types';
import {applicationActions} from '../application.actions';
import {officeTimeActions} from './office-time.actions';
import {dayjsFromString, deserializeIsoStringMap, deserializeIsoStrings, validateFreedays,} from './office-time.utils';

export const initialOfficeTime: IOfficeTimeState = {
  targetPercentage: 50,
  freedays: [],
  holidays: {},
  officedays: [],
  dashboardSettings: {
    showDateCard: true,
    showPercentageCard: true,
    showOfficedaysCardEdit: true,
    showOfficedaysCardList: false,
    showFreedaysCardEdit: true,
    showFreedaysCardList: false,
    showHolidaysCard: true,
    showStatsWeek: true,
    showStatsMonth: true,
    showStatsQuarter: true,
    showStatsYear: true,
  },
};

export const officeTimeReducer = createReducer(
  initialOfficeTime,
  on(
    officeTimeActions.loadHolidaysSuccess,
    (_state, { holidays }): IOfficeTimeState => ({
      ..._state,
      holidays: { ...holidays },
    })
  ),
  on(
    officeTimeActions.loadHolidaysFailure,
    (_state): IOfficeTimeState => ({ ..._state, holidays: {} })
  ),
  on(officeTimeActions.addOfficeTime, (_state): IOfficeTimeState => {
    const today = dayjsFromString();
    if (_state.officedays?.find((day) => day.isSame(today, 'day')))
      return _state;

    return {
      ..._state,
      officedays: [...(_state.officedays ?? []), today],
    };
  }),
  on(
    officeTimeActions.addOfficeday,
    (_state, { officeday }): IOfficeTimeState => {
      if (_state.officedays?.find((day) => day.isSame(officeday, 'day')))
        return _state;

      return {
        ..._state,
        officedays: [...(_state.officedays ?? []), officeday],
      };
    }
  ),
  on(
    officeTimeActions.setOfficedays,
    (_state, { officedays }): IOfficeTimeState => {
      return {
        ..._state,
        officedays: [...officedays],
      };
    }
  ),
  on(officeTimeActions.saveTargetPercentage, (_state, { percentage }) => {
    return { ..._state, targetPercentage: percentage };
  }),

  on(officeTimeActions.resetData, (_state) => {
    return {
      ...initialOfficeTime,
      holidays: _state.holidays,
      barcode: _state.barcode,
    };
  }),
  on(officeTimeActions.addFreeday, (_state, { freeday }): IOfficeTimeState => {
    if (_state.freedays?.find((day) => day.isSame(freeday, 'day')))
      return _state;

    return {
      ..._state,
      freedays: [...(_state.freedays ?? []), freeday],
    };
  }),
  on(
    officeTimeActions.setFreedays,
    (_state, { freedays }): IOfficeTimeState => {
      return {
        ..._state,
        freedays: [...validateFreedays(freedays, _state.holidays)],
      };
    }
  ),
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
    officeTimeActions.saveDashboardSettings,
    (_state, { key, active }): IOfficeTimeState => ({
      ..._state,
      dashboardSettings: {
        ..._state.dashboardSettings,
        [key]: active,
      },
    })
  ),
  on(
    applicationActions.loadedSuccessfully,
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
