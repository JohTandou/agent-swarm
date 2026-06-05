import type { NavItem } from './navigation.model';

describe('NavItem (modèle)', () => {
  it('devrait accepter un objet conforme à l\'interface NavItem (niveau racine)', () => {
    const item: NavItem = {
      label: 'Accueil',
      route: '/',
    };
    expect(item.label).toBe('Accueil');
    expect(item.route).toBe('/');
    expect(item.children).toBeUndefined();
  });

  it('devrait accepter un NavItem avec enfants', () => {
    const item: NavItem = {
      label: 'Agents',
      route: '/agents',
      expanded: false,
      children: [
        { label: 'Orchestrateur', route: '/agents/orchestrateur' },
        { label: 'Front', route: '/agents/front' },
      ],
    };
    expect(item.children?.length).toBe(2);
    expect(item.expanded).toBeFalse();
  });

  it('devrait accepter un NavItem avec icône optionnelle', () => {
    const item: NavItem = {
      label: 'Workflow',
      route: '/workflow',
      icon: 'workflow-icon',
    };
    expect(item.icon).toBe('workflow-icon');
  });

  it('devrait permettre de basculer expanded', () => {
    const item: NavItem = {
      label: 'Outils',
      route: '/outils',
      children: [{ label: 'Supabase', route: '/outils/supabase' }],
    };
    item.expanded = true;
    expect(item.expanded).toBeTrue();
    item.expanded = false;
    expect(item.expanded).toBeFalse();
  });
});
