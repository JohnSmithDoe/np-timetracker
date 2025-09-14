import { createActionGroup } from '@ngrx/store';
import { BooleanKeys, ISettingsState } from '../../@types/types';

export const settingsActions = createActionGroup({
  source: 'Settings',
  events: {
    'Update Settings': (settings: ISettingsState) => ({ settings }),
    'Toggle Flag': (flag: BooleanKeys<ISettingsState>) => ({ flag }),
  },
});
