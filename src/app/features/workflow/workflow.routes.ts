import { Routes } from '@angular/router';
import { WorkflowComponent } from './workflow.component';

/**
 * Routes de la page Workflow.
 * Route unique : '' → WorkflowComponent.
 */
export const workflowRoutes: Routes = [
  { path: '', component: WorkflowComponent },
];
