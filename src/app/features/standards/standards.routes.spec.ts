import { standardsRoutes } from './standards.routes';
import { StandardsComponent } from './standards.component';

describe('StandardsRoutes', () => {
  it('devrait avoir exactement 1 route', () => {
    expect(standardsRoutes.length).toBe(1);
  });

  it('la route par défaut devrait charger StandardsComponent', () => {
    const defaultRoute = standardsRoutes[0];
    expect(defaultRoute.path).toBe('');
    expect(defaultRoute.component).toBe(StandardsComponent);
  });

  it('la route ne devrait pas avoir de routes enfants', () => {
    const defaultRoute = standardsRoutes[0];
    expect(defaultRoute.children).toBeUndefined();
  });
});
