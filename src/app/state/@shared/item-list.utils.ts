import {
  IBaseItem,
  IItemList,
  IListState,
  ITrackingItem,
  TItemListSort,
  TItemListSortDir,
  TItemListSortType,
  TUpdateDTO,
} from '../../@types/types';
import { matchesItemExactlyIdx } from '../../app.utils';

export const addListItem = <T extends IListState<R>, R extends ITrackingItem>(
  state: T,
  item: R
): T => {
  // do not add an empty item
  const name = item.name.trim();
  if (!name.length) {
    return state;
  }
  return {
    ...state,
    items: [item, ...state.items],
  };
};

export const removeListItem = <
  T extends IListState<R>,
  R extends ITrackingItem,
>(
  state: T,
  item: R
): T => ({
  ...state,
  items: state.items.filter((listItem) => listItem.id !== item.id),
});

export const removeListItems = <
  T extends IListState<R>,
  R extends ITrackingItem,
>(
  state: T,
  items: R[]
): T => {
  const toRemove = items.map((item) => item.id);
  return {
    ...state,
    items: state.items.filter((listItem) => !toRemove.includes(listItem.id)),
  };
};

export const updateListItem = <T extends IItemList<R>, R extends IBaseItem>(
  state: T,
  item: TUpdateDTO<R> | undefined
): T => {
  if (!item) return state;
  const items: TUpdateDTO<R>[] = [...state.items];
  const itemIdx = matchesItemExactlyIdx(item, state.items);
  if (itemIdx >= 0) {
    const original = state.items[itemIdx];
    const updatedItem = { ...original, ...item };
    items.splice(itemIdx, 1, updatedItem);
  } else {
    console.error(item);
    // throw new Error('Dont update an item that is not in the list');
  }
  return { ...state, items };
};

export const updateListSort = (
  sortBy?: TItemListSortType,
  newDir?: TItemListSortDir | 'keep' | 'toggle',
  currentDir?: TItemListSortDir
) => {
  let result: TItemListSort | undefined;
  if (!!sortBy) {
    const defaultSort = 'asc';
    let sortDir: 'asc' | 'desc' = defaultSort;
    switch (newDir) {
      case 'asc':
      case 'desc':
        sortDir = newDir;
        break;
      case 'keep':
        sortDir = currentDir ?? defaultSort;
        break;
      case 'toggle':
        sortDir = currentDir === 'asc' ? 'desc' : 'asc';
        break;
    }
    result = { sortBy, sortDir };
  }
  return result;
};

export const updatedSearchQuery = (item?: IBaseItem, searchQuery?: string) => {
  if (!!item?.name && !item.name.includes(searchQuery ?? '')) {
    searchQuery = undefined;
  }
  return searchQuery;
};
