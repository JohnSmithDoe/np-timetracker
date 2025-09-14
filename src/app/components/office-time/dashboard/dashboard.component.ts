import { Component, inject } from '@angular/core';
import { IonItem, IonList } from '@ionic/angular/standalone';
import { DashPercentageComponent } from '../dash-percentage/dash-percentage.component';
import { DashStatsComponent } from '../dash-stats/dash-stats.component';
import { Store } from '@ngrx/store';
import { selectHolidays, selectOfficeTime } from '../../../state/office-time/office-time.selector';
import { addIcons } from 'ionicons';
import { add, remove } from 'ionicons/icons';
import { AsyncPipe } from '@angular/common';
import { TranslateModule } from '@ngx-translate/core';
import { officeTimeActions } from '../../../state/office-time/office-time.actions';
import { DashButtonComponent } from '../dash-button/dash-button.component';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss'],
  imports: [IonList, IonItem, DashPercentageComponent, DashStatsComponent, AsyncPipe, TranslateModule, DashButtonComponent],
})
export class DashboardComponent {
  readonly #store = inject(Store);

  readonly holidays$ = this.#store.select(selectHolidays);
  readonly officeTime$ = this.#store.select(selectOfficeTime);

  constructor() {
    addIcons({ add, remove });
  }

  addOfficeDay() {
    this.#store.dispatch(officeTimeActions.addOfficeTime());
  }
}
