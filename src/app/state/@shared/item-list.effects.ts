import { inject, Injectable } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { Store } from '@ngrx/store';
import { map, withLatestFrom } from 'rxjs';
import { IAppState } from '../../@types/types';
import { createTrackingItem } from '../../app.factory';
import { matchesItemExactly } from '../../app.utils';
import { trackingActions } from '../tracking/trackingActions';
import { itemListActions } from './item-list.actions';

@Injectable({ providedIn: 'root' })
export class ItemListEffects {
  #store = inject(Store<IAppState>);
  #actions$ = inject(Actions);
  // 'Add Item From Search': (listId:TItemListId) => ({ listId }),
  addItemFromSearch = createEffect(() => {
    return this.#actions$.pipe(
      ofType(itemListActions.addItemFromSearch),
      withLatestFrom(this.#store, (action, state: IAppState) => ({
        action,
        state,
      })),
      map(({ action, state }) => {
        return trackingActions.addItemFromSearch();
      })
    );
  });

  // 'Update Sort': (listId:TItemListId, sortBy?:
  updateSort = createEffect(() => {
    return this.#actions$.pipe(
      ofType(itemListActions.updateSort),
      map(({ sortBy, sortDir }) => trackingActions.updateSort(sortBy, sortDir))
    );
  });
  // 'Update Search': (listId:TItemListId, searchQuery?: string) => ({ searchQuery, listId }),
  updateSearch$ = createEffect(() => {
    return this.#actions$.pipe(
      ofType(itemListActions.updateSearch),
      map(({ searchQuery }) => trackingActions.updateSearch(searchQuery))
    );
  });
}

export const addTrackingItemFromSearch = (state: IAppState) => {
  const trackingItem = createTrackingItem(state.tracking.searchQuery ?? '');
  const foundItem = matchesItemExactly(trackingItem, state.tracking.items);
  return foundItem
    ? trackingActions.addItemFailure(foundItem)
    : trackingActions.addItem(trackingItem);
};
