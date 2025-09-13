import { AsyncPipe } from '@angular/common';
import { Component, inject, input } from '@angular/core';
import {
  IonButton,
  IonButtons,
  IonContent,
  IonHeader,
  IonList,
  IonModal,
  IonToolbar,
} from '@ionic/angular/standalone';
import { Store } from '@ngrx/store';
import { TranslateModule } from '@ngx-translate/core';
import { IBaseItem } from '../../../@types/types';
import { dialogsActions } from '../../../state/dialogs/dialogsActions';
import {
  selectEditItem,
  selectEditState,
} from '../../../state/dialogs/dialogs.selector';
import { ItemNameInputComponent } from '../item-name-input/item-name-input.component';

@Component({
  selector: 'app-item-edit-modal',
  templateUrl: './item-edit-modal.component.html',
  styleUrls: ['./item-edit-modal.component.scss'],
  imports: [
    IonModal,
    IonHeader,
    IonToolbar,
    IonButtons,
    IonButton,
    IonContent,
    IonList,
    ItemNameInputComponent,
    AsyncPipe,
    TranslateModule,
  ],
})
export class ItemEditModalComponent {
  readonly #store = inject(Store);

  readonly rxState$ = this.#store.select(selectEditState);
  readonly rxItem$ = this.#store.select(selectEditItem);

  readonly listItems = input<IBaseItem[] | null>();

  constructor() {}

  cancelChanges() {
    this.#store.dispatch(dialogsActions.abortChanges());
  }

  closedDialog() {
    this.#store.dispatch(dialogsActions.hideDialog());
  }

  submitChanges() {
    this.#store.dispatch(dialogsActions.confirmChanges());
  }

  updateName(value: string) {
    this.#store.dispatch(
      dialogsActions.updateItem({
        name: value,
      })
    );
  }
}
