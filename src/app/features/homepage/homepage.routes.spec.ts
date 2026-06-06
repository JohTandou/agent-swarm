import { homepageRoutes } from './homepage.routes';
import { HomepageComponent } from './homepage.component';

describe('HomepageRoutes', () => {
  it('devrait avoir exactement 1 route', () => {
    expect(homepageRoutes.length).toBe(1);
  });

  it('la route par défaut devrait charger HomepageComponent', () => {
    const defaultRoute = homepageRoutes[0];
    expect(defaultRoute.path).toBe('');
    expect(defaultRoute.component).toBe(HomepageComponent);
  });

  it('la route ne devrait pas avoir de routes enfants', () => {
    const defaultRoute = homepageRoutes[0];
    expect(defaultRoute.children).toBeUndefined();
  });
});
