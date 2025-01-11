import { Routes } from '@angular/router';

export const routes: Routes = [
  {
    path: 'tracking/_tracking',
    loadComponent: () =>
      import('./pages/tracking/tracking.page').then((m) => m.TrackingPage),
  },
  {
    path: 'data/:listId',
    loadComponent: () =>
      import('./pages/data/data.page').then((m) => m.DataPage),
  },
  {
    path: 'settings',
    loadComponent: () =>
      import('./pages/settings/settings.page').then((m) => m.SettingsPage),
  },
  {
    path: '**',
    redirectTo: 'tracking/_tracking',
    pathMatch: 'full',
  },
];
