import { Component, inject } from '@angular/core';
import { TranslateModule } from '@ngx-translate/core';
import {
  selectBarcodeBlob,
  selectWorkingHours,
  selectWorkingHoursDefault,
} from '../../../state/office-time/office-time.selector';
import { Store } from '@ngrx/store';
import { officeTimeActions } from '../../../state/office-time/office-time.actions';
import { map } from 'rxjs';
import { IonButton } from '@ionic/angular/standalone';

@Component({
  selector: 'app-barcode-input',
  templateUrl: './barcode-input.component.html',
  styleUrls: ['./barcode-input.component.scss'],
  imports: [TranslateModule, IonButton],
})
export class BarcodeInputComponent {
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
}
