import {
  HttpClient,
  provideHttpClient,
  withInterceptorsFromDi,
} from '@angular/common/http';
import {
  enableProdMode,
  importProvidersFrom,
  inject,
  LOCALE_ID,
  provideAppInitializer,
} from '@angular/core';
import { bootstrapApplication } from '@angular/platform-browser';
import { provideRouter, RouteReuseStrategy } from '@angular/router';
import {
  IonicRouteStrategy,
  provideIonicAngular,
} from '@ionic/angular/standalone';
import { IonicStorageModule } from '@ionic/storage-angular';
import { provideEffects } from '@ngrx/effects';
import { provideRouterStore, routerReducer } from '@ngrx/router-store';
import { provideStore, Store } from '@ngrx/store';
import { TranslateLoader, TranslateModule } from '@ngx-translate/core';
import { TranslateHttpLoader } from '@ngx-translate/http-loader';
import { AppComponent } from './app/app.component';

import { routes } from './app/app.routes';
import { ItemListEffects } from './app/state/@shared/item-list.effects';
import { ApplicationActions } from './app/state/application.actions';
import { ApplicationEffects } from './app/state/application.effects';
import { DialogsEffects } from './app/state/dialogs/dialogs.effects';

import { dialogsReducer } from './app/state/dialogs/dialogs.reducer';
import { MessageEffects } from './app/state/message.effects';
import { SettingsEffects } from './app/state/settings/settings.effects';
import { settingsReducer } from './app/state/settings/settings.reducer';
import { trackingReducer } from './app/state/tracking/tracking.reducer';
import { environment } from './environments/environment';
import { TrackingEffects } from './app/state/tracking/tracking.effects';

if (environment.production) {
  enableProdMode();
}

export function createTranslateLoader(http: HttpClient) {
  return new TranslateHttpLoader(http, './assets/i18n/', '.json');
}

const storageConfig = {
  name: 'np-time-tracker',
  dbKey: 'npTimeTracker',
  description: 'np-time-tracker task to time spent management',
  storeName: 'npTimeTracker',
};
void bootstrapApplication(AppComponent, {
  providers: [
    { provide: RouteReuseStrategy, useClass: IonicRouteStrategy },
    provideHttpClient(withInterceptorsFromDi()),
    provideRouter(routes),
    provideIonicAngular({ animated: true, mode: 'md' }),
    importProvidersFrom(IonicStorageModule.forRoot(storageConfig)),
    importProvidersFrom(
      TranslateModule.forRoot({
        defaultLanguage: 'de',
        loader: {
          provide: TranslateLoader,
          useFactory: createTranslateLoader,
          deps: [HttpClient],
        },
      })
    ),
    provideStore({
      router: routerReducer,
      settings: settingsReducer,
      tracking: trackingReducer,
      dialogs: dialogsReducer,
    }),
    provideRouterStore(),
    provideEffects(
      ApplicationEffects,
      MessageEffects,
      ItemListEffects,
      SettingsEffects,
      DialogsEffects,
      TrackingEffects
    ),
    {
      provide: LOCALE_ID,
      useValue: 'de-DE',
    },
    provideAppInitializer(() => {
      const initializerFn = (
        (store: Store) => () =>
          store.dispatch(ApplicationActions.load())
      )(inject(Store));
      return initializerFn();
    }),
  ],
});
