import { agentsRoutes } from './agents.routes';
import { AgentsListComponent } from './agents-list.component';
import { AgentDetailComponent } from './agent-detail.component';

describe('AgentsRoutes', () => {
  it('devrait avoir exactement 2 routes', () => {
    expect(agentsRoutes.length).toBe(2);
  });

  it('la première route (path: "") devrait charger AgentsListComponent', () => {
    const listRoute = agentsRoutes[0];
    expect(listRoute.path).toBe('');
    expect(listRoute.component).toBe(AgentsListComponent);
  });

  it('la deuxième route (path: ":id") devrait charger AgentDetailComponent', () => {
    const detailRoute = agentsRoutes[1];
    expect(detailRoute.path).toBe(':id');
    expect(detailRoute.component).toBe(AgentDetailComponent);
  });

  it('aucune route ne devrait avoir de routes enfants', () => {
    agentsRoutes.forEach((route) => {
      expect(route.children).toBeUndefined();
    });
  });
});
