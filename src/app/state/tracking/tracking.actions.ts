import { createActionGroup, emptyProps } from '@ngrx/store';
import {
  ITrackingItem,
  TItemListSortType,
  TUpdateDTO,
} from '../../@types/types';

export const TrackingActions = createActionGroup({
  source: 'Tracking',
  events: {
    // Effects only
    'Enter Page': emptyProps(),
    'Add Or Update Item': (item: ITrackingItem) => ({ item }),
    'Add Item From Search': emptyProps(),

    // Operations
    'Toggle Tracking Item': (item: ITrackingItem) => ({ item }),
    'Pause Tracking': (item: ITrackingItem) => ({ item }),
    'Start Tracking': (item: ITrackingItem) => ({ item }),
    'Update Tracking': (item: ITrackingItem) => ({ item }),
    'Reset Tracking': (item: ITrackingItem) => ({ item }),
    'Reset All Tracking': emptyProps(),
    'Save And Reset Tracking': emptyProps(),
    'End Tracking': emptyProps(),
    'Share Data': emptyProps(),

    'Add Item': (item: ITrackingItem) => ({ item }),
    'Add Item Failure': (item: ITrackingItem) => ({ item }),

    'Remove Item': (item: ITrackingItem) => ({ item }),
    'Update Item': (item?: TUpdateDTO<ITrackingItem>) => ({ item }),
    'Update Search': (searchQuery?: string) => ({ searchQuery }),
    'Update Sort': (
      sortBy?: TItemListSortType,
      sortDir?: 'asc' | 'desc' | 'keep' | 'toggle'
    ) => ({ sortBy, sortDir }),
  },
});
