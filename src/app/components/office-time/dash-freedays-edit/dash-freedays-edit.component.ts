import { Component, inject, input } from '@angular/core';
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
import { dayjsToString } from '../../../state/office-time/office-time.utils';

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
  ],
})
export class DashFreedaysEditComponent {
  readonly today = dayjsToString(dayjs());
  readonly #store = inject(Store);

  readonly title = input<string | undefined>();
  readonly freedays = input<Array<string>, Array<Dayjs> | undefined | null>(
    [],
    {
      transform: (value) =>
        (value ?? []).map((s) => dayjsToString(s)).filter(Boolean),
    }
  );

  readonly holidays = input<
    {
      date: string;
      backgroundColor: string;
      border: string;
      textColor: string;
    }[],
    Dayjs[] | null | undefined
  >([], {
    transform: (holidays) =>
      (holidays ?? []).map((holiday) => ({
        date: holiday.format('YYYY-MM-DD'),
        textColor: '#800080',
        backgroundColor: '#ffc0cb',
        border: '1px solid #e91e63',
      })),
  });

  updateFreeDatesFromCalender(ev: DatetimeCustomEvent) {
    const dates = Array.isArray(ev.detail.value)
      ? ev.detail.value
      : [ev.detail.value];

    this.#store.dispatch(officeTimeActions.setFreedays(dates));
  }
}
