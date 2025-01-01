import { NgTemplateOutlet } from '@angular/common';
import {
  booleanAttribute,
  ChangeDetectionStrategy,
  Component,
  EventEmitter,
  Input,
  Output,
  TemplateRef,
  ViewChild,
} from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ItemReorderEventDetail } from '@ionic/angular';
import {
  IonLabel,
  IonList,
  IonListHeader,
  IonReorderGroup,
  IonToolbar,
} from '@ionic/angular/standalone';
import { TranslateModule } from '@ngx-translate/core';
import { addIcons } from 'ionicons';
import { add, cart, list, remove } from 'ionicons/icons';
import { IBaseItem, TColor } from '../../@types/types';

@Component({
  selector: 'app-item-list',
  templateUrl: 'item-list.component.html',
  styleUrls: ['item-list.component.scss'],
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [
    IonToolbar,
    IonList,
    IonReorderGroup,
    IonLabel,
    IonListHeader,
    NgTemplateOutlet,
    FormsModule,
    TranslateModule,
  ],
})
export class ItemListComponent {
  @ViewChild('ionList', { static: true }) ionList?: IonList;

  @Input({ required: true }) itemTemplate!: TemplateRef<any>;
  @Input({ required: true }) items?: ReadonlyArray<IBaseItem> | null;

  @Output() reorder = new EventEmitter<ItemReorderEventDetail>();

  @Input() header?: string;
  @Input({ transform: booleanAttribute }) listHeader: boolean = false;
  @Input() headerColor?: TColor;

  @Input() reorderDisabled = true;

  constructor() {
    addIcons({ add, remove, cart, list });
  }

  async closeSlidingItems() {
    await this.ionList?.closeSlidingItems();
  }

  async handleReorder(ev: CustomEvent<ItemReorderEventDetail>) {
    this.reorder.emit(ev.detail);
    // Finish the reorder and position the item in the DOM
    ev.detail.complete();
  }
}
