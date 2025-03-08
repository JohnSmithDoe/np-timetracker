import { AsyncPipe } from '@angular/common';
import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { Store } from '@ngrx/store';
import { TranslateModule } from '@ngx-translate/core';
import { addIcons } from 'ionicons';
import { closeCircle } from 'ionicons/icons';
import { ItemEditModalComponent } from '../../components/forms/item-edit-modal/item-edit-modal.component';
import { selectEditItemTracking } from '../../state/dialogs/dialogs.selector';
import { selectListItemsTracking } from '../../state/tracking/tracking.selector';

@Component({
    selector: 'app-edit-tracking-item-dialog',
    changeDetection: ChangeDetectionStrategy.OnPush,
    imports: [
        FormsModule,
        TranslateModule,
        AsyncPipe,
        ReactiveFormsModule,
        ItemEditModalComponent,
    ],
    templateUrl: './edit-tracking-item-dialog.component.html',
    styleUrl: './edit-tracking-item-dialog.component.scss'
})
export class EditTrackingItemDialogComponent {
  readonly #store = inject(Store);

  rxItem$ = this.#store.select(selectEditItemTracking);
  rxItems$ = this.#store.select(selectListItemsTracking);

  constructor() {
    addIcons({ closeCircle });
  }

  // updateMinAmount(value: number) {
  //   this.#store.dispatch(
  //     DialogsActions.updateItem({
  //       minAmount: value,
  //     })
  //   );
  // }
}
