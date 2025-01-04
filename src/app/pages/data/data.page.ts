import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { Store } from '@ngrx/store';
import { TranslateModule } from '@ngx-translate/core';
import { IonViewWillEnter } from '../../@types/types';
import { TrackingActions } from '../../state/tracking/tracking.actions';

import { IonContent, IonList, IonTextarea } from '@ionic/angular/standalone';
import { AsyncPipe, DatePipe } from '@angular/common';
import {
  selectTrackingData,
  selectTrackingTime,
} from '../../state/tracking/tracking.selector';
import { PageHeaderComponent } from '../../components/pages/page-header/page-header.component';
import { TextItemComponent } from '../../components/item-list-items/text-item/text-item.component';
import { NpTrackingTimePipe } from '../../pipes/np-tracking-time.pipe';
import { map } from 'rxjs';

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
    TextItemComponent,
    DatePipe,
    NpTrackingTimePipe,
    IonTextarea,
  ],
})
export class DataPage implements IonViewWillEnter {
  readonly #store = inject(Store);

  total$ = this.#store.select(selectTrackingTime);
  data$ = this.#store.select(selectTrackingData);
  dataAsCSV$ = this.data$.pipe(
    map((data) =>
      [
        'Name,Start Time,Tracked Seconds',
        ...data.map(
          (item) =>
            item.name + ',' + item.startTime + ',' + item.trackedTimeInSeconds
        ),
      ].join('\n')
    )
  );
  constructor() {}

  ionViewWillEnter(): void {
    this.#store.dispatch(TrackingActions.enterPage());
  }
}
