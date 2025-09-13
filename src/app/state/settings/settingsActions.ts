import { createActionGroup } from '@ngrx/store';
import { BooleanKeys, ISettings } from '../../@types/types';

export const settingsActions = createActionGroup({
  source: 'Settings',
  events: {
    'Update Settings': (settings: ISettings) => ({ settings }),
    'Toggle Flag': (flag: BooleanKeys<ISettings>) => ({ flag }),
  },
});
