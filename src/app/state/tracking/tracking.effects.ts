import {inject, Injectable} from '@angular/core';
import {Actions, createEffect, ofType} from '@ngrx/effects';
import {Store} from '@ngrx/store';
import {interval, map, switchMap, withLatestFrom} from 'rxjs';
import {trackingActions} from './trackingActions';
import {selectRunningTrackingItem, selectTrackingDataAsCSV,} from './tracking.selector';
import {fromPromise} from 'rxjs/internal/observable/innerFrom';
import {applicationActions} from '../application.actions';
import {Share} from '@capacitor/share';

@Injectable({ providedIn: 'root' })
export class TrackingEffects {
  #actions$ = inject(Actions);
  #store = inject(Store);

  trackTime$ = createEffect(() => {
    return this.#actions$.pipe(
      ofType(
        trackingActions.toggleTrackingItem,
        applicationActions.loadedSuccessfully
      ),
      switchMap(() => {
        return interval(1000).pipe(
          withLatestFrom(this.#store.select(selectRunningTrackingItem)),
          map(([, item]) => {
            if (!item) return trackingActions.endTracking();
            return trackingActions.updateTracking(item);
          })
        );
      })
    );
  });

  shareData$ = createEffect(
    () => {
      return this.#actions$.pipe(
        ofType(trackingActions.shareData),
        withLatestFrom(this.#store.select(selectTrackingDataAsCSV)),
        switchMap(([, csv]) => {
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
