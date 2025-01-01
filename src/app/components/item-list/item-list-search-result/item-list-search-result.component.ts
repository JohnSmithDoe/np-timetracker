import { Component, EventEmitter, Input, Output } from '@angular/core';
import { TranslateModule } from '@ngx-translate/core';
import { IBaseItem, ISearchResult, ITrackingItem } from '../../../@types/types';
import { TextItemComponent } from '../../item-list-items/text-item/text-item.component';
import { ItemListComponent } from '../item-list.component';

@Component({
  selector: 'app-item-list-search-result',
  standalone: true,
  templateUrl: './item-list-search-result.component.html',
  styleUrls: ['./item-list-search-result.component.scss'],
  imports: [ItemListComponent, TextItemComponent, TranslateModule],
})
export class ItemListSearchResultComponent<T extends IBaseItem> {
  @Input() results?: ISearchResult<T> | null;
  @Output() selectTrackingItem = new EventEmitter<ITrackingItem>();
}
