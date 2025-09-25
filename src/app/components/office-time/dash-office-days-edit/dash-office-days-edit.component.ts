import {Component, computed, inject, input} from '@angular/core';
import {IonCard, IonCardContent, IonCardHeader, IonCardTitle, IonDatetime, IonItem,} from '@ionic/angular/standalone';
import {TranslateModule} from '@ngx-translate/core';
import dayjs, {Dayjs} from 'dayjs';
import {DatetimeCustomEvent} from "@ionic/angular";
import {Store} from "@ngrx/store";
import {officeTimeActions} from "../../../state/office-time/office-time.actions";

@Component({
  selector: 'app-dash-office-days-edit',
  templateUrl: './dash-office-days-edit.component.html',
  styleUrls: ['./dash-office-days-edit.component.scss'],
  imports: [IonCard, IonCardContent, IonCardHeader, IonCardTitle, TranslateModule, IonItem, IonDatetime,],
})
export class DashOfficeDaysEditComponent {
  readonly #store = inject(Store);
  readonly title = input<string | undefined>();
  readonly officedays = input<Array<Dayjs> | undefined | null>();
  readonly officedates = computed(() => this.officedays()?.map(day => day.toISOString()) ?? []);


  updateOfficeDates(ev: DatetimeCustomEvent) {
    const dateStrings = Array.isArray(ev.detail.value) ? ev.detail.value : [ev.detail.value];
    const dates = dateStrings
    .filter((date): date is string  => !!date)
    .map(date => dayjs(date, 'YYYY-MM-DD').hour(12));
    this.#store.dispatch(officeTimeActions.setOfficedays(dates))
  }
}
