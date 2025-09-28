import { Component, inject } from '@angular/core';
import { Store } from '@ngrx/store';
import {
  selectDashboardItems,
  selectDashboardSettings,
  selectFreedays,
  selectHolidayDays,
  selectHolidays,
  selectOfficedays,
} from '../../../state/office-time/office-time.selectors';
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
import {
  selectDashboardStatsMonth,
  selectDashboardStatsQuarter,
  selectDashboardStatsWeek,
  selectDashboardStatsYear,
} from '../../../state/office-time/office-time.stats.selectors';
import { combineLatestWith, filter, map } from 'rxjs';

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

  readonly holidays$ = this.#store.select(selectHolidays);
  readonly holidates$ = this.#store.select(selectHolidayDays);
  readonly officedays$ = this.#store.select(selectOfficedays);
  readonly freedays$ = this.#store.select(selectFreedays);

  readonly statsWeek$ = this.#store.select(selectDashboardStatsWeek);
  readonly statsMonth$ = this.#store.select(selectDashboardStatsMonth);
  readonly statsQuarter$ = this.#store.select(selectDashboardStatsQuarter);
  readonly statsYear$ = this.#store.select(selectDashboardStatsYear);

  readonly dashboardSettings$ = this.#store.select(selectDashboardSettings);
  readonly dashboardItems$ = this.#store.select(selectDashboardItems);

  readonly visibleDashboardItems$ = this.dashboardItems$.pipe(
    combineLatestWith(this.dashboardSettings$),
    filter(([items, settings]) => !!items && !!settings),
    map(([items, settings]) => {
      return items.filter((item) => {
        switch (item) {
          case 'date':
            return settings.showDateCard;
          case 'button':
            return true;
          case 'officedays-list':
            return settings.showOfficedaysCardList;
          case 'officedays-edit':
            return settings.showOfficedaysCardEdit;
          case 'freedays-list':
            return settings.showFreedaysCardList;
          case 'freedays-edit':
            return settings.showFreedaysCardEdit;
          case 'stats-year':
            return settings.showStatsYear;
          case 'stats-quarter':
            return settings.showStatsQuarter;
          case 'stats-month':
            return settings.showStatsMonth;
          case 'stats-week':
            return settings.showStatsWeek;
          case 'holidays':
            return settings.showHolidaysCard;
          default:
            return false;
        }
      });
    })
  );

  constructor() {
    addIcons({ add, remove });
  }
}
