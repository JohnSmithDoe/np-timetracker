import {createReducer, on} from '@ngrx/store';
import {ITrackingItem, ITrackingState} from '../../@types/types';
import {addListItem, removeListItem, updateListItem, updateListSort,} from '../@shared/item-list.utils';
import {applicationActions} from '../application.actions';
import {trackingActions} from './trackingActions';
import dayjs from 'dayjs';
import {uuidv4} from '../../app.utils';

export const initialState: ITrackingState = {
  title: 'Time tracking',
  items: [],
  data: [],
  dataViewId: 'all',
};

const startTracking = (
  state: ITrackingState,
  item: ITrackingItem
): ITrackingState => {
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
  };
};
const resetTracking = (
  state: ITrackingState,
  item?: ITrackingItem
): ITrackingState => {
  return {
    ...state,
    items: state.items.map((listItem): ITrackingItem => {
      if (item && listItem.id !== item.id) {
        return { ...listItem };
      }
      return {
        ...listItem,
        state: 'stopped',
        breakTime: undefined,
        breakInSeconds: undefined,
        startTime: undefined,
        trackedTimeInSeconds: undefined,
      };
    }),
  };
};

const stopTracking = (
  state: ITrackingState,
  item: ITrackingItem
): ITrackingState => {
  return updateListItem<ITrackingState, ITrackingItem>(state, {
    ...item,
    state: 'paused',
    breakTime: dayjs().format(),
  });
};

const updateTracking = (
  state: ITrackingState,
  item: ITrackingItem
): ITrackingState => {
  const original = state.items.find((aItem) => aItem.id === item.id);
  if (!original) return state;
  const runningSince = dayjs().diff(dayjs(original.startTime), 'seconds');
  const time = runningSince - (original.breakInSeconds ?? 0);

  return updateListItem<ITrackingState, ITrackingItem>(state, {
    ...original,
    trackedTimeInSeconds: time,
  });
};

const saveAndReset = (state: ITrackingState): ITrackingState => {
  const data: ITrackingItem[] = [
    ...state.data,
    ...state.items
      .filter((item) => !!item.startTime)
      .map(
        (item): ITrackingItem => ({ ...item, state: 'stopped', id: uuidv4() }) // save with new id
      ),
  ].sort((a, b) => dayjs(a.startTime).diff(b.startTime));
  return {
    ...resetTracking(state),
    data,
  };
};

export const trackingReducer = createReducer(
  initialState,
  on(trackingActions.addItem, (state, { item }) => addListItem(state, item)),
  on(trackingActions.removeItem, (state, { item }) =>
    removeListItem(state, item)
  ),
  on(trackingActions.updateItem, (state, { item }) =>
    updateListItem(state, item)
  ),
  on(
    trackingActions.updateSearch,
    (state, { searchQuery }): ITrackingState =>
      searchQuery === state.searchQuery ? state : { ...state, searchQuery }
  ),
  on(trackingActions.toggleTrackingItem, (state, { item }) => {
    if (item.state !== 'running') {
      return startTracking(state, item);
    } else {
      return stopTracking(state, item);
    }
  }),
  on(trackingActions.resetTracking, (state, { item }) => {
    return resetTracking(state, item);
  }),
  on(trackingActions.resetAllTracking, (state) => {
    return resetTracking(state);
  }),
  on(trackingActions.saveAndResetTracking, (state) => {
    return saveAndReset(state);
  }),
  on(trackingActions.updateTracking, (state, { item }): ITrackingState => {
    return updateTracking(state, item);
  }),

  on(trackingActions.changeDataView, (state, { viewId }): ITrackingState => {
    return { ...state, dataViewId: viewId };
  }),

  on(trackingActions.removeDataItem, (state, { item }): ITrackingState => {
    return {
      ...state,
      data: state.data.filter((aitem) => aitem.id !== item.id),
    };
  }),

  on(trackingActions.updateSort, (state, { sortBy, sortDir }) => ({
    ...state,
    sort: updateListSort(sortBy, sortDir, state.sort?.sortDir),
  })),

  on(
    applicationActions.loadedSuccessfully,
    (_state, { datastore }): ITrackingState => {
      return {
        ...(datastore.tracking ?? _state),
        items: (datastore.tracking?.items ?? _state.items).map(
          (trackingItem) => ({ ...trackingItem })
        ),
        searchQuery: undefined,
        dataViewId: 'today',
      };
    }
  )
);
