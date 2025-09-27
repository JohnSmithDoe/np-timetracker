import { inject, Injectable } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { catchError, from, map, of, switchMap, withLatestFrom } from 'rxjs';
import { fromPromise } from 'rxjs/internal/observable/innerFrom';
import { DatabaseService } from '../../services/database.service';
import { officeTimeActions } from './office-time.actions';
import { HttpClient } from '@angular/common/http';
import { Store } from '@ngrx/store';
import { selectOfficeTimeState } from './office-time.selector';
import { Dayjs } from 'dayjs';
import {
  dayjsFromString,
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

  initOfficeTime$ = createEffect(() =>
    this.#actions$.pipe(
      ofType(officeTimeActions.initOfficeTime),
      map(() => officeTimeActions.loadHolidays())
    )
  );

  rotateBarcode$ = createEffect(() =>
    this.#actions$.pipe(
      ofType(officeTimeActions.rotateBarcode),
      withLatestFrom(this.#store.select(selectOfficeTimeState)),
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
        officeTimeActions.saveWorkingHoursDefault,
        officeTimeActions.saveDashboardSettings,
        officeTimeActions.addOfficeday,
        officeTimeActions.setOfficedays,
        officeTimeActions.addFreeday,
        officeTimeActions.setFreedays
      ),
      map(() => officeTimeActions.saveOfficeTime())
    );
  });

  saveOfficeTime$ = createEffect(() => {
    return this.#actions$.pipe(
      ofType(officeTimeActions.saveOfficeTime),
      withLatestFrom(this.#store.select(selectOfficeTimeState)),
      map(([_, state]) => {
        const toSave: IOfficeTimeStateStorage = {
          ...state,
          holidays: serializeDateMap(state.holidays),
          officedays: serializeDates(state.officedays),
          freedays: serializeDates(state.freedays),
        };
        return fromPromise(this.#database.save('officeTime', toSave));
      }),
      map(() => officeTimeActions.saveOfficeTimeSuccess())
    );
  });

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
      _holidays[key] = dayjsFromString(date);
    }
    return _holidays;
  };
}
