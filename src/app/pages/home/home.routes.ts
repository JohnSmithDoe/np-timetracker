import { Routes } from '@angular/router';
import { HomePage } from './home.page';

const redirectToStartPage = '/home/tracking/_tracking';
export const routes: Routes = [
  {
    path: 'home',
    component: HomePage,
    children: [
      {
        path: 'tracking/:listId',
        loadComponent: () =>
          import('../tracking/tracking.page').then((m) => m.TrackingPage),
      },
      {
        path: '',
        redirectTo: redirectToStartPage,
        pathMatch: 'full',
      },
    ],
  },
  {
    path: '',
    redirectTo: redirectToStartPage,
    pathMatch: 'full',
  },
];
