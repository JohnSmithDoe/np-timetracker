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
} from '@ionic/angular/standalone';
import { TranslateModule } from '@ngx-translate/core';
import { ITrackingItem, TIonDragEvent } from '../../../@types/types';
import { checkItemOptionsOnDrag } from '../../../app.utils';
import { NpTrackingTimePipe } from '../../../pipes/np-tracking-time.pipe';

@Component({
  selector: 'app-data-item',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './data-item.component.html',
  styleUrls: ['./data-item.component.scss'],
  imports: [
    IonItem,
    IonLabel,
    TranslateModule,
    NgTemplateOutlet,
    IonNote,
    IonItemOption,
    IonItemOptions,
    IonItemSliding,
    NpTrackingTimePipe,
    DatePipe,
  ],
})
export class DataItemComponent implements OnInit {
  @Input({ required: true }) item!: ITrackingItem;
  @Input({ required: true }) ionList!: IonList;

  @Output() deleteItem = new EventEmitter<void>();

  constructor() {}

  ngOnInit() {
    if (!this.item) throw new Error('Item must be set');
  }

  async handleItemOptionsOnDrag(ev: TIonDragEvent) {
    switch (checkItemOptionsOnDrag(ev)) {
      case 'end':
        return this.emitDeleteItem();
    }
  }

  async emitDeleteItem() {
    await this.ionList.closeSlidingItems();
    this.deleteItem.emit();
  }
}