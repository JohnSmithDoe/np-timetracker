import { inject, Injectable } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { Store } from '@ngrx/store';
import { combineLatestWith, map, withLatestFrom } from 'rxjs';
import { fromPromise } from 'rxjs/internal/observable/innerFrom';
import { IAppState } from '../@types/types';
import { matchesItemExactly } from '../app.utils';
import { DatabaseService } from '../services/database.service';
import { addTrackingItemFromSearch } from './@shared/item-list.effects';

import { updatedSearchQuery } from './@shared/item-list.utils';
import { ApplicationActions } from './application.actions';
import { TrackingActions } from './tracking/tracking.actions';

@Injectable({ providedIn: 'root' })
export class ApplicationEffects {
  #actions$ = inject(Actions);
  #store = inject(Store);
  #database = inject(DatabaseService);

  initializeApplication$ = createEffect(() => {
    return this.#actions$.pipe(
      ofType(ApplicationActions.load),
      combineLatestWith(fromPromise(this.#database.create())),
      map(([_, data]) => ApplicationActions.loadedSuccessfully(data))
    );
  });

  addItemFromSearch$ = createEffect(() => {
    return this.#actions$.pipe(
      ofType(TrackingActions.addItemFromSearch),
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
      ofType(TrackingActions.addOrUpdateItem),
      withLatestFrom(this.#store, (action, state: IAppState) => ({
        action,
        state,
      })),
      map(({ action, state }) => {
        const localState = state.tracking;
        return matchesItemExactly(action.item, localState.items)
          ? TrackingActions.updateItem(action.item)
          : TrackingActions.addItem(<any>action.item);
      })
    );
  });

  clearSearch$ = createEffect(() => {
    return this.#actions$.pipe(
      ofType(TrackingActions.addItem),
      map(({ type }) => {
        return TrackingActions.updateSearch('');
      })
    );
  });
  updateSearch$ = createEffect(() => {
    return this.#actions$.pipe(
      ofType(TrackingActions.updateItem),
      withLatestFrom(this.#store, (action, state: IAppState) => ({
        action,
        state,
      })),
      map(({ action, state }) => {
        const searchQuery = state.tracking.searchQuery;
        return TrackingActions.updateSearch(
          updatedSearchQuery(action.item, searchQuery)
        );
      })
    );
  });

  saveOnChange$ = createEffect(
    () => {
      return this.#actions$.pipe(
        ofType(
          TrackingActions.addItem,
          TrackingActions.removeItem,
          TrackingActions.updateItem,
          TrackingActions.updateTracking,
          TrackingActions.toggleTrackingItem,
          TrackingActions.resetTracking
        ),
        withLatestFrom(this.#store, (action, state: IAppState) => ({
          action,
          state,
        })),
        map(({ action, state }) => {
          const type = action.type;
          if (type.startsWith('[Tracking]')) {
            return fromPromise(this.#database.save('tracking', state.tracking));
          } else {
            throw Error('should not happen');
          }
        })
      );
    },
    { dispatch: false }
  );
}
