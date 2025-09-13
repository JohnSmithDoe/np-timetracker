import { AsyncPipe } from '@angular/common';
import { Component, inject, input, TemplateRef } from '@angular/core';
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
import { itemListActions } from '../../../state/@shared/item-list.actions';
import {
  selectListItems,
  selectListSearchResult,
  selectListState,
} from '../../../state/@shared/item-list.selector';
import { dialogsActions } from '../../../state/dialogs/dialogsActions';
import { ItemListEmptyComponent } from '../../item-list/item-list-empty/item-list-empty.component';
import { ItemListSearchbarComponent } from '../../item-list/item-list-searchbar/item-list-searchbar.component';
import { ItemListToolbarComponent } from '../../item-list/item-list-toolbar/item-list-toolbar.component';
import { ItemListComponent } from '../../item-list/item-list.component';
import { PageHeaderComponent } from '../page-header/page-header.component';

@Component({
  selector: 'app-list-page',
  templateUrl: './list-page.component.html',
  styleUrls: ['./list-page.component.scss'],
  imports: [
    AsyncPipe,
    IonContent,
    ItemListComponent,
    ItemListEmptyComponent,
    ItemListSearchbarComponent,
    ItemListToolbarComponent,
    PageHeaderComponent,
    TranslateModule,
  ],
})
export class ListPageComponent {
  readonly #store = inject(Store<IAppState>);

  readonly itemTemplate = input.required<TemplateRef<any>>();
  readonly color = input.required<TColor>();
  readonly listHeader = input.required<string>();
  readonly pageHeader = input.required<string>();

  rxState$ = this.#store.select(selectListState);
  rxItems$ = this.#store.select(selectListItems);
  rxSearchResult$ = this.#store.select(selectListSearchResult);

  constructor() {
    addIcons({ add, remove, clipboard, bagAdd });
  }

  addItemFromSearch() {
    this.#store.dispatch(itemListActions.addItemFromSearch());
  }

  searchFor(searchTerm?: string) {
    this.#store.dispatch(itemListActions.updateSearch(searchTerm));
  }

  setSortMode(type: TItemListSortType) {
    this.#store.dispatch(itemListActions.updateSort(type, 'toggle'));
  }

  addTrackingItem(item: ITrackingItem) {
    this.#store.dispatch(itemListActions.addTrackingItem(item));
  }

  showCreateDialog() {
    this.#store.dispatch(dialogsActions.showCreateDialogWithSearch());
  }

  showEditDialog(item: ITrackingItem) {
    this.#store.dispatch(dialogsActions.showEditDialog(item));
  }
}
