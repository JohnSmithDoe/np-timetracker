import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import {
  IonContent,
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
import { IonViewDidEnter, IonViewWillEnter } from '../../@types/types';
import { officeTimeActions } from '../../state/office-time/office-time.actions';
import { DashboardComponent } from '../../components/office-time/dashboard/dashboard.component';
import { BarcodeComponent } from '../../components/office-time/barcode/barcode.component';
import { SettingsComponent } from '../../components/office-time/settings/settings.component';
import { AsyncPipe } from '@angular/common';
import { BehaviorSubject } from 'rxjs';

@Component({
  selector: 'app-page-office-time',
  templateUrl: 'office-time-page.component.html',
  styleUrls: ['office-time-page.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [
    PageHeaderComponent,
    IonContent,
    TranslateModule,
    IonSegment,
    IonSegmentButton,
    IonLabel,
    IonSegmentView,
    IonSegmentContent,
    IonToolbar,
    DashboardComponent,
    BarcodeComponent,
    SettingsComponent,
    AsyncPipe,
  ],
})
export class OfficeTimePage implements IonViewWillEnter, IonViewDidEnter {
  readonly #store = inject(Store);

  readonly hasLoaded = new BehaviorSubject<boolean>(false);
  readonly hasLoaded$ = this.hasLoaded.asObservable();

  constructor() {
    addIcons({ add, remove });
  }

  ionViewWillEnter(): void {
    this.#store.dispatch(officeTimeActions.initOfficeTime());
  }

  ionViewDidEnter(): void {
    this.hasLoaded.next(true);
  }
}
