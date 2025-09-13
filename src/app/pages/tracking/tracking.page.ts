import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { Store } from '@ngrx/store';
import { TranslateModule } from '@ngx-translate/core';
import { addIcons } from 'ionicons';
import { add, remove, save, trash } from 'ionicons/icons';
import {
  IonViewWillEnter,
  ITrackingItem,
  TItemListSortType,
} from '../../@types/types';
import { ListPageComponent } from '../../components/pages/list-page/list-page.component';
import { dialogsActions } from '../../state/dialogs/dialogsActions';
import { trackingActions } from '../../state/tracking/trackingActions';
import { TrackingItemComponent } from '../../components/item-list-items/tracking-item/tracking-item.component';
import { EditTrackingItemDialogComponent } from '../../dialogs/edit-tracking-item-dialog/edit-tracking-item-dialog.component';

import { IonButton, IonIcon } from '@ionic/angular/standalone';
import { AsyncPipe } from '@angular/common';
import { selectTrackingTime } from '../../state/tracking/tracking.selector';

@Component({
  selector: 'app-page-tracking',
  templateUrl: 'tracking.page.html',
  styleUrls: ['tracking.page.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [
    TranslateModule,
    ListPageComponent,
    TrackingItemComponent,
    EditTrackingItemDialogComponent,
    IonButton,
    AsyncPipe,
    IonIcon,
  ],
})
export class TrackingPage implements IonViewWillEnter {
  readonly #store = inject(Store);

  total$ = this.#store.select(selectTrackingTime);

  constructor() {
    addIcons({ add, remove, save, trash });
  }

  ionViewWillEnter(): void {
    this.#store.dispatch(trackingActions.enterPage());
  }

  removeItem(item: ITrackingItem) {
    this.#store.dispatch(trackingActions.removeItem(item));
  }

  showEditDialog(item: ITrackingItem) {
    this.#store.dispatch(dialogsActions.showEditDialog(item));
  }

  setSortMode(type: TItemListSortType) {
    this.#store.dispatch(trackingActions.updateSort(type, 'toggle'));
  }

  toggleTracking(item: ITrackingItem) {
    this.#store.dispatch(trackingActions.toggleTrackingItem(item));
  }

  resetAll() {
    this.#store.dispatch(trackingActions.resetAllTracking());
  }
  resetItem(item: ITrackingItem) {
    this.#store.dispatch(trackingActions.resetTracking(item));
  }

  saveAndResetAll() {
    this.#store.dispatch(trackingActions.saveAndResetTracking());
  }
}
