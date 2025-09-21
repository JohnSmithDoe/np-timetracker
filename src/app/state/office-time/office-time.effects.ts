import { inject, Injectable } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import {
  catchError,
  from,
  map,
  of,
  switchMap,
  tap,
  withLatestFrom,
} from 'rxjs';
import { fromPromise } from 'rxjs/internal/observable/innerFrom';
import { DatabaseService } from '../../services/database.service';
import { officeTimeActions } from './office-time.actions';
import { HttpClient } from '@angular/common/http';
import { Store } from '@ngrx/store';
import { officeTimeState } from './office-time.selector';
import dayjs, { Dayjs } from 'dayjs';
import {
  rotateBase64,
  serializeDateMap,
  serializeDates,
} from './office-time.utils';
import { IOfficeTimeStateStorage } from '../../@types/types';

@Injectable({ providedIn: 'root' })
export class OfficeTimeEffects {
  #actions$ = inject(Actions);
  #store = inject(Store);
  #http = inject(HttpClient);
  #database = inject(DatabaseService);

  rotateBarcode$ = createEffect(() =>
    this.#actions$.pipe(
      ofType(officeTimeActions.rotateBarcode),
      withLatestFrom(this.#store.select(officeTimeState)), // selector that returns IOfficeTimeState
      switchMap(([_, state]) => {
        return from(rotateBase64(state.barcode, 90)).pipe(
          map((rotated) =>
            officeTimeActions.rotateBarcodeSuccess(
              rotated ?? state.barcode ?? ''
            )
          )
        );
      })
    )
  );

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

  saveOn$ = createEffect(() => {
    return this.#actions$.pipe(
      ofType(
        officeTimeActions.saveBarcode,
        officeTimeActions.deleteBarcode,
        officeTimeActions.rotateBarcodeSuccess,
        officeTimeActions.addOfficeTime,
        officeTimeActions.saveWorkingHours,
        officeTimeActions.saveWorkingHoursDefault
      ),
      map(() => officeTimeActions.saveOfficeTime()),
      tap(() => {
        console.log(
          'savedsavedsavedsavedsavedsavedsavedsavedsavedsavedsavedsavedsavedsavedsaved'
        );
      })
    );
  });

  saveOfficeTime$ = createEffect(
    () => {
      return this.#actions$.pipe(
        ofType(officeTimeActions.saveOfficeTime),
        withLatestFrom(this.#store.select(officeTimeState)),
        map(([_, state]) => {
          const toSave: IOfficeTimeStateStorage = {
            ...state,
            holidays: serializeDateMap(state.holidays),
            officeDays: serializeDates(state.officeDays),
          };
          return fromPromise(this.#database.save('officeTime', toSave));
        })
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
