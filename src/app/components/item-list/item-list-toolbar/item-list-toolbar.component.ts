import {
  booleanAttribute,
  ChangeDetectionStrategy,
  Component,
  EventEmitter,
  Input,
  Output,
} from '@angular/core';
import {
  IonButton,
  IonButtons,
  IonIcon,
  IonToolbar,
} from '@ionic/angular/standalone';
import { addIcons } from 'ionicons';
import { add, cart, list, remove } from 'ionicons/icons';
import { TItemListSortType } from '../../../@types/types';

@Component({
    selector: 'app-item-list-toolbar',
    templateUrl: 'item-list-toolbar.component.html',
    styleUrls: ['item-list-toolbar.component.scss'],
    changeDetection: ChangeDetectionStrategy.OnPush,
    imports: [IonToolbar, IonButtons, IonButton, IonIcon]
})
export class ItemListToolbarComponent {
  @Input({ transform: booleanAttribute }) showReorder = false;

  @Output() selectSortMode = new EventEmitter<TItemListSortType>();
  @Output() toggleReorder = new EventEmitter<void>();

  constructor() {
    addIcons({ add, remove, cart, list });
  }
}
