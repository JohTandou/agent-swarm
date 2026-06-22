import { ecosystemRoutes } from './ecosystem.routes';
import { EcosystemComponent } from './ecosystem.component';

describe('ecosystemRoutes', () => {
  it('devrait définir la route vide vers EcosystemComponent', () => {
    const defaultRoute = ecosystemRoutes.find(r => r.path === '');
    expect(defaultRoute).toBeDefined();
    expect(defaultRoute?.component).toBe(EcosystemComponent);
  });

  it('devrait contenir exactement une route', () => {
    expect(ecosystemRoutes.length).toBe(1);
  });
});
