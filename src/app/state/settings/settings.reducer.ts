import { createReducer, on } from '@ngrx/store';
import { ISettings } from '../../@types/types';
import { ApplicationActions } from '../application.actions';
import { settingsActions } from './settingsActions';

export const VERSION: string = '1';

export const initialSettings: ISettings = {
  showTotalTime: false,
  version: VERSION,
};

export const settingsReducer = createReducer(
  initialSettings,
  on(
    settingsActions.updateSettings,
    (_state, { settings }): ISettings => settings
  ),
  on(
    ApplicationActions.loadedSuccessfully,
    (_state, { datastore }): ISettings => datastore.settings ?? _state
  )
);
