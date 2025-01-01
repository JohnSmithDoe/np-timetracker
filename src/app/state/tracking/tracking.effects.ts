import { inject, Injectable } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { Store } from '@ngrx/store';
import { interval, map, switchMap, takeWhile, withLatestFrom } from 'rxjs';
import { TrackingActions } from './tracking.actions';
import { selectRunningTrackingItem } from './tracking.selector';

@Injectable({ providedIn: 'root' })
export class TrackingEffects {
  #actions$ = inject(Actions);
  #store = inject(Store);
  #trackerId?: number;

  toggleTracking$ = createEffect(() => {
    return this.#actions$.pipe(
      ofType(TrackingActions.toggleTrackingItem),
      switchMap(() => {
        return interval(1000).pipe(
          withLatestFrom(this.#store.select(selectRunningTrackingItem)),
          takeWhile(([interval, item]) => !!item),
          map(([interval, item]) => {
            if (!item) return TrackingActions.updateItem(item);
            return TrackingActions.updateItem({
              ...item,
              trackedSeconds: (item.trackedSeconds ?? 0) + 1,
            });
          })
        );
      })
    );
  });
}
