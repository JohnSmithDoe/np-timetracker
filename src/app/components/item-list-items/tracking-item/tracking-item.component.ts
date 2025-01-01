import { NgTemplateOutlet } from '@angular/common';
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

@Component({
  selector: 'app-tracking-item',
  standalone: true,
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
  ],
})
export class TrackingItemComponent implements OnInit {
  @Input({ required: true }) item!: ITrackingItem;
  @Input({ required: true }) ionList!: IonList;
  @Input() color?: TColor;

  @Output() increment = new EventEmitter<void>();
  @Output() decrement = new EventEmitter<void>();
  @Output() selectItem = new EventEmitter<void>();
  @Output() deleteItem = new EventEmitter<void>();
  @Output() editItem = new EventEmitter<void>();

  constructor() {}

  ngOnInit() {
    if (!this.item) throw new Error('Item must be set');
  }

  // inner button click
  incrementQuantity(ev: MouseEvent) {
    this.increment.emit();
    ev.stopPropagation();
  }

  // inner button click
  decrementQuantity(ev: MouseEvent) {
    this.decrement.emit();
    ev.stopPropagation();
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

  // getColor(item: ITrackingItem): TColor {
  //   let result: TColor = 'success';
  //   // if (item.minAmount) {
  //   //   if (item.quantity === item.minAmount) {
  //   //     result = 'warning';
  //   //   } else if (item.quantity < item.minAmount) {
  //   //     result = 'danger';
  //   //   }
  //   // }
  //   return result;
  // }
}
