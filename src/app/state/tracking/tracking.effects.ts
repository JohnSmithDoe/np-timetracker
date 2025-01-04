import { inject, Injectable } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { Store } from '@ngrx/store';
import { interval, map, switchMap, withLatestFrom } from 'rxjs';
import { TrackingActions } from './tracking.actions';
import {
  selectRunningTrackingItem,
  selectTrackingDataAsCSV,
} from './tracking.selector';
import { IAppState } from '../../@types/types';
import { fromPromise } from 'rxjs/internal/observable/innerFrom';
import { DatabaseService } from '../../services/database.service';
import { ApplicationActions } from '../application.actions';
import { Share } from '@capacitor/share';

@Injectable({ providedIn: 'root' })
export class TrackingEffects {
  #actions$ = inject(Actions);
  #store = inject(Store);
  #database = inject(DatabaseService);

  trackTime$ = createEffect(() => {
    return this.#actions$.pipe(
      ofType(
        TrackingActions.toggleTrackingItem,
        ApplicationActions.loadedSuccessfully
      ),
      switchMap(() => {
        return interval(1000).pipe(
          withLatestFrom(this.#store.select(selectRunningTrackingItem)),
          map(([interval, item]) => {
            if (!item) return TrackingActions.endTracking();
            return TrackingActions.updateTracking(item);
          })
        );
      })
    );
  });

  saveAndReset$ = createEffect(
    () => {
      return this.#actions$.pipe(
        ofType(TrackingActions.saveAndResetTracking),
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

  shareData$ = createEffect(
    () => {
      return this.#actions$.pipe(
        ofType(TrackingActions.shareData),
        withLatestFrom(this.#store.select(selectTrackingDataAsCSV)),
        switchMap(([action, csv]) => {
          return fromPromise(
            Share.share({
              title: 'Zeiterfassung als CSV',
              text: csv,
              dialogTitle: 'Sharing is caring',
            })
          );
        })
      );
    },
    { dispatch: false }
  );
}
