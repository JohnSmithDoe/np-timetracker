import { Component, inject, input } from '@angular/core';
import {
  IonButton,
  IonCard,
  IonCardContent,
  IonCardHeader,
  IonCardTitle,
  IonIcon,
} from '@ionic/angular/standalone';
import { TranslateModule } from '@ngx-translate/core';
import { officeTimeActions } from '../../../state/office-time/office-time.actions';
import { Store } from '@ngrx/store';
import { todayIsOfficeDay } from '../../../state/office-time/office-time.selector';
import { AsyncPipe } from '@angular/common';
import { addIcons } from 'ionicons';
import { beer, business } from 'ionicons/icons';

@Component({
  selector: 'app-dash-button',
  templateUrl: './dash-button.component.html',
  styleUrls: ['./dash-button.component.scss'],
  imports: [
    IonCard,
    IonCardContent,
    IonCardHeader,
    IonCardTitle,
    IonIcon,
    TranslateModule,
    IonButton,
    AsyncPipe,
  ],
})
export class DashButtonComponent {
  readonly #store = inject(Store);
  readonly todayIsOfficeDay$ = this.#store.select(todayIsOfficeDay);

  readonly title = input<string | undefined>();

  constructor() {
    addIcons({ beer, business });
  }

  addOfficeDay() {
    this.#store.dispatch(officeTimeActions.addOfficeTime());
  }
}
