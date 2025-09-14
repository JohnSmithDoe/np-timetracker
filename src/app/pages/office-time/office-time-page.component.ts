import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import {
  IonContent,
  IonFooter,
  IonInput,
  IonLabel,
  IonSegment,
  IonSegmentButton,
  IonSegmentContent,
  IonSegmentView,
  IonToolbar,
} from '@ionic/angular/standalone';
import { Store } from '@ngrx/store';
import { TranslateModule } from '@ngx-translate/core';
import { addIcons } from 'ionicons';
import { add, remove } from 'ionicons/icons';
import { PageHeaderComponent } from '../../components/pages/page-header/page-header.component';
import { selectHolidays, selectOfficeTime } from '../../state/office-time/office-time.selector';
import { IonViewWillEnter } from '../../@types/types';
import { officeTimeActions } from '../../state/office-time/office-time.actions';
import { DashboardComponent } from '../../components/office-time/dashboard/dashboard.component';

@Component({
  selector: 'app-page-office-time',
  templateUrl: 'office-time-page.component.html',
  styleUrls: ['office-time-page.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [PageHeaderComponent, IonContent, TranslateModule, IonSegment, IonSegmentButton, IonLabel, IonSegmentView, IonSegmentContent, IonToolbar, IonFooter, IonInput, DashboardComponent],
})
export class OfficeTimePage implements IonViewWillEnter {
  readonly #store = inject(Store);

  readonly holidays$ = this.#store.select(selectHolidays);
  readonly officeTime$ = this.#store.select(selectOfficeTime);

  constructor() {
    addIcons({ add, remove });
  }

  ionViewWillEnter(): void {
    this.#store.dispatch(officeTimeActions.loadHolidays());
  }



  onFileSelected($event: Event) {
    console.log($event);
  }
}
