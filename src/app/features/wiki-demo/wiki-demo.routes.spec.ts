import { wikiDemoRoutes } from './wiki-demo.routes';
import { WikiDemoComponent } from './wiki-demo.component';

describe('WikiDemoRoutes', () => {
  it('devrait avoir exactement 1 route', () => {
    expect(wikiDemoRoutes.length).toBe(1);
  });

  it('la route par défaut devrait charger WikiDemoComponent', () => {
    const defaultRoute = wikiDemoRoutes[0];
    expect(defaultRoute.path).toBe('');
    expect(defaultRoute.component).toBe(WikiDemoComponent);
  });

  it('la route ne devrait pas avoir de routes enfants', () => {
    const defaultRoute = wikiDemoRoutes[0];
    expect(defaultRoute.children).toBeUndefined();
  });
});
