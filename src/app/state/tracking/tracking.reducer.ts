import { createReducer, on } from '@ngrx/store';
import { ITrackingItem, ITrackingState } from '../../@types/types';
import {
  addListItem,
  removeListItem,
  updateListItem,
  updateListSort,
} from '../@shared/item-list.utils';
import { ApplicationActions } from '../application.actions';
import { TrackingActions } from './tracking.actions';
import * as dayjs from 'dayjs';

export const initialState: ITrackingState = {
  title: 'Time tracking',
  items: [],
  data: [],
};

const startTracking = (state: ITrackingState, item: ITrackingItem) => {
  return {
    ...state,
    items: state.items.map((listItem) => {
      if (listItem.id !== item.id) {
        return {
          ...listItem,
          state: 'stopped',
          breakTime:
            listItem.state === 'running'
              ? dayjs().format()
              : listItem.breakTime,
        };
      }
      let breakInSeconds = listItem.breakInSeconds ?? 0;
      if (listItem.breakTime) {
        breakInSeconds += dayjs().diff(dayjs(listItem.breakTime), 'seconds');
      }

      return {
        ...listItem,
        state: 'running',
        startTime: listItem.startTime ?? dayjs().format(),
        breakTime: undefined,
        breakInSeconds,
        trackedTimeInSeconds: listItem.trackedTimeInSeconds ?? 0,
      };
    }),
  } as ITrackingState;
};
const resetTracking = (state: ITrackingState, item?: ITrackingItem) => {
  return {
    ...state,
    items: state.items.map((listItem) => {
      if (item && listItem.id !== item.id) {
        return { ...listItem };
      }
      return {
        ...listItem,
        state: 'stopped',
        breakTime: undefined,
        breakInSeconds: undefined,
        startTime: undefined,
        trackedSeconds: undefined,
      };
    }),
  } as ITrackingState;
};

const stopTracking = (state: ITrackingState, item: ITrackingItem) => {
  return updateListItem(state, {
    ...item,
    state: 'paused',
    breakTime: dayjs().format(),
  } as ITrackingItem);
};

const updateTracking = (state: ITrackingState, item: ITrackingItem) => {
  const original = state.items.find((aItem) => aItem.id === item.id);
  if (!original) return state;
  const runningSince = dayjs().diff(dayjs(original.startTime), 'seconds');
  const time = runningSince - (original.breakInSeconds ?? 0);

  return updateListItem(state, {
    ...original,
    trackedTimeInSeconds: time,
  } as ITrackingItem);
};
export const trackingReducer = createReducer(
  initialState,
  on(TrackingActions.addItem, (state, { item }) => addListItem(state, item)),
  on(TrackingActions.removeItem, (state, { item }) =>
    removeListItem(state, item)
  ),
  on(TrackingActions.updateItem, (state, { item }) =>
    updateListItem(state, item)
  ),
  on(
    TrackingActions.updateSearch,
    (state, { searchQuery }): ITrackingState =>
      searchQuery === state.searchQuery ? state : { ...state, searchQuery }
  ),
  on(TrackingActions.toggleTrackingItem, (state, { item }) => {
    if (item.state !== 'running') {
      return startTracking(state, item);
    } else {
      return stopTracking(state, item);
    }
  }),
  on(TrackingActions.resetTracking, (state, { item }) => {
    return resetTracking(state, item);
  }),
  on(TrackingActions.resetAllTracking, (state) => {
    return resetTracking(state);
  }),
  on(TrackingActions.saveAndResetTracking, (state) => {
    const data: ITrackingItem[] = [
      ...state.data,
      ...state.items
        .filter((item) => !!item.startTime)
        .map((item) => ({ ...item, state: 'stopped' }) as ITrackingItem),
    ].sort((a, b) => dayjs(a.startTime).diff(b.startTime));
    return {
      ...resetTracking(state),
      data,
    };
  }),
  on(TrackingActions.updateTracking, (state, { item }): ITrackingState => {
    return updateTracking(state, item);
  }),

  on(TrackingActions.removeDataItem, (state, { item }): ITrackingState => {
    return {
      ...state,
      data: state.data.filter((aitem) => aitem.id !== item.id),
    };
  }),

  on(TrackingActions.updateSort, (state, { sortBy, sortDir }) => ({
    ...state,
    sort: updateListSort(sortBy, sortDir, state.sort?.sortDir),
  })),

  on(
    ApplicationActions.loadedSuccessfully,
    (_state, { datastore }): ITrackingState => {
      return {
        ...(datastore.tracking ?? _state),
        items: (datastore.tracking?.items ?? _state.items).map(
          (trackingItem) => ({ ...trackingItem })
        ),
        searchQuery: undefined,
      };
    }
  )
);
