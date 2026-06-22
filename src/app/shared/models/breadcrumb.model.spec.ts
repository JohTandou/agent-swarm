import type { Breadcrumb } from './breadcrumb.model';

describe('Breadcrumb (modèle)', () => {
  it('devrait accepter un breadcrumb avec route', () => {
    const crumb: Breadcrumb = {
      label: 'Accueil',
      route: '/',
    };
    expect(crumb.label).toBe('Accueil');
    expect(crumb.route).toBe('/');
  });

  it('devrait accepter un breadcrumb sans route (page courante)', () => {
    const crumb: Breadcrumb = {
      label: 'Documentation',
    };
    expect(crumb.label).toBe('Documentation');
    expect(crumb.route).toBeUndefined();
  });

  it('devrait supporter un tableau mixte de breadcrumbs', () => {
    const breadcrumbs: Breadcrumb[] = [
      { label: 'Accueil', route: '/' },
      { label: 'Agents', route: '/agents' },
      { label: 'Orchestrateur' },
    ];
    expect(breadcrumbs.length).toBe(3);
    expect(breadcrumbs[0].route).toBe('/');
    expect(breadcrumbs[1].route).toBe('/agents');
    expect(breadcrumbs[2].route).toBeUndefined();
  });
});
