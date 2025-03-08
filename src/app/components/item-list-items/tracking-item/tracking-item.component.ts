import { DatePipe, NgTemplateOutlet } from '@angular/common';
import {
  ChangeDetectionStrategy,
  Component,
  EventEmitter,
  Input,
  OnInit,
  Output,
} from '@angular/core';
import {
  IonItem,
  IonItemOption,
  IonItemOptions,
  IonItemSliding,
  IonLabel,
  IonList,
  IonNote,
  IonReorder,
  IonText,
} from '@ionic/angular/standalone';
import { TranslateModule } from '@ngx-translate/core';
import { ITrackingItem, TColor, TIonDragEvent } from '../../../@types/types';
import { checkItemOptionsOnDrag } from '../../../app.utils';
import { NpTrackingTimePipe } from '../../../pipes/np-tracking-time.pipe';
import { NpTimeFromDataItemPipe } from '../../../pipes/np-time-from-seconds.pipe';

@Component({
    selector: 'app-tracking-item',
    changeDetection: ChangeDetectionStrategy.OnPush,
    templateUrl: './tracking-item.component.html',
    styleUrls: ['./tracking-item.component.scss'],
    imports: [
        IonItem,
        IonLabel,
        IonReorder,
        TranslateModule,
        NgTemplateOutlet,
        IonNote,
        IonItemOption,
        IonItemOptions,
        IonItemSliding,
        IonText,
        NpTrackingTimePipe,
        DatePipe,
        NpTimeFromDataItemPipe,
        NpTimeFromDataItemPipe,
    ]
})
export class TrackingItemComponent implements OnInit {
  @Input({ required: true }) item!: ITrackingItem;
  @Input({ required: true }) ionList!: IonList;

  @Output() selectItem = new EventEmitter<void>();
  @Output() deleteItem = new EventEmitter<void>();
  @Output() editItem = new EventEmitter<void>();
  @Output() resetItem = new EventEmitter<void>();

  constructor() {}

  ngOnInit() {
    if (!this.item) throw new Error('Item must be set');
  }

  async handleItemOptionsOnDrag(ev: TIonDragEvent) {
    switch (checkItemOptionsOnDrag(ev)) {
      case 'end':
        return this.emitDeleteItem();
      case 'start':
        return this.emitEditItem();
    }
  }

  async emitDeleteItem() {
    await this.ionList.closeSlidingItems();
    this.deleteItem.emit();
  }

  async emitEditItem() {
    await this.ionList.closeSlidingItems();
    this.editItem.emit();
  }

  getColor(item: ITrackingItem): TColor {
    switch (item.state) {
      case 'running':
        return 'success';
      case 'stopped':
        return 'tracking';
      case 'paused':
        return 'warning';
    }
  }
  async emitResetItem() {
    await this.ionList.closeSlidingItems();
    this.resetItem.emit();
  }
}
