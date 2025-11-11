import { Routes } from '@angular/router';

export const routes: Routes = [
  // Ruta para Dashboard
  {
    path: 'dashboard',
    loadComponent: () => import('./pages/dashboard/dashboard').then((m) => m.Dashboard),
  },
  {
    path: 'weather',
    loadComponent: () => import('./pages/weather-tabs/weather-tabs').then((m) => m.WeatherTabs),
  },
  {
    // Usamos un parámetro de ruta para el zipcode
    path: 'forecast/:zipcode',
    loadComponent: () => import('./pages/forecast/forecast').then((m) => m.Forecast),
  },
  {
    path: '',
    redirectTo: '/dashboard',
    pathMatch: 'full',
  },
  {
    path: '**',
    redirectTo: '/dashboard',
  },
];
