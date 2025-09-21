import { Component, inject } from '@angular/core';
import { TranslateModule } from '@ngx-translate/core';
import {
  workingHours,
  workingHoursDefault,
} from '../../../state/office-time/office-time.selector';
import { Store } from '@ngrx/store';
import { AsyncPipe } from '@angular/common';
import { IonInput, IonItem, IonList } from '@ionic/angular/standalone';
import { officeTimeActions } from '../../../state/office-time/office-time.actions';

@Component({
  selector: 'app-office-time-settings',
  templateUrl: './settings.component.html',
  styleUrls: ['./settings.component.scss'],
  imports: [TranslateModule, AsyncPipe, IonInput, IonItem, IonList],
})
export class SettingsComponent {
  readonly #store = inject(Store);
  readonly workingHours$ = this.#store.select(workingHours);
  readonly workingHoursDefault$ = this.#store.select(workingHoursDefault);

  workHoursChange($event: CustomEvent<{ value?: string | null }>) {
    if ($event.detail.value === '') return;
    console.log('saving ');
    this.#store.dispatch(
      officeTimeActions.saveWorkingHours(Number($event.detail.value))
    );
  }

  workHoursDefaultChange($event: CustomEvent<{ value?: string | null }>) {
    if ($event.detail.value === '') return;
    console.log('saving ');
    this.#store.dispatch(
      officeTimeActions.saveWorkingHoursDefault(Number($event.detail.value))
    );
  }
}
