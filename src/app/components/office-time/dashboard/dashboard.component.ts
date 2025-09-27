import { Component, inject } from '@angular/core';
import { Store } from '@ngrx/store';
import {
  dashboardStatsMonth,
  dashboardStatsYear,
  selectDashboardSettings,
  selectFreedays,
  selectHolidayDates,
  selectHolidaysForYear,
  selectOfficedays,
} from '../../../state/office-time/office-time.selector';
import { addIcons } from 'ionicons';
import { add, remove } from 'ionicons/icons';
import { AsyncPipe } from '@angular/common';
import { TranslateModule } from '@ngx-translate/core';
import { DashButtonComponent } from '../dash-button/dash-button.component';
import { DashStatsComponent } from '../dash-stats/dash-stats.component';
import { DashHolidaysComponent } from '../dash-holidays/dash-holidays.component';
import { DashDateComponent } from '../dash-date/dash-date.component';
import { DashDaysListComponent } from '../dash-days-list/dash-days-list.component';
import { DashOfficeDaysEditComponent } from '../dash-office-days-edit/dash-office-days-edit.component';
import { DashFreedaysEditComponent } from '../dash-freedays-edit/dash-freedays-edit.component';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss'],
  imports: [
    AsyncPipe,
    TranslateModule,
    DashButtonComponent,
    DashStatsComponent,
    DashHolidaysComponent,
    DashDateComponent,
    DashDaysListComponent,
    DashOfficeDaysEditComponent,
    DashFreedaysEditComponent,
  ],
})
export class DashboardComponent {
  readonly #store = inject(Store);

  readonly holidays$ = this.#store.select(selectHolidaysForYear);
  readonly holidates$ = this.#store.select(selectHolidayDates);
  readonly officedays$ = this.#store.select(selectOfficedays);
  readonly freedays$ = this.#store.select(selectFreedays);

  readonly statsMonth$ = this.#store.select(dashboardStatsMonth);
  readonly statsYear$ = this.#store.select(dashboardStatsYear);

  readonly dashboardSettings$ = this.#store.select(selectDashboardSettings);

  constructor() {
    addIcons({ add, remove });
  }
}
