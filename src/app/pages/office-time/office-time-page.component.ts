import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import {
  IonContent,
  IonInput,
  IonItem,
  IonLabel,
  IonList,
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
import { selectWorkingHours, selectWorkingHoursDefault } from '../../state/office-time/office-time.selector';
import { IonViewWillEnter } from '../../@types/types';
import { officeTimeActions } from '../../state/office-time/office-time.actions';
import { DashboardComponent } from '../../components/office-time/dashboard/dashboard.component';
import { AsyncPipe } from '@angular/common';
import { BarcodeComponent } from '../../components/office-time/barcode/barcode.component';

@Component({
  selector: 'app-page-office-time',
  templateUrl: 'office-time-page.component.html',
  styleUrls: ['office-time-page.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [PageHeaderComponent, IonContent, TranslateModule, IonSegment, IonSegmentButton, IonLabel, IonSegmentView, IonSegmentContent, IonToolbar, DashboardComponent, IonItem, IonList, AsyncPipe, IonInput, BarcodeComponent],
})
export class OfficeTimePage implements IonViewWillEnter {
  readonly #store = inject(Store);

  readonly workingHours$ = this.#store.select(selectWorkingHours);
  readonly workingHoursDefault$ = this.#store.select(selectWorkingHoursDefault);

  constructor() {
    addIcons({ add, remove });
  }

  ionViewWillEnter(): void {
    this.#store.dispatch(officeTimeActions.loadHolidays());
  }



  onFileSelected(ev: Event) {
    const file = (ev.target as HTMLInputElement).files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (e) => {
      const base64String = (e.target?.result as string).split(',')[1];
      this.#store.dispatch(officeTimeActions.saveBarcode(base64String))
    };
    reader.readAsDataURL(file);
  }

  workHoursChange($event: CustomEvent<{ value?: string | null }>) {
    if ($event.detail.value === '') return;
    this.#store.dispatch(officeTimeActions.saveWorkingHours(Number($event.detail.value)))
  }
  workHoursDefaultChange($event: CustomEvent<{ value?: string | null }>) {
    if ($event.detail.value === '') return;
    this.#store.dispatch(officeTimeActions.saveWorkingHoursDefault(Number($event.detail.value)))
  }
}
