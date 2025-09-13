import {
  booleanAttribute,
  ChangeDetectionStrategy,
  Component,
  output,
  input
} from '@angular/core';
import { TranslateModule } from '@ngx-translate/core';
import { addIcons } from 'ionicons';
import { add, cart, list, remove } from 'ionicons/icons';
import { TextItemComponent } from '../../item-list-items/text-item/text-item.component';

@Component({
    selector: 'app-item-list-empty',
    templateUrl: 'item-list-empty.component.html',
    styleUrls: ['item-list-empty.component.scss'],
    changeDetection: ChangeDetectionStrategy.OnPush,
    imports: [TextItemComponent, TranslateModule]
})
export class ItemListEmptyComponent {
  readonly isEmptyList = input(true, { transform: booleanAttribute });
  readonly isSearching = input(false, { transform: booleanAttribute });
  readonly searchTerm = input<string>();

  readonly emptyList = output<void>();
  readonly emptySearch = output<void>();

  constructor() {
    addIcons({ add, remove, cart, list });
  }
}
