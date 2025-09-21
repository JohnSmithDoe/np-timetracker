import {Component, inject} from '@angular/core';
import {TranslateModule} from '@ngx-translate/core';
import {dashboardSettings, workingHours, workingHoursDefault,} from '../../../state/office-time/office-time.selector';
import {Store} from '@ngrx/store';
import {AsyncPipe} from '@angular/common';
import {IonInput, IonItem, IonLabel, IonList, IonToggle,} from '@ionic/angular/standalone';
import {officeTimeActions} from '../../../state/office-time/office-time.actions';
import {ToggleChangeEventDetail} from '@ionic/angular';
import {filter, map} from "rxjs";
import {marker} from "@colsen1991/ngx-translate-extract-marker";

marker("officetime.page.settings.dashboard.dateCard");
marker("officetime.page.settings.dashboard.percentageCard");
marker("officetime.page.settings.dashboard.officedaysCard");
marker("officetime.page.settings.dashboard.holidaysCard");
marker("officetime.page.settings.dashboard.statsWeek");
marker("officetime.page.settings.dashboard.statsMonth");
marker("officetime.page.settings.dashboard.statsYear");

@Component({
  selector: 'app-office-time-settings',
  templateUrl: './settings.component.html',
  styleUrls: ['./settings.component.scss'],
  imports: [
    TranslateModule,
    AsyncPipe,
    IonInput,
    IonItem,
    IonList,
    IonToggle,
    IonLabel,
  ],
})
export class SettingsComponent {
  readonly #store = inject(Store);
  readonly workingHours$ = this.#store.select(workingHours);
  readonly workingHoursDefault$ = this.#store.select(workingHoursDefault);
  readonly dashboardSettings$ = this.#store.select(dashboardSettings).pipe(
    filter(settings => !!settings),
    map(settings => (Object.entries(settings).map(([key, value]) => ({key, value})) as { key: string, value: boolean }[]))
  );


  workHoursChange($event: CustomEvent<{ value?: string | null }>) {
    if ($event.detail.value === '') return;
    this.#store.dispatch(
      officeTimeActions.saveWorkingHours(Number($event.detail.value))
    );
  }

  workHoursDefaultChange($event: CustomEvent<{ value?: string | null }>) {
    if ($event.detail.value === '') return;
    this.#store.dispatch(
      officeTimeActions.saveWorkingHoursDefault(Number($event.detail.value))
    );
  }

  changeDashboardSettings($event: CustomEvent<ToggleChangeEventDetail>) {
    this.#store.dispatch(
      officeTimeActions.saveDashboardSettings(
        $event.detail.value,
        $event.detail.checked
      )
    );
  }
}
