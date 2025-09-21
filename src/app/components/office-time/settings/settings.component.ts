import { Component, inject } from '@angular/core';
import { TranslateModule } from '@ngx-translate/core';
import {
  selectBarcodeBlob,
  selectWorkingHours,
  selectWorkingHoursDefault,
} from '../../../state/office-time/office-time.selector';
import { Store } from '@ngrx/store';
import { AsyncPipe } from '@angular/common';
import {
  IonButton,
  IonInput,
  IonItem,
  IonList,
} from '@ionic/angular/standalone';
import { officeTimeActions } from '../../../state/office-time/office-time.actions';
import { map } from 'rxjs';
import { BarcodeComponent } from '../barcode/barcode.component';
import { BarcodeInputComponent } from '../barcode-input/barcode-input.component';

@Component({
  selector: 'app-office-time-settings',
  templateUrl: './settings.component.html',
  styleUrls: ['./settings.component.scss'],
  imports: [
    TranslateModule,
    AsyncPipe,
    IonInput,
    IonItem,
    IonList,
    BarcodeComponent,
    IonButton,
    BarcodeInputComponent,
  ],
})
export class SettingsComponent {
  readonly #store = inject(Store);
  readonly barcode$ = this.#store
    .select(selectBarcodeBlob)
    .pipe(map((blob) => !!blob));
  readonly workingHours$ = this.#store.select(selectWorkingHours);
  readonly workingHoursDefault$ = this.#store.select(selectWorkingHoursDefault);

  onFileSelected(ev: Event) {
    const file = (ev.target as HTMLInputElement).files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (e) => {
      const base64String = (e.target?.result as string).split(',')[1];
      this.#store.dispatch(officeTimeActions.saveBarcode(base64String));
    };
    reader.readAsDataURL(file);
  }

  deleteBarcode() {
    this.#store.dispatch(officeTimeActions.deleteBarcode());
  }
  workHoursChange($event: CustomEvent<{ value?: string | null }>) {
    if ($event.detail.value === '') return;
    this.#store.dispatch(
      officeTimeActions.saveWorkingHours(Number($event.detail.value))
    );
  }

  workHoursDefaultChange($event: CustomEvent<{ value?: string | null }>) {
    if ($event.detail.value === '') return;
    this.#store.dispatch(
      officeTimeActions.saveWorkingHoursDefault(Number($event.detail.value))
    );
  }

  rotateBarcode() {
    this.#store.dispatch(officeTimeActions.rotateBarcode());
  }
}
