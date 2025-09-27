import { Component, inject } from '@angular/core';
import { TranslateModule } from '@ngx-translate/core';
import {
  selectDashboardSettings,
  selectWorkingHoursDefault,
} from '../../../state/office-time/office-time.selectors';
import { Store } from '@ngrx/store';
import { AsyncPipe } from '@angular/common';
import {
  IonItem,
  IonLabel,
  IonList,
  IonToggle,
} from '@ionic/angular/standalone';
import { officeTimeActions } from '../../../state/office-time/office-time.actions';
import { ToggleChangeEventDetail } from '@ionic/angular';
import { filter, map } from 'rxjs';
import { NumberInputComponent } from '../../forms/number-input/number-input.component';

@Component({
  selector: 'app-office-time-settings',
  templateUrl: './settings.component.html',
  styleUrls: ['./settings.component.scss'],
  imports: [
    TranslateModule,
    AsyncPipe,
    IonItem,
    IonList,
    IonToggle,
    IonLabel,
    NumberInputComponent,
  ],
})
export class SettingsComponent {
  readonly #store = inject(Store);
  readonly workingHoursDefault$ = this.#store.select(selectWorkingHoursDefault);
  readonly dashboardSettings$ = this.#store
    .select(selectDashboardSettings)
    .pipe(
      filter((settings) => !!settings),
      map(
        (settings) =>
          Object.entries(settings).map(([key, value]) => ({ key, value })) as {
            key: string;
            value: boolean;
          }[]
      )
    );

  workHoursDefaultChange(workingHours?: number) {
    if (!workingHours) return;
    console.log(workingHours);
    this.#store.dispatch(
      officeTimeActions.saveWorkingHoursDefault(Number(workingHours))
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
