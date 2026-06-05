import { workflowRoutes } from './workflow.routes';
import { WorkflowComponent } from './workflow.component';

describe('WorkflowRoutes', () => {
  it('devrait avoir exactement 1 route', () => {
    expect(workflowRoutes.length).toBe(1);
  });

  it('la route par défaut devrait charger WorkflowComponent', () => {
    const defaultRoute = workflowRoutes[0];
    expect(defaultRoute.path).toBe('');
    expect(defaultRoute.component).toBe(WorkflowComponent);
  });

  it('la route ne devrait pas avoir de routes enfants', () => {
    const defaultRoute = workflowRoutes[0];
    expect(defaultRoute.children).toBeUndefined();
  });
});
