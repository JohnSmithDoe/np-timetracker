import { getRouterSelectors, RouterReducerState } from '@ngrx/router-store';
import { createFeatureSelector, createSelector } from '@ngrx/store';
import {
  IAppState,
  IListState,
  ISearchResult,
  ITrackingItem,
  TItemListSort,
} from '../../@types/types';
import { matchesSearch, matchesSearchExactly } from '../../app.utils';

const selectRouterState = createFeatureSelector<RouterReducerState>('router');
const { selectRouteParams } = getRouterSelectors(selectRouterState);

export const selectListState = createSelector(
  selectRouteParams,
  (state: IAppState) => state,
  ({ listId }, state) => {
    if (!listId) return undefined;
    return state.tracking;
  }
);

export const filterBySearchQuery = <
  T extends IListState<R>,
  R extends ITrackingItem,
>(
  listState?: T
): ISearchResult<R> | undefined => {
  const searchQuery = listState?.searchQuery?.trim();
  if (!searchQuery || !searchQuery.length) return;
  const result: ISearchResult<R> = {
    searchTerm: searchQuery,
    hasSearchTerm: !!searchQuery.length,
    listItems: [],
  };
  result.listItems =
    listState?.items.filter((item) => matchesSearch(item, searchQuery)) ?? [];

  result.exactMatch = result.listItems.find((base) =>
    matchesSearchExactly(base, searchQuery)
  );
  return result;
};
export const sortItemListFn = <T extends ITrackingItem>(
  sort?: TItemListSort
) => {
  const MAXPRIO = Number.MAX_SAFE_INTEGER;
  const MINPRIO = Number.MIN_SAFE_INTEGER;
  const MAXDATE = '5000-1-1';
  const MINDATE = '1970-1-1';
  return (a: T, b: T): number => {
    switch (sort?.sortBy) {
      case 'name':
        return sort.sortDir === 'asc'
          ? a.name.localeCompare(b.name)
          : b.name.localeCompare(a.name);
      default:
        return 0;
    }
  };
};
export const filterAndSortItemList = <
  T extends IListState<R>,
  R extends ITrackingItem,
>(
  state: T,
  result?: ISearchResult<R>
): R[] => {
  return (result?.listItems ?? [...state.items])
    .filter((item) => !state.filterBy)
    .sort(sortItemListFn<R>(state.sort));
};

export const selectListStateFilter = createSelector(
  selectListState,
  (
    state
  ): {
    hasFilter: boolean;
  } => {
    return {
      hasFilter: !!state?.filterBy,
    };
  }
);

export const selectListSearchResult = createSelector(
  selectListState,
  (state: IAppState) => state,
  (state, appState): ISearchResult<ITrackingItem> | undefined => {
    return filterBySearchQuery(state);
  }
);

export const selectListItems = createSelector(
  selectListState,
  selectListSearchResult,
  (state, result): ITrackingItem[] | undefined =>
    state ? filterAndSortItemList(state, result) : undefined
);
