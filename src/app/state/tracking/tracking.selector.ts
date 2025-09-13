import { createFeatureSelector, createSelector } from '@ngrx/store';
import {
  IAppState,
  IDataItem,
  ISearchResult,
  ITrackingItem,
  ITrackingState,
} from '../../@types/types';
import {
  filterAndSortItemList,
  filterBySearchQuery,
} from '../@shared/item-list.selector';
import dayjs from 'dayjs';
import { NpTimeFromDataItemPipe } from '../../pipes/np-time-from-data-item.pipe';

export const selectTrackingState =
  createFeatureSelector<ITrackingState>('tracking');

const getKey = (trackingItem: ITrackingItem, listId: string) => {
  if (listId === 'daily' || listId === 'today') {
    return dayjs(trackingItem.startTime).format('YYYYMMDD');
  } else if (listId === 'monthly') {
    return dayjs(trackingItem.startTime).format('YYYYMM');
  } else if (listId === 'all') {
    return '';
  } else {
    return dayjs(trackingItem.startTime).format('YYYYMMDDHHmm');
  }
};
const groupBy = (data: ITrackingItem[], listId: string) => {
  const map: Record<string, IDataItem> = {};
  if (listId === 'today') {
    data = data.filter((item) => dayjs(item.startTime).isSame(dayjs(), 'day'));
  }
  data.forEach((trackingItem) => {
    let key = getKey(trackingItem, listId);
    key += trackingItem.name;
    const current = map[key]?.trackedTimeInSeconds ?? 0;
    map[key] = {
      ...trackingItem,
      trackedTimeInSeconds: current + (trackingItem.trackedTimeInSeconds ?? 0),
    };
  });

  return Object.values(map);
};

export const selectTrackingDataViewId = createSelector(
  selectTrackingState,
  (state: ITrackingState) => {
    let listId = state?.dataViewId;
    return listId ?? 'today';
  }
);
export const selectTrackingData = createSelector(
  selectTrackingState,
  selectTrackingDataViewId,
  (state: ITrackingState, listId): IDataItem[] => {
    let data = state?.data ?? [];
    return groupBy(data, listId);
  }
);

const timePipe = new NpTimeFromDataItemPipe();
export const selectTrackingDataAsCSV = createSelector(
  selectTrackingData,
  selectTrackingDataViewId,
  (data, viewId) => {
    return [
      'Name,Start Time,Tracked (s), Tracked Time (HH:mm:ss)',
      ...data.map((item) => {
        const rounded = dayjs()
          .startOf('date')
          .add(item.trackedTimeInSeconds ?? 0, 'seconds')
          .format('HH:mm:ss');
        return (
          item.name +
          ',' +
          timePipe.transform(item, viewId) +
          ',' +
          item.trackedTimeInSeconds +
          ',' +
          rounded
        );
      }),
    ].join('\n');
  }
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
      (cur, prev) => cur + (prev.trackedTimeInSeconds ?? 0),
      0
    );
    return dayjs()
      .startOf('date')
      .add(timeInSeconds, 'seconds')
      .format('HH:mm:ss');
  }
);
