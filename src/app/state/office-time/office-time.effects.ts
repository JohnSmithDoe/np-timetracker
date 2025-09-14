import { inject, Injectable } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { catchError, map, of, switchMap, withLatestFrom } from 'rxjs';
import { fromPromise } from 'rxjs/internal/observable/innerFrom';
import { DatabaseService } from '../../services/database.service';
import { officeTimeActions } from './office-time.actions';
import { loadHolidays } from './office-time.utils';
import { HttpClient } from '@angular/common/http';
import { Store } from '@ngrx/store';
import { selectOfficeTimeState } from './office-time.selector';

@Injectable({ providedIn: 'root' })
export class OfficeTimeEffects {
  #actions$ = inject(Actions);
  #store = inject(Store);
  #database = inject(DatabaseService);
  #http = inject(HttpClient);

  loadHolidays$ = createEffect(
    () => {
      return this.#actions$.pipe(
        ofType(officeTimeActions.loadHolidays),
        switchMap(() => loadHolidays(this.#http).pipe(
          map(officeTimeActions.loadHolidaysSuccess),
          catchError(() => of(officeTimeActions.loadHolidaysFailure()))))
      );
    }
  );

  saveOfficeTime$ = createEffect(
    () => {
      return this.#actions$.pipe(
        ofType(officeTimeActions.saveOfficeTime),
        withLatestFrom(this.#store.select(selectOfficeTimeState)),
        map(([_, officeTimeState]) =>
          fromPromise(this.#database.save('officeTime', officeTimeState))
        )
      );
    },
    { dispatch: false }
  );
}
