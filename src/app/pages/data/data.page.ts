import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { TranslateModule } from '@ngx-translate/core';

import {
  IonButton,
  IonContent,
  IonItem,
  IonList,
  IonSelect,
  IonSelectOption,
} from '@ionic/angular/standalone';
import { addIcons } from 'ionicons';
import { ellipse, square, triangle } from 'ionicons/icons';
import { AsyncPipe } from '@angular/common';
import { DataItemComponent } from '../../components/item-list-items/data-item/data-item.component';
import { PageHeaderComponent } from '../../components/pages/page-header/page-header.component';
import { Store } from '@ngrx/store';
import {
  selectTrackingData,
  selectTrackingDataViewId,
} from '../../state/tracking/tracking.selector';
import { TrackingActions } from '../../state/tracking/tracking.actions';
import { IDataItem, IonViewWillEnter } from '../../@types/types';

@Component({
    selector: 'app-page-data',
    templateUrl: 'data.page.html',
    styleUrls: ['data.page.scss'],
    changeDetection: ChangeDetectionStrategy.OnPush,
    imports: [
        TranslateModule,
        AsyncPipe,
        DataItemComponent,
        IonButton,
        IonContent,
        IonList,
        PageHeaderComponent,
        IonSelect,
        IonSelectOption,
        IonItem,
    ]
})
export class DataPage implements IonViewWillEnter {
  readonly #store = inject(Store);

  data$ = this.#store.select(selectTrackingData);
  viewMode$ = this.#store.select(selectTrackingDataViewId);

  constructor() {
    addIcons({ triangle, ellipse, square });
  }

  ionViewWillEnter(): void {
    this.#store.dispatch(TrackingActions.enterPage());
  }

  shareCSV() {
    this.#store.dispatch(TrackingActions.shareData());
  }

  deleteItem(item: IDataItem) {
    this.#store.dispatch(TrackingActions.removeDataItem(item));
  }

  selectViewMode({ detail }: CustomEvent<{ value: string }>) {
    this.#store.dispatch(TrackingActions.changeDataView(detail.value));
  }
}
