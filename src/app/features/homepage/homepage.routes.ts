import { Routes } from '@angular/router';
import { HomepageComponent } from './homepage.component';

/**
 * Routes de la page d'accueil.
 * Chargement eager (première page, critique pour le LCP).
 */
export const homepageRoutes: Routes = [
  { path: '', component: HomepageComponent },
];
