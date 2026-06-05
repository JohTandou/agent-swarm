import { problemInnovationRoutes } from './problem-innovation.routes';
import { ProblemInnovationComponent } from './problem-innovation.component';

describe('ProblemInnovationRoutes', () => {
  it('devrait avoir exactement 1 route', () => {
    expect(problemInnovationRoutes.length).toBe(1);
  });

  it('la route par défaut devrait charger ProblemInnovationComponent', () => {
    const defaultRoute = problemInnovationRoutes[0];
    expect(defaultRoute.path).toBe('');
    expect(defaultRoute.component).toBe(ProblemInnovationComponent);
  });

  it('la route ne devrait pas avoir de routes enfants', () => {
    const defaultRoute = problemInnovationRoutes[0];
    expect(defaultRoute.children).toBeUndefined();
  });
});
