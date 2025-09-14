import { Color } from '@ionic/core/dist/types/interface';
import { Dayjs } from 'dayjs';

export type BooleanKeys<T> = {
  [k in keyof T]: T[k] extends boolean ? k : never;
}[keyof T];

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
  startTime?: TTimestamp;
  breakTime?: TTimestamp;
  trackedTimeInSeconds?: number;
  breakInSeconds?: number;
  state: 'running' | 'stopped' | 'paused';
};

export type IDataItem = Pick<
  ITrackingItem,
  'trackedTimeInSeconds' | 'name' | 'id' | 'startTime'
>;

type TItemListSortType = 'name' | string;
type TItemListSortDir = 'asc' | 'desc';

export type TItemListSort = {
  sortDir: TItemListSortDir;
  sortBy: TItemListSortType;
};

export interface IItemList<T extends IBaseItem> {
  title: string;
  items: T[];
  searchQuery?: string;
  sort?: TItemListSort;
}

export type IListState<T extends IBaseItem> = IItemList<T>;

export type TTrackingList = IListState<ITrackingItem> & {
  title: 'Time tracking';
  data: ITrackingItem[];
  dataViewId: string;
};
export type ITrackingState = TTrackingList;

export interface ISettingsState {
  showTotalTime: boolean;
  version: string;
}

export interface IDatastore {
  tracking: ITrackingState;
  settings: ISettingsState;
  officeTime: IOfficeTimeState;
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

export interface IOfficeTimeState {
  holidays?: Record<string, Dayjs>;
}

export interface IAppState {
  tracking: ITrackingState;
  dialogs: TDialogsState;
  settings: ISettingsState;
  officeTime: IOfficeTimeState;
}

export interface IonViewWillEnter {
  ionViewWillEnter(): void;
}
