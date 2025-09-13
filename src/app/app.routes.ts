import { Routes } from '@angular/router';

export const routes: Routes = [
  {
    path: 'tracking',
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
    path: 'office-time',
    loadComponent: () =>
      import('./pages/office-time/office-time-page.component').then(
        (m) => m.OfficeTimePage
      ),
  },
  {
    path: '**',
    redirectTo: 'tracking',
    pathMatch: 'full',
  },
];
