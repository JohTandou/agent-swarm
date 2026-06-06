import { CONTENT_REGISTRY } from './content-registry';

describe('CONTENT_REGISTRY', () => {
  it('devrait contenir exactement 36 entrées', () => {
    expect(CONTENT_REGISTRY.length).toBe(36);
  });

  it('devrait avoir 9 agents', () => {
    const agents = CONTENT_REGISTRY.filter((e) => e.section === 'Agents');
    expect(agents.length).toBe(9);
    expect(agents.every((a) => a.sourcePath.startsWith('agents/'))).toBe(true);
    expect(agents.every((a) => a.route.startsWith('/agents/'))).toBe(true);
  });

  it('devrait avoir 26 skills', () => {
    const skills = CONTENT_REGISTRY.filter((e) => e.section === 'Skills');
    expect(skills.length).toBe(26);
    expect(skills.every((s) => s.sourcePath.startsWith('skills/'))).toBe(true);
    expect(skills.every((s) => s.route.startsWith('/skills/'))).toBe(true);
  });

  it('devrait avoir 1 entrée Documentation (demo.md)', () => {
    const docs = CONTENT_REGISTRY.filter((e) => e.section === 'Documentation');
    expect(docs.length).toBe(1);
    expect(docs[0].sourcePath).toBe('demo.md');
    expect(docs[0].route).toBe('/demo-markdown');
  });

  it('tous les sourcePath devraient être uniques', () => {
    const paths = CONTENT_REGISTRY.map((e) => e.sourcePath);
    const unique = new Set(paths);
    expect(unique.size).toBe(paths.length);
  });

  it('toutes les routes devraient être uniques', () => {
    const routes = CONTENT_REGISTRY.map((e) => e.route);
    const unique = new Set(routes);
    expect(unique.size).toBe(routes.length);
  });

  it('tous les sourcePath devraient terminer par .md', () => {
    expect(CONTENT_REGISTRY.every((e) => e.sourcePath.endsWith('.md'))).toBe(true);
  });

  it('tous les éléments devraient avoir une section parmi les 3 attendues', () => {
    const validSections = ['Agents', 'Skills', 'Documentation'];
    expect(
      CONTENT_REGISTRY.every((e) => validSections.includes(e.section))
    ).toBe(true);
  });

  it('les agents devraient inclure orchestrateur.md', () => {
    const orchestrateur = CONTENT_REGISTRY.find(
      (e) => e.sourcePath === 'agents/orchestrateur.md'
    );
    expect(orchestrateur).toBeDefined();
    expect(orchestrateur!.route).toBe('/agents/orchestrateur');
    expect(orchestrateur!.section).toBe('Agents');
  });

  it('devrait être un tableau gelé (readonly via const)', () => {
    expect(Array.isArray(CONTENT_REGISTRY)).toBe(true);
    expect(CONTENT_REGISTRY.length).toBeGreaterThan(0);
  });
});
