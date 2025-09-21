import { Component, inject } from '@angular/core';
import { DashPercentageComponent } from '../dash-percentage/dash-percentage.component';
import { Store } from '@ngrx/store';
import {
  dashboardStatsMonth,
  dashboardStatsYear,
  holidays,
  isPartTime,
  officeDays,
} from '../../../state/office-time/office-time.selector';
import { addIcons } from 'ionicons';
import { add, remove } from 'ionicons/icons';
import { AsyncPipe } from '@angular/common';
import { TranslateModule } from '@ngx-translate/core';
import { DashButtonComponent } from '../dash-button/dash-button.component';
import { DashOfficeDaysComponent } from '../dash-office-days/dash-office-days.component';
import { DashStatsComponent } from '../dash-stats/dash-stats.component';
import { DashHolidaysComponent } from '../dash-holidays/dash-holidays.component';
import { DashDateComponent } from '../dash-date/dash-date.component';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss'],
  imports: [
    AsyncPipe,
    TranslateModule,
    DashButtonComponent,
    DashPercentageComponent,
    DashOfficeDaysComponent,
    DashStatsComponent,
    DashHolidaysComponent,
    DashDateComponent,
  ],
})
export class DashboardComponent {
  readonly #store = inject(Store);

  readonly holidays$ = this.#store.select(holidays);
  readonly officeDays$ = this.#store.select(officeDays);
  readonly isPartTime$ = this.#store.select(isPartTime);

  readonly statsMonth$ = this.#store.select(dashboardStatsMonth);
  readonly statsYear$ = this.#store.select(dashboardStatsYear);

  constructor() {
    addIcons({ add, remove });
  }
}
