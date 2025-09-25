import {inject, Injectable} from '@angular/core';
import {Actions, createEffect, ofType} from '@ngrx/effects';
import {Store} from '@ngrx/store';
import {combineLatestWith, map, withLatestFrom} from 'rxjs';
import {fromPromise} from 'rxjs/internal/observable/innerFrom';
import {IAppState} from '../@types/types';
import {matchesItemExactly} from '../app.utils';
import {DatabaseService} from '../services/database.service';
import {addTrackingItemFromSearch} from './@shared/item-list.effects';

import {updatedSearchQuery} from './@shared/item-list.utils';
import {applicationActions} from './application.actions';
import {trackingActions} from './tracking/trackingActions';

@Injectable({ providedIn: 'root' })
export class ApplicationEffects {
  #actions$ = inject(Actions);
  #store = inject(Store);
  #database = inject(DatabaseService);

  initializeApplication$ = createEffect(() => {
    return this.#actions$.pipe(
      ofType(applicationActions.load),
      combineLatestWith(fromPromise(this.#database.create())),
      map(([_, data]) => applicationActions.loadedSuccessfully(data))
    );
  });

  addItemFromSearch$ = createEffect(() => {
    return this.#actions$.pipe(
      ofType(trackingActions.addItemFromSearch),
      withLatestFrom(this.#store, (action, state: IAppState) => ({
        action,
        state,
      })),
      map(({ action, state }) => {
        switch (action.type) {
          case '[Tracking] Add Item From Search':
            return addTrackingItemFromSearch(state);
        }
      })
    );
  });
  addOrUpdateItem$ = createEffect(() => {
    return this.#actions$.pipe(
      ofType(trackingActions.addOrUpdateItem),
      withLatestFrom(this.#store, (action, state: IAppState) => ({
        action,
        state,
      })),
      map(({ action, state }) => {
        const localState = state.tracking;
        return matchesItemExactly(action.item, localState.items)
          ? trackingActions.updateItem(action.item)
          : trackingActions.addItem(<any>action.item);
      })
    );
  });

  clearSearch$ = createEffect(() => {
    return this.#actions$.pipe(
      ofType(trackingActions.addItem),
      map(({ type }) => {
        return trackingActions.updateSearch('');
      })
    );
  });
  updateSearch$ = createEffect(() => {
    return this.#actions$.pipe(
      ofType(trackingActions.updateItem),
      withLatestFrom(this.#store, (action, state: IAppState) => ({
        action,
        state,
      })),
      map(({ action, state }) => {
        const searchQuery = state.tracking.searchQuery;
        return trackingActions.updateSearch(
          updatedSearchQuery(action.item, searchQuery)
        );
      })
    );
  });

  saveOnChange$ = createEffect(
    () => {
      return this.#actions$.pipe(
        ofType(
          trackingActions.addItem,
          trackingActions.removeItem,
          trackingActions.updateItem,
          trackingActions.updateTracking,
          trackingActions.toggleTrackingItem,
          trackingActions.resetTracking,
          trackingActions.saveAndResetTracking,
          trackingActions.resetAllTracking,
          trackingActions.removeDataItem
        ),
        withLatestFrom(this.#store, (action, state: IAppState) => ({
          action,
          state,
        })),
        map(({ action, state }) => {
          return fromPromise(this.#database.save('tracking', state.tracking));
        })
      );
    },
    { dispatch: false }
  );
}
