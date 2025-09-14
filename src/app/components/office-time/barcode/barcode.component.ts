import { Component, inject } from '@angular/core';
import { TranslateModule } from '@ngx-translate/core';
import { selectBarcodeBlob } from '../../../state/office-time/office-time.selector';
import { Store } from '@ngrx/store';
import { AsyncPipe } from '@angular/common';

@Component({
  selector: 'app-barcode',
  templateUrl: './barcode.component.html',
  styleUrls: ['./barcode.component.scss'], imports: [TranslateModule, AsyncPipe],
})
export class BarcodeComponent {
  readonly #store = inject(Store);
  readonly barcode$ = this.#store.select(selectBarcodeBlob);

}
