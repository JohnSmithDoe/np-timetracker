import { Color } from '@ionic/core/dist/types/interface';

export type BooleanKeys<T> = {
  [k in keyof T]: T[k] extends boolean ? k : never;
}[keyof T];

// eslint-disable-next-line functional/type-declaration-immutability
export type TIonDragEvent = CustomEvent<{ amount: number; ratio: number }>;
export type TMarker = string;
export type TColor = Color | 'tracking' | 'settings';

export type TTimestamp = string;

export type IBaseItem = {
  id: string;
  name: string;
  createdAt: TTimestamp;
};

export type TUpdateDTO<T extends IBaseItem> = IBaseItem &
  Partial<T> & { id: string };

export type ITrackingItem = IBaseItem & {
  trackedTime?: TTimestamp;
};

type TItemListSortType = 'name' | string;
type TItemListSortDir = 'asc' | 'desc';

export type TItemListSort = {
  sortDir: TItemListSortDir;
  sortBy: TItemListSortType;
};

export interface IItemList<T extends ITrackingItem> {
  title: string;
  items: T[];
  searchQuery?: string;
  filterBy?: string;
  sort?: TItemListSort;
}

export type TTrackingList = IItemList<ITrackingItem> & {
  title: 'Time tracking';
};

export type ITrackingState = Readonly<TTrackingList>;
export type IListState<T extends ITrackingItem> = IItemList<T>;

export interface ISettings {
  showTotalTime: boolean;
  version: string;
}

export interface IDatastore {
  tracking: TTrackingList;
  settings: ISettings;
}
// hmm clean up this and myba add a quick add state
export interface ISearchResult<T extends ITrackingItem> {
  listItems: T[];
  hasSearchTerm: boolean; // length of the searchTerm > 0
  searchTerm: string;
  exactMatch?: T; // the item from the list where the name matches exactly
}

export type TEditItemMode = 'update' | 'create';
export type IEditItemState<T extends IBaseItem> = Readonly<{
  item: T;
  isEditing?: boolean;
  editMode?: TEditItemMode;
  dialogTitle?: string;
  saveButtonText?: string;
}>;
export type TDialogsState = IEditItemState<ITrackingItem>;
export type IEditTrackingItemState = IEditItemState<ITrackingItem>;

export interface IAppState {
  tracking: ITrackingState;
  dialogs: TDialogsState;
  settings: ISettings;
}

export interface IonViewWillEnter {
  ionViewWillEnter(): void;
}
