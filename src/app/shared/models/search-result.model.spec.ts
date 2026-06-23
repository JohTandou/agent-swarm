import type { SearchResult } from './search-result.model';

describe('SearchResult (modèle)', () => {
  it('devrait accepter un SearchResult complet', () => {
    const result: SearchResult = {
      title: 'Orchestrator',
      description: "Chef d'orchestre du pipeline Swarm",
      route: '/agents/orchestrateur',
      section: 'Agents',
      sourcePath: 'agents/orchestrateur.md',
    };

    expect(result.title).toBe('Orchestrator');
    expect(result.description).toBe("Chef d'orchestre du pipeline Swarm");
    expect(result.route).toBe('/agents/orchestrateur');
    expect(result.section).toBe('Agents');
    expect(result.sourcePath).toBe('agents/orchestrateur.md');
  });

  it('devrait supporter les 3 sections du wiki', () => {
    const sections = ['Agents', 'Skills', 'Documentation'];
    sections.forEach((section) => {
      const result: SearchResult = {
        title: 'Test',
        description: 'Test',
        route: '/test',
        section,
        sourcePath: 'test.md',
      };
      expect(result.section).toBe(section);
    });
  });

  it('devrait accepter une description vide', () => {
    const result: SearchResult = {
      title: 'Sans description',
      description: '',
      route: '/empty',
      section: 'Documentation',
      sourcePath: 'empty.md',
    };

    expect(result.description).toBe('');
    expect(result.title).toBe('Sans description');
  });
});
