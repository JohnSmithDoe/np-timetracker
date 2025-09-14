import { createReducer, on } from '@ngrx/store';
import { ISettingsState } from '../../@types/types';
import { ApplicationActions } from '../application.actions';
import { settingsActions } from './settingsActions';

export const VERSION: string = '1';

export const initialSettings: ISettingsState = {
  showTotalTime: false,
  version: VERSION,
};

export const settingsReducer = createReducer(
  initialSettings,
  on(
    settingsActions.updateSettings,
    (_state, { settings }): ISettingsState => settings
  ),
  on(
    ApplicationActions.loadedSuccessfully,
    (_state, { datastore }): ISettingsState => datastore.settings ?? _state
  )
);
