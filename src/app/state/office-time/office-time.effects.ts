import { inject, Injectable } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { catchError, map, of, switchMap, withLatestFrom } from 'rxjs';
import { fromPromise } from 'rxjs/internal/observable/innerFrom';
import { DatabaseService } from '../../services/database.service';
import { officeTimeActions } from './office-time.actions';
import { HttpClient } from '@angular/common/http';
import { Store } from '@ngrx/store';
import { selectOfficeTimeState } from './office-time.selector';
import dayjs, { Dayjs } from 'dayjs';

@Injectable({ providedIn: 'root' })
export class OfficeTimeEffects {
  #actions$ = inject(Actions);
  #store = inject(Store);
  #http = inject(HttpClient);
  #database = inject(DatabaseService);

  loadHolidays$ = createEffect(() => {
    return this.#actions$.pipe(
      ofType(officeTimeActions.loadHolidays),
      switchMap(() =>
        this.#loadHolidays().pipe(
          map(officeTimeActions.loadHolidaysSuccess),
          catchError(() => of(officeTimeActions.loadHolidaysFailure()))
        )
      )
    );
  });

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

  #loadHolidays = () => {
    const currentYear = new Date().getFullYear();
    return this.#http
      .get<
        Record<string, { datum: string }>
      >(`assets/holidays/${currentYear}-BE.json`)
      .pipe(map((holidays) => this.#parseHolidays(holidays)));
  };

  #parseHolidays = (holidays?: Record<string, { datum: string }>) => {
    const _holidays: Record<string, Dayjs> = {};
    for (const key in holidays) {
      const date = holidays[key].datum;
      _holidays[key] = dayjs(date);
    }
    return _holidays;
  };
}
