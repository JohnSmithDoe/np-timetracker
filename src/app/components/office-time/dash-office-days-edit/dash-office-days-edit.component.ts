import { Component, computed, inject, input } from '@angular/core';
import {
  IonCard,
  IonCardContent,
  IonCardHeader,
  IonCardTitle,
  IonDatetime,
} from '@ionic/angular/standalone';
import { TranslateModule } from '@ngx-translate/core';
import { Dayjs } from 'dayjs';
import { DatetimeCustomEvent } from '@ionic/angular';
import { Store } from '@ngrx/store';
import { officeTimeActions } from '../../../state/office-time/office-time.actions';
import {
  dayjsFromString,
  dayjsToString,
} from '../../../state/office-time/office-time.utils';

@Component({
  selector: 'app-dash-office-days-edit',
  templateUrl: './dash-office-days-edit.component.html',
  styleUrls: ['./dash-office-days-edit.component.scss'],
  imports: [
    IonCard,
    IonCardContent,
    IonCardHeader,
    IonCardTitle,
    TranslateModule,
    IonDatetime,
  ],
})
export class DashOfficeDaysEditComponent {
  readonly #store = inject(Store);
  readonly title = input<string | undefined>();
  readonly officedays = input<Array<Dayjs> | undefined | null>();
  readonly officedates = computed(
    () => this.officedays()?.map(dayjsToString) ?? []
  );

  updateOfficeDates(ev: DatetimeCustomEvent) {
    const dateStrings = Array.isArray(ev.detail.value)
      ? ev.detail.value
      : [ev.detail.value];
    const dates = dateStrings
      .filter((date): date is string => !!date)
      .map(dayjsFromString);
    this.#store.dispatch(officeTimeActions.setOfficedays(dates));
  }
}
