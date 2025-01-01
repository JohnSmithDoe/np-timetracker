import { AsyncPipe } from '@angular/common';
import { Component, inject, Input, TemplateRef } from '@angular/core';
import { IonContent } from '@ionic/angular/standalone';
import { Store } from '@ngrx/store';
import { TranslateModule } from '@ngx-translate/core';
import { addIcons } from 'ionicons';
import { add, bagAdd, clipboard, remove } from 'ionicons/icons';
import {
  IAppState,
  ITrackingItem,
  TColor,
  TItemListSortType,
} from '../../../@types/types';
import { ItemListActions } from '../../../state/@shared/item-list.actions';
import {
  selectListItems,
  selectListSearchResult,
  selectListState,
  selectListStateFilter,
} from '../../../state/@shared/item-list.selector';
import { DialogsActions } from '../../../state/dialogs/dialogs.actions';
import { ItemListEmptyComponent } from '../../item-list/item-list-empty/item-list-empty.component';
import { ItemListSearchResultComponent } from '../../item-list/item-list-search-result/item-list-search-result.component';
import { ItemListSearchbarComponent } from '../../item-list/item-list-searchbar/item-list-searchbar.component';
import { ItemListToolbarComponent } from '../../item-list/item-list-toolbar/item-list-toolbar.component';
import { ItemListComponent } from '../../item-list/item-list.component';
import { PageHeaderComponent } from '../page-header/page-header.component';

@Component({
  selector: 'app-list-page',
  standalone: true,
  templateUrl: './list-page.component.html',
  styleUrls: ['./list-page.component.scss'],
  imports: [
    AsyncPipe,
    IonContent,
    ItemListComponent,
    ItemListEmptyComponent,
    ItemListSearchResultComponent,
    ItemListSearchbarComponent,
    ItemListToolbarComponent,
    PageHeaderComponent,
    TranslateModule,
  ],
})
export class ListPageComponent {
  readonly #store = inject(Store<IAppState>);

  @Input({ required: true }) itemTemplate!: TemplateRef<any>;
  @Input({ required: true }) color!: TColor;
  @Input({ required: true }) listHeader!: string;
  @Input({ required: true }) pageHeader!: string;

  rxState$ = this.#store.select(selectListState);
  rxFilter$ = this.#store.select(selectListStateFilter);
  rxItems$ = this.#store.select(selectListItems);
  rxSearchResult$ = this.#store.select(selectListSearchResult);

  constructor() {
    addIcons({ add, remove, clipboard, bagAdd });
  }

  addItemFromSearch() {
    this.#store.dispatch(ItemListActions.addItemFromSearch());
  }

  searchFor(searchTerm: string) {
    this.#store.dispatch(ItemListActions.updateSearch(searchTerm));
  }

  setSortMode(type: TItemListSortType) {
    this.#store.dispatch(ItemListActions.updateSort(type, 'toggle'));
  }

  addTrackingItem(item: ITrackingItem) {
    this.#store.dispatch(ItemListActions.addTrackingItem(item));
  }

  showCreateDialog() {
    this.#store.dispatch(DialogsActions.showCreateDialogWithSearch());
  }

  showEditDialog(item: ITrackingItem) {
    this.#store.dispatch(DialogsActions.showEditDialog(item));
  }
}
