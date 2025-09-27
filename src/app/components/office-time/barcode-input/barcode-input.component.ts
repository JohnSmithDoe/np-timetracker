import { Component, inject } from '@angular/core';
import { TranslateModule } from '@ngx-translate/core';
import { Store } from '@ngrx/store';
import { officeTimeActions } from '../../../state/office-time/office-time.actions';
import { IonButton } from '@ionic/angular/standalone';

@Component({
  selector: 'app-barcode-input',
  templateUrl: './barcode-input.component.html',
  styleUrls: ['./barcode-input.component.scss'],
  imports: [TranslateModule, IonButton],
})
export class BarcodeInputComponent {
  readonly #store = inject(Store);

  onFileSelected(ev: Event) {
    const file = (ev.target as HTMLInputElement).files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (e) => {
      const dataUrl = e.target?.result as string;
      this.#store.dispatch(officeTimeActions.saveBarcode(dataUrl));
    };
    reader.readAsDataURL(file);
  }
}
