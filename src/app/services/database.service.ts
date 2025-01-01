import { inject, Injectable } from '@angular/core';
import { Storage } from '@ionic/storage-angular';
import { Store } from '@ngrx/store';
import { IDatastore } from '../@types/types';
import { VERSION } from '../state/settings/settings.reducer';

@Injectable({
  providedIn: 'root',
})
export class DatabaseService {
  readonly #storageService = inject(Storage);
  readonly store = inject(Store);

  async create() {
    await this.#storageService.create();
    let initialData: IDatastore = {
      tracking: await this.#loadAs('tracking'),
      settings: await this.#loadAs('settings'),
    };
    if (
      !initialData.settings?.version ||
      initialData.settings?.version !== VERSION
    ) {
      if (VERSION === '1') {
        initialData.settings.version = VERSION;
        await this.save('settings', initialData.settings);
      }
    }
    return initialData;
  }

  async #loadAs<T extends keyof IDatastore>(key: T): Promise<IDatastore[T]> {
    return await this.#storageService.get('npkh-' + key);
  }

  async save<T extends keyof IDatastore>(key: T, value: IDatastore[T]) {
    console.log('44:save-', key, value);
    return await this.#storageService.set('npkh-' + key, value);
  }
}
