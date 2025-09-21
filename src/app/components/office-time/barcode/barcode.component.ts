import { Component, inject } from '@angular/core';
import { TranslateModule } from '@ngx-translate/core';
import { barcodeDataUrl } from '../../../state/office-time/office-time.selector';
import { Store } from '@ngrx/store';
import { AsyncPipe } from '@angular/common';
import { BarcodeInputComponent } from '../barcode-input/barcode-input.component';
import { IonItem, IonList } from '@ionic/angular/standalone';

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
  ],
})
export class BarcodeComponent {
  readonly #store = inject(Store);
  readonly barcode$ = this.#store.select(barcodeDataUrl);
}
