import { Routes } from '@angular/router';

/**
 * Routes racine de l'application.
 * Lazy loading par feature pour optimiser le chargement.
 * Layout shell + homepage chargés eagerly via AppComponent.
 */
export const routes: Routes = [
  {
    path: '',
    loadChildren: () =>
      import('./features/homepage/homepage.routes').then((m) => m.homepageRoutes),
  },
  {
    path: 'a-propos',
    loadChildren: () =>
      import('./features/about/about.routes').then((m) => m.aboutRoutes),
  },
  /* Route wildcard — redirige vers l'accueil */
  { path: '**', redirectTo: '' },
];
