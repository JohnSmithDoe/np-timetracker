import { createFeatureSelector } from '@ngrx/store';
import { ISettingsState } from '../../@types/types';

export const selectSettingsState =
  createFeatureSelector<ISettingsState>('settings');
