import {Component, inject} from '@angular/core';
import {TranslateModule} from '@ngx-translate/core';
import {dashboardSettings, workingHours, workingHoursDefault,} from '../../../state/office-time/office-time.selector';
import {Store} from '@ngrx/store';
import {AsyncPipe} from '@angular/common';
import {IonItem, IonLabel, IonList, IonToggle,} from '@ionic/angular/standalone';
import {officeTimeActions} from '../../../state/office-time/office-time.actions';
import {ToggleChangeEventDetail} from '@ionic/angular';
import {filter, map} from "rxjs";
import {NumberInputComponent} from "../../forms/number-input/number-input.component";

@Component({
  selector: 'app-office-time-settings',
  templateUrl: './settings.component.html',
  styleUrls: ['./settings.component.scss'],
  imports: [TranslateModule, AsyncPipe, IonItem, IonList, IonToggle, IonLabel, NumberInputComponent,],
})
export class SettingsComponent {
  readonly #store = inject(Store);
  readonly workingHours$ = this.#store.select(workingHours);
  readonly workingHoursDefault$ = this.#store.select(workingHoursDefault);
  readonly dashboardSettings$ = this.#store.select(dashboardSettings).pipe(
    filter(settings => !!settings),
    map(settings => (Object.entries(settings).map(([key, value]) => ({key, value})) as { key: string, value: boolean }[]))
  );


  workHoursChange(workingHours?: number) {
    if (!workingHours) return;
    this.#store.dispatch(
      officeTimeActions.saveWorkingHours(workingHours)
    );
  }

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
