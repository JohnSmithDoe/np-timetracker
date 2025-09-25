import {Component, computed, inject, input} from '@angular/core';
import {IonCard, IonCardContent, IonCardHeader, IonCardTitle, IonDatetime, IonItem,} from '@ionic/angular/standalone';
import {TranslateModule} from '@ngx-translate/core';
import dayjs, {Dayjs} from 'dayjs';
import {DatetimeCustomEvent} from "@ionic/angular";
import {Store} from "@ngrx/store";
import {officeTimeActions} from "../../../state/office-time/office-time.actions";

@Component({
  selector: 'app-dash-free-days-edit',
  templateUrl: './dash-free-days-edit.component.html',
  styleUrls: ['./dash-free-days-edit.component.scss'],
  imports: [IonCard, IonCardContent, IonCardHeader, IonCardTitle, TranslateModule, IonItem, IonDatetime,],
})
export class DashFreeDaysEditComponent {
  readonly today = dayjs().toISOString();
  readonly #store = inject(Store);
  readonly title = input<string | undefined>();
  readonly freedays = input<Array<Dayjs> | undefined | null>();
  readonly holidays = input<{name:string,date: Dayjs}[] | undefined | null>();
  readonly holiDates = computed(() => (this.holidays()??[]).map((holiday) => holiday.date) ?? []);
  readonly freeDates = computed(() => {
    //return [];
    const result = [...(this.freedays()??[]), ...(this.holiDates() ?? [])]
    .map(day => day.toISOString());
    console.log(result);
    return result;
  });


  updateFreeDates(ev: DatetimeCustomEvent) {
    const dateStrings = Array.isArray(ev.detail.value) ? ev.detail.value : [ev.detail.value];
    const dates = dateStrings
    .filter((date): date is string  => !!date)
    .map(date => dayjs(date, 'YYYY-MM-DD').hour(12));
    this.#store.dispatch(officeTimeActions.setFreedays(dates))
  }
}
