import { Routes } from '@angular/router';

export const routes: Routes = [
  {
    path: 'tracking',
    data: { title: 'Zeiterfassung' },
    loadComponent: () =>
      import('./pages/tracking/tracking.page').then((m) => m.TrackingPage),
  },
  {
    path: 'data/:listId',
    data: { title: 'Zeiterfassungs Daten' },
    loadComponent: () =>
      import('./pages/data/data.page').then((m) => m.DataPage),
  },
  {
    path: 'settings',
    data: { title: 'Einstellungen' },
    loadComponent: () =>
      import('./pages/settings/settings.page').then((m) => m.SettingsPage),
  },
  {
    path: 'office-time',
    data: { title: 'Bürozeiten' },
    loadComponent: () =>
      import('./pages/office-time/office-time-page.component').then(
        (m) => m.OfficeTimePage
      ),
  },
  {
    path: '**',
    redirectTo: 'office-time',
    pathMatch: 'full',
  },
];
