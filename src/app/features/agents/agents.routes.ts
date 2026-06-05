import { Routes } from '@angular/router';
import { AgentsListComponent } from './agents-list.component';
import { AgentDetailComponent } from './agent-detail.component';

/**
 * Routes de la section Agents.
 * Lazy loading par feature — chargé à la demande.
 * Route avec paramètre :id pour les pages de détail.
 */
export const agentsRoutes: Routes = [
  { path: '', component: AgentsListComponent },
  { path: ':id', component: AgentDetailComponent },
];
