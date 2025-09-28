import { Component, inject } from '@angular/core';
import { TranslateModule, TranslateService } from '@ngx-translate/core';
import {
  selectDashboardSettings,
  selectTargetPercentage,
} from '../../../state/office-time/office-time.selectors';
import { Store } from '@ngrx/store';
import { AsyncPipe } from '@angular/common';
import {
  IonAlert,
  IonButton,
  IonItem,
  IonLabel,
  IonList,
  IonRange,
  IonToggle,
} from '@ionic/angular/standalone';
import { officeTimeActions } from '../../../state/office-time/office-time.actions';
import { AlertButton, ToggleChangeEventDetail } from '@ionic/angular';
import { filter, map } from 'rxjs';

@Component({
  selector: 'app-office-time-settings',
  templateUrl: './settings.component.html',
  styleUrls: ['./settings.component.scss'],
  imports: [
    AsyncPipe,
    IonItem,
    IonList,
    IonToggle,
    IonLabel,
    IonRange,
    IonAlert,
    IonButton,
    TranslateModule,
  ],
})
export class SettingsComponent {
  readonly #store = inject(Store);
  readonly #translate = inject(TranslateService);

  readonly alertButtons: AlertButton[] = [
    {
      text: this.#translate.instant('officetime.settings.reset.cancel'),
      role: 'cancel',
      cssClass: 'alert-button-success',
    },
    {
      text: this.#translate.instant('officetime.settings.reset.confirm'),
      role: 'confirm',
      cssClass: 'alert-button-danger',
      handler: () => this.resetData(),
    },
  ];

  readonly dashboardSettings$ = this.#store
    .select(selectDashboardSettings)
    .pipe(
      filter((settings) => !!settings),
      map((settings) =>
        Object.entries(settings).map(([key, value]) => ({ key, value }))
      )
    );

  readonly targetPercentage$ = this.#store.select(selectTargetPercentage);

  changeDashboardSettings($event: CustomEvent<ToggleChangeEventDetail>) {
    this.#store.dispatch(
      officeTimeActions.saveDashboardSettings(
        $event.detail.value,
        $event.detail.checked
      )
    );
  }

  changeTargetPercentage($event: CustomEvent<{ value: number }>) {
    this.#store.dispatch(
      officeTimeActions.saveTargetPercentage($event.detail.value)
    );
  }

  resetData() {
    this.#store.dispatch(officeTimeActions.resetData());
  }
}
