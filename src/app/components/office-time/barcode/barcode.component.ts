import { Component, inject } from '@angular/core';
import { TranslateModule } from '@ngx-translate/core';
import { barcodeDataUrl } from '../../../state/office-time/office-time.selectors';
import { Store } from '@ngrx/store';
import { AsyncPipe } from '@angular/common';
import { BarcodeInputComponent } from '../barcode-input/barcode-input.component';
import { IonButton, IonItem, IonList } from '@ionic/angular/standalone';
import { officeTimeActions } from '../../../state/office-time/office-time.actions';

@Component({
  selector: 'app-barcode',
  templateUrl: './barcode.component.html',
  styleUrls: ['./barcode.component.scss'],
  imports: [
    TranslateModule,
    AsyncPipe,
    BarcodeInputComponent,
    IonList,
    IonItem,
    IonButton,
  ],
})
export class BarcodeComponent {
  readonly #store = inject(Store);
  readonly barcode$ = this.#store.select(barcodeDataUrl);

  rotateBarcode() {
    this.#store.dispatch(officeTimeActions.rotateBarcode());
  }
  deleteBarcode() {
    this.#store.dispatch(officeTimeActions.deleteBarcode());
  }
}
