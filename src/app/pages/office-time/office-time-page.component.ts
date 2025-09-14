import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { IonContent, IonItem, IonList } from '@ionic/angular/standalone';
import { Store } from '@ngrx/store';
import { TranslateModule } from '@ngx-translate/core';
import { addIcons } from 'ionicons';
import { add, remove } from 'ionicons/icons';
import { PageHeaderComponent } from '../../components/pages/page-header/page-header.component';
import { AsyncPipe } from '@angular/common';
import {
  selectCurrentPercentage,
  selectHolidays,
  selectPartTimePercentage,
  selectPartTimeWorkDaysMonth,
  selectPartTimeWorkDaysYear,
  selectRemainingWorkDays,
  selectWorkDaysMonth,
  selectWorkDaysYear,
} from '../../state/office-time/office-time.selector';
import { IonViewWillEnter } from '../../@types/types';
import { officeTimeActions } from '../../state/office-time/office-time.actions';

@Component({
  selector: 'app-page-office-time',
  templateUrl: 'office-time-page.component.html',
  styleUrls: ['office-time-page.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [
    PageHeaderComponent,
    IonContent,
    TranslateModule,
    IonList,
    IonItem,
    AsyncPipe,
  ],
})
export class OfficeTimePage implements IonViewWillEnter {
  readonly #store = inject(Store);

  readonly workDaysYear$ = this.#store.select(selectWorkDaysYear);
  readonly workDaysMonth$ = this.#store.select(selectWorkDaysMonth);
  readonly remainingWorkDays$ = this.#store.select(selectRemainingWorkDays);
  readonly holidays$ = this.#store.select(selectHolidays);
  readonly currentPercentage$ = this.#store.select(selectCurrentPercentage);
  readonly partTimeWorkDaysYear$ = this.#store.select(
    selectPartTimeWorkDaysYear
  );
  readonly partTimeWorkDaysMonth$ = this.#store.select(
    selectPartTimeWorkDaysMonth
  );
  readonly partTimePercentage$ = this.#store.select(selectPartTimePercentage);

  constructor() {
    addIcons({ add, remove });
  }

  ionViewWillEnter(): void {
    this.#store.dispatch(officeTimeActions.loadHolidays());
  }

  addOfficeDay() {
    this.#store.dispatch(officeTimeActions.addOfficeTime());
  }
}
