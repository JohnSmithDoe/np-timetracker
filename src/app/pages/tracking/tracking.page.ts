import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { Store } from '@ngrx/store';
import { TranslateModule } from '@ngx-translate/core';
import { addIcons } from 'ionicons';
import { add, remove } from 'ionicons/icons';
import {
  IonViewWillEnter,
  ITrackingItem,
  TItemListSortType,
} from '../../@types/types';
import { ListPageComponent } from '../../components/pages/list-page/list-page.component';
import { DialogsActions } from '../../state/dialogs/dialogs.actions';
import { TrackingActions } from '../../state/tracking/tracking.actions';
import { TrackingItemComponent } from '../../components/item-list-items/tracking-item/tracking-item.component';
import { EditTrackingItemDialogComponent } from '../../dialogs/edit-tracking-item-dialog/edit-tracking-item-dialog.component';

import { IonButton } from '@ionic/angular/standalone';

@Component({
  selector: 'app-page-tracking',
  templateUrl: 'tracking.page.html',
  styleUrls: ['tracking.page.scss'],
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [
    TranslateModule,
    ListPageComponent,
    TrackingItemComponent,
    EditTrackingItemDialogComponent,
    IonButton,
  ],
})
export class TrackingPage implements IonViewWillEnter {
  readonly #store = inject(Store);

  constructor() {
    addIcons({ add, remove });
  }

  ionViewWillEnter(): void {
    this.#store.dispatch(TrackingActions.enterPage());
  }

  removeItem(item: ITrackingItem) {
    this.#store.dispatch(TrackingActions.removeItem(item));
  }

  showEditDialog(item: ITrackingItem) {
    this.#store.dispatch(DialogsActions.showEditDialog(item));
  }

  setSortMode(type: TItemListSortType) {
    this.#store.dispatch(TrackingActions.updateSort(type, 'toggle'));
  }

  toggleTracking(item: ITrackingItem) {
    this.#store.dispatch(TrackingActions.toggleTrackingItem(item));
  }

  resetAll() {
    this.#store.dispatch(TrackingActions.resetAllTracking());
  }
  resetItem(item: ITrackingItem) {
    this.#store.dispatch(TrackingActions.resetTracking(item));
  }
}
