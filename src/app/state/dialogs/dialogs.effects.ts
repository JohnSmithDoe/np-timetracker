import { inject, Injectable } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { Store } from '@ngrx/store';
import { map, withLatestFrom } from 'rxjs';
import { IAppState } from '../../@types/types';
import { createTrackingItem } from '../../app.factory';

import { DialogsActions } from './dialogs.actions';
import { selectEditState } from './dialogs.selector';
import { TrackingActions } from '../tracking/tracking.actions';

function createItemByListId(name: string) {
  return createTrackingItem(name);
}

@Injectable({ providedIn: 'root' })
export class DialogsEffects {
  #actions$ = inject(Actions);
  #store = inject(Store);

  confirmItemChanges$ = createEffect(() => {
    return this.#actions$.pipe(
      ofType(DialogsActions.confirmChanges),
      withLatestFrom(this.#store.select(selectEditState)),
      map(([_, state]) => {
        return TrackingActions.addOrUpdateItem(<any>state.item);
      })
    );
  });

  showCreateDialogWithSearch$ = createEffect(() => {
    return this.#actions$.pipe(
      ofType(DialogsActions.showCreateDialogWithSearch),
      withLatestFrom(this.#store, (action, state: IAppState) => ({
        action,
        state,
      })),
      map(({ action, state }) => {
        const name = state.tracking.searchQuery ?? '';
        const item = createItemByListId(name);
        return DialogsActions.showEditDialog(item);
      })
    );
  });
}
