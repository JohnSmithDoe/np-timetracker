import { Component, computed, inject, input } from '@angular/core';
import {
  IonCard,
  IonCardContent,
  IonCardHeader,
  IonCardTitle,
  IonDatetime,
} from '@ionic/angular/standalone';
import { TranslateModule } from '@ngx-translate/core';
import dayjs, { Dayjs } from 'dayjs';
import { DatetimeCustomEvent } from '@ionic/angular';
import { Store } from '@ngrx/store';
import { officeTimeActions } from '../../../state/office-time/office-time.actions';
import {
  dayjsFromString,
  dayjsToString,
} from '../../../state/office-time/office-time.utils';
import { JsonPipe } from '@angular/common';

@Component({
  selector: 'app-dash-freedays-edit',
  templateUrl: './dash-freedays-edit.component.html',
  styleUrls: ['./dash-freedays-edit.component.scss'],
  imports: [
    IonCard,
    IonCardContent,
    IonCardHeader,
    IonCardTitle,
    TranslateModule,
    IonDatetime,
    JsonPipe,
  ],
})
export class DashFreedaysEditComponent {
  readonly today = dayjsToString(dayjs());
  readonly #store = inject(Store);
  readonly title = input<string | undefined>();
  readonly freedays = input<Array<Dayjs> | undefined | null>();
  readonly holidays = input<
    { name: string; date: Dayjs }[] | undefined | null
  >();
  readonly holiDates = computed(
    () => (this.holidays() ?? []).map((holiday) => holiday.date) ?? []
  );
  readonly freeDates = computed(
    () => ['2025-10-10T10:00:00.000Z', '2025-11-11T10:00:00.000Z']
    //[...(this.freedays() ?? []), ...(this.holiDates() ?? [])].map(dayjsToString)
  );

  updateFreeDates(ev: DatetimeCustomEvent) {
    const dateStrings = Array.isArray(ev.detail.value)
      ? ev.detail.value
      : [ev.detail.value];
    const dates = dateStrings
      .filter((date): date is string => !!date)
      .filter(
        (date) =>
          !this.holiDates()?.some((holiday) =>
            holiday.isSame(dayjsFromString(date))
          )
      )
      .map(dayjsFromString);
    console.log(dates, ' #######');
    this.#store.dispatch(officeTimeActions.setFreedays(dates));
  }
}
