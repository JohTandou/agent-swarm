import type { Skill, SkillCategory } from './skill.model';

describe('Skill model', () => {
  it('devrait accepter un objet Skill valide', () => {
    const skill: Skill = {
      id: 'ui-ux-pro-max',
      name: 'UI/UX Pro Max',
      emoji: '🎨',
      description: 'Intelligence de design UI/UX',
      category: 'creation',
      sourcePath: 'skills/ui-ux-pro-max.md',
    };

    expect(skill.id).toBe('ui-ux-pro-max');
    expect(skill.name).toBe('UI/UX Pro Max');
    expect(skill.emoji).toBe('🎨');
    expect(skill.description).toBe('Intelligence de design UI/UX');
    expect(skill.category).toBe('creation');
    expect(skill.sourcePath).toBe('skills/ui-ux-pro-max.md');
  });

  it('devrait accepter toutes les catégories valides', () => {
    const categories: SkillCategory[] = ['audit', 'creation', 'workflow', 'documentation'];
    expect(categories.length).toBe(4);
    expect(categories).toContain('audit');
    expect(categories).toContain('creation');
    expect(categories).toContain('workflow');
    expect(categories).toContain('documentation');
  });

  it('devrait permettre un skill de catégorie audit', () => {
    const skill: Skill = {
      id: 'audit-global',
      name: 'Audit Global',
      emoji: '🔍',
      description: 'Audit complet du projet',
      category: 'audit',
      sourcePath: 'skills/audit-global.md',
    };

    expect(skill.category).toBe('audit');
  });

  it('devrait permettre un skill de catégorie workflow', () => {
    const skill: Skill = {
      id: 'graphify',
      name: 'Graphify',
      emoji: '🕸️',
      description: 'Transforme en graphe de connaissances',
      category: 'workflow',
      sourcePath: 'skills/graphify.md',
    };

    expect(skill.category).toBe('workflow');
  });
});
