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

    'Add Item': (item: ITrackingItem) => ({ item }),
    'Add Item Failure': (item: ITrackingItem) => ({ item }),

    'Remove Item': (item: ITrackingItem) => ({ item }),
    'Update Item': (item: TUpdateDTO<ITrackingItem>) => ({ item }),
    'Update Search': (searchQuery?: string) => ({ searchQuery }),
    'Update Sort': (
      sortBy?: TItemListSortType,
      sortDir?: 'asc' | 'desc' | 'keep' | 'toggle'
    ) => ({ sortBy, sortDir }),
  },
});
