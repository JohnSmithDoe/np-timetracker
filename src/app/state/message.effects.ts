import { inject, Injectable } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { EMPTY, exhaustMap, map, tap, withLatestFrom } from 'rxjs';
import { fromPromise } from 'rxjs/internal/observable/innerFrom';
import { UiService } from '../services/ui.service';
import { TrackingActions } from './tracking/tracking.actions';
import { IAppState } from '../@types/types';
import { Store } from '@ngrx/store';

@Injectable({ providedIn: 'root' })
export class MessageEffects {
  #actions$ = inject(Actions);
  #uiService = inject(UiService);
  #store = inject(Store<IAppState>);

  savedSuccess$ = createEffect(
    () => {
      return this.#actions$.pipe(
        ofType(TrackingActions.saveAndResetTracking),
        withLatestFrom(this.#store, (_action, state: IAppState) => ({
          state,
        })),
        // filter(
        //   ({ state }) =>
        //     !!state.tracking.items.filter((item) => !!item.startTime).length
        // ),
        map(() => {
          return fromPromise(
            this.#uiService.showToast('Einträge wurden gespeichert')
          );
        })
      );
    },
    { dispatch: false }
  );

  addItemSuccess$ = createEffect(
    () => {
      return this.#actions$.pipe(
        ofType(TrackingActions.addItem),
        map(({ item }) => {
          if (!item.name.length) return;
          return fromPromise(this.#uiService.showAddItemToast(item.name));
        })
      );
    },
    { dispatch: false }
  );

  addItemFailure$ = createEffect(
    () => {
      return this.#actions$.pipe(
        ofType(TrackingActions.addItemFailure),
        exhaustMap(({ item }) => {
          return fromPromise(this.#uiService.showItemContainedToast(item.name));
        })
      );
    },
    { dispatch: false }
  );

  updateItemSussess$ = createEffect(
    () => {
      return this.#actions$.pipe(
        ofType(TrackingActions.updateItem),
        exhaustMap(({ item }) => {
          if (!item) return EMPTY;
          return fromPromise(this.#uiService.showUpdateItemToast(item));
        })
      );
    },
    { dispatch: false }
  );

  removeItemSussess$ = createEffect(
    () => {
      return this.#actions$.pipe(
        ofType(TrackingActions.removeItem),
        tap(({ item }) => {
          return this.#uiService.showRemoveItemToast(item.name);
        })
      );
    },
    { dispatch: false }
  );
}
