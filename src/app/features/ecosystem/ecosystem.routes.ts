import { Routes } from '@angular/router';
import { EcosystemComponent } from './ecosystem.component';

/**
 * Routes de la page Écosystème.
 * Route unique : '' → EcosystemComponent.
 */
export const ecosystemRoutes: Routes = [
  { path: '', component: EcosystemComponent },
];
