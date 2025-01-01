import { AbstractControl } from '@angular/forms';
import { InputCustomEvent } from '@ionic/angular';
import { IBaseItem, TIonDragEvent } from './@types/types';

// create a unique id
export const uuidv4 = () =>
  '10000000-1000-1000-1000-100000000000'.replace(/[01]/g, (c) => {
    return (
      // prettier-ignore
      ( // @ts-expect-error
      c ^
      // @ts-expect-error
      (crypto.getRandomValues(new Uint8Array(1))[0] & (15 >> (c / 4)))
    ).toString(16)
    );
  });

// handle the dragging from the list items
export const checkItemOptionsOnDrag = (
  ev: TIonDragEvent,
  triggerAmount = 160
) =>
  ev.detail.amount > triggerAmount
    ? 'end'
    : ev.detail.amount < -triggerAmount
      ? 'start'
      : false;

export const matchingTxt = (item: IBaseItem | string) =>
  (typeof item === 'string' ? item : item.name).trim().toLowerCase();

export const matchingTxtIsNotEmpty = (item?: IBaseItem | string) =>
  !!matchingTxt(item ?? '').length;

export const matchingTxtIsEmpty = (item?: IBaseItem | string) =>
  !matchingTxt(item ?? '').length;

export const matchesNameExactly = (item: IBaseItem, other: IBaseItem) =>
  matchingTxt(item) === matchingTxt(other);

export const matchesId = (item: IBaseItem, other: IBaseItem) =>
  item.id === other.id;

export function matchesItemExactly<T extends IBaseItem>(item: T, others: T[]) {
  // by id first if not found try by name
  const byId = others.find((other) => matchesId(item, other));
  return byId || others.find((other) => matchesNameExactly(item, other));
}

export const matchesItemExactlyIdx = (item: IBaseItem, others: IBaseItem[]) => {
  const found = matchesItemExactly(item, others);
  return others.findIndex((other) => other === found);
};

export const matchesSearchString = (value: string, searchQuery?: string) =>
  matchingTxt(value).includes(matchingTxt(searchQuery ?? ''));

export const matchesSearch = (item: IBaseItem | string, searchQuery: string) =>
  matchingTxt(item).includes(matchingTxt(searchQuery));

export const matchesSearchExactly = (
  item: IBaseItem | string,
  searchQuery?: string
) => matchingTxt(item) === matchingTxt(searchQuery ?? '');

export function parseNumberInput(ev: InputCustomEvent) {
  const value = ev.detail.value?.length ? ev.detail.value : '0';
  return Number.parseInt(value, 10);
}

export function validateNameInput<T extends IBaseItem>(
  items?: T[],
  item?: T | null
) {
  return (control: AbstractControl) => {
    if (matchingTxt(control.value ?? '').length === 0) return { empty: true };
    const found = items?.filter((item) =>
      matchesSearchExactly(item, control.value)
    );
    if (!found || found.length === 0) return null;
    const hasDuplicates = found.length > 1 || found.pop()?.id !== item?.id;

    return hasDuplicates ? { duplicate: true } : null;
  };
}
