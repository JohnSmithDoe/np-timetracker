import { createActionGroup, emptyProps } from '@ngrx/store';
import { ITrackingItem } from '../../@types/types';

//prettier-ignore
export const dialogsActions = createActionGroup({
  source: 'Dialogs',
  events: {
    'Show Edit Dialog': (item: ITrackingItem) => ({ item }),
    'Show Create Dialog With Search': emptyProps(),
    'Update Item': (data: Partial<ITrackingItem>) => ({ data }),
    'Hide Dialog': emptyProps(),
    'Confirm Changes': emptyProps(),
    'Abort Changes': emptyProps(),
  },
});
