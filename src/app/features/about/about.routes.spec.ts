import { aboutRoutes } from './about.routes';
import { AboutComponent } from './about.component';

describe('AboutRoutes', () => {
  it('devrait avoir exactement 1 route', () => {
    expect(aboutRoutes.length).toBe(1);
  });

  it('la route par défaut devrait charger AboutComponent', () => {
    const defaultRoute = aboutRoutes[0];
    expect(defaultRoute.path).toBe('');
    expect(defaultRoute.component).toBe(AboutComponent);
  });

  it('la route ne devrait pas avoir de routes enfants', () => {
    const defaultRoute = aboutRoutes[0];
    expect(defaultRoute.children).toBeUndefined();
  });
});
