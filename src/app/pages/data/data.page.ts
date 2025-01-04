import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { Store } from '@ngrx/store';
import { TranslateModule } from '@ngx-translate/core';
import { IonViewWillEnter, ITrackingItem } from '../../@types/types';
import { TrackingActions } from '../../state/tracking/tracking.actions';

import { IonButton, IonContent, IonList } from '@ionic/angular/standalone';
import { AsyncPipe } from '@angular/common';
import {
  selectTrackingData,
  selectTrackingTime,
} from '../../state/tracking/tracking.selector';
import { PageHeaderComponent } from '../../components/pages/page-header/page-header.component';
import { DataItemComponent } from '../../components/item-list-items/data-item/data-item.component';

@Component({
  selector: 'app-page-tracking',
  templateUrl: 'data.page.html',
  styleUrls: ['data.page.scss'],
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [
    TranslateModule,
    AsyncPipe,
    IonContent,
    IonList,
    PageHeaderComponent,
    IonButton,
    DataItemComponent,
  ],
})
export class DataPage implements IonViewWillEnter {
  readonly #store = inject(Store);

  total$ = this.#store.select(selectTrackingTime);
  data$ = this.#store.select(selectTrackingData);

  constructor() {}

  ionViewWillEnter(): void {
    this.#store.dispatch(TrackingActions.enterPage());
  }

  shareCSV() {
    this.#store.dispatch(TrackingActions.shareData());
  }

  deleteItem(item: ITrackingItem) {
    this.#store.dispatch(TrackingActions.removeDataItem(item));
  }
}
