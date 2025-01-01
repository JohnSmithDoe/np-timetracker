import { createFeatureSelector, createSelector } from '@ngrx/store';
import {
  IAppState,
  ISearchResult,
  ITrackingItem,
  ITrackingState,
} from '../../@types/types';
import {
  filterAndSortItemList,
  filterBySearchQuery,
} from '../@shared/item-list.selector';
import * as dayjs from 'dayjs';

export const selectTrackingState =
  createFeatureSelector<ITrackingState>('tracking');

export const selectTrackingData = createSelector(
  selectTrackingState,
  (state: ITrackingState): ITrackingItem[] => state?.data ?? []
);

export const selectTrackingListSearchResult = createSelector(
  selectTrackingState,
  (state: IAppState) => state,
  (listState: ITrackingState): ISearchResult<ITrackingItem> | undefined =>
    filterBySearchQuery(listState)
);

export const selectListItemsTracking = createSelector(
  selectTrackingState,
  selectTrackingListSearchResult,
  (state: ITrackingState, result): ITrackingItem[] | undefined =>
    filterAndSortItemList(state, result)
);
export const selectRunningTrackingItem = createSelector(
  selectTrackingState,
  (state: ITrackingState): ITrackingItem | undefined =>
    state.items.find((item) => item.state === 'running')
);

export const selectTrackingTime = createSelector(
  selectTrackingState,
  (state: ITrackingState) => {
    const timeInSeconds = state.items.reduce(
      (cur, prev) => cur + (prev.trackedSeconds ?? 0),
      0
    );
    return dayjs()
      .startOf('date')
      .add(timeInSeconds, 'seconds')
      .format('HH:mm:ss');
  }
);
