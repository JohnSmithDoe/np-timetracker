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
};

const startTracking = (state: ITrackingState, item: ITrackingItem) => {
  return {
    ...state,
    items: state.items.map((listItem) => {
      if (listItem.id !== item.id) {
        return {
          ...listItem,
          state: 'stopped',
        };
      }
      return {
        ...listItem,
        state: 'running',
        breakTime: undefined,
        startTime: dayjs().format(),
        trackedSeconds: 0,
      };
    }),
  } as ITrackingState;
};

const continueTracking = (state: ITrackingState, item: ITrackingItem) => {
  return {
    ...state,
    items: state.items.map((listItem) => {
      if (listItem.id !== item.id) {
        return {
          ...listItem,
          state: 'stopped',
        };
      }
      return {
        ...listItem,
        state: 'running',
        breakTime: dayjs(item.startTime)
          .add(listItem.trackedSeconds ?? 0, 'seconds')
          .diff(dayjs(), 'seconds'),
        trackedTime: dayjs().format(),
      };
    }),
  } as ITrackingState;
};

const stopTracking = (state: ITrackingState, item: ITrackingItem) => {
  return updateListItem(state, {
    ...item,
    state: 'paused',
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
    if (item.state === 'stopped') {
      return startTracking(state, item);
    } else if (item.state === 'paused') {
      return continueTracking(state, item);
    } else {
      return stopTracking(state, item);
    }
  }),
  on(TrackingActions.updateTracking, (state, { item }) => {
    const original = state.items.find((item) => item.id === item.id);

    return updateListItem(state, {
      ...item,
      state: 'running',
      trackedSeconds: original?.trackedSeconds ?? 0,
    } as ITrackingItem);
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
          (trackingItem) => ({ ...trackingItem, state: 'stopped' })
        ),
        searchQuery: undefined,
      };
    }
  )
);
