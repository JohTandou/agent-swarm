import { Routes } from '@angular/router';
import { StandardsComponent } from './standards.component';

/**
 * Routes pour la page Standards.
 * Route unique : '' → StandardsComponent.
 */
export const standardsRoutes: Routes = [
  { path: '', component: StandardsComponent },
];
