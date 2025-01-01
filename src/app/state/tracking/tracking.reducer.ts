import { createReducer, on } from '@ngrx/store';
import { ITrackingState } from '../../@types/types';
import {
  addListItem,
  removeListItem,
  updateListItem,
  updateListSort,
} from '../@shared/item-list.utils';
import { ApplicationActions } from '../application.actions';
import { TrackingActions } from './tracking.actions';

export const initialState: ITrackingState = {
  title: 'Time tracking',
  items: [],
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
  on(
    TrackingActions.updateFilter,
    (state, { filterBy }): ITrackingState => ({ ...state, filterBy })
  ),
  on(TrackingActions.updateSort, (state, { sortBy, sortDir }) => ({
    ...state,
    sort: updateListSort(sortBy, sortDir, state.sort?.sortDir),
  })),

  on(
    ApplicationActions.loadedSuccessfully,
    (_state, { datastore }): ITrackingState => {
      return {
        ...(datastore.tracking ?? _state),
        searchQuery: undefined,
        filterBy: undefined,
      };
    }
  )
);
