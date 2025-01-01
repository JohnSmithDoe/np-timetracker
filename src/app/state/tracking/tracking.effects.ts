import { inject, Injectable } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { Store } from '@ngrx/store';
import { interval, map, switchMap, withLatestFrom } from 'rxjs';
import { TrackingActions } from './tracking.actions';
import { selectRunningTrackingItem } from './tracking.selector';

@Injectable({ providedIn: 'root' })
export class TrackingEffects {
  #actions$ = inject(Actions);
  #store = inject(Store);

  trackTime$ = createEffect(() => {
    return this.#actions$.pipe(
      ofType(TrackingActions.toggleTrackingItem),
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
}
