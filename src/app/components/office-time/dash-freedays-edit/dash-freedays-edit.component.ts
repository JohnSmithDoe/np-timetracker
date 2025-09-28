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
import {
  dayjsToString,
  daysToHighlightsInputTransform,
} from '../../../state/office-time/office-time.utils';
import { DateTimeHighlight } from '../../../@types/types';

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

  readonly holidays = input<DateTimeHighlight[], Dayjs[] | null | undefined>(
    [],
    { transform: daysToHighlightsInputTransform }
  );

  updateFreeDatesFromCalender(ev: DatetimeCustomEvent) {
    const dates = Array.isArray(ev.detail.value)
      ? ev.detail.value
      : [ev.detail.value];

    this.#store.dispatch(officeTimeActions.setFreedays(dates));
  }
}
