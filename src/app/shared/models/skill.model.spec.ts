import type { Skill, SkillCategory } from './skill.model';

describe('Skill model', () => {
  it('devrait accepter un objet Skill valide', () => {
    const skill: Skill = {
      id: 'ui-ux-pro-max',
      name: 'UI/UX Pro Max',
      emoji: '🎨',
      description: 'Intelligence de design UI/UX',
      tags: [],
      category: 'creation',
      sourcePath: 'skills/ui-ux-pro-max.md',
      order: 1,
    };

    expect(skill.id).toBe('ui-ux-pro-max');
    expect(skill.name).toBe('UI/UX Pro Max');
    expect(skill.emoji).toBe('🎨');
    expect(skill.description).toBe('Intelligence de design UI/UX');
    expect(skill.tags).toEqual([]);
    expect(skill.category).toBe('creation');
    expect(skill.sourcePath).toBe('skills/ui-ux-pro-max.md');
  });

  it('devrait accepter toutes les catégories valides', () => {
    const categories: SkillCategory[] = ['creation', 'audit'];
    expect(categories.length).toBe(2);
    expect(categories).toContain('creation');
    expect(categories).toContain('audit');
    expect(categories).toContain('workflow');
    expect(categories).toContain('documentation');
  });

  it('devrait permettre un skill de catégorie audit', () => {
    const skill: Skill = {
      id: 'audit-global',
      name: 'Audit Global',
      emoji: '🔍',
      description: 'Audit complet du projet',
      tags: [],
      category: 'audit',
      sourcePath: 'skills/audit-global.md',
      order: 2,
    };

    expect(skill.category).toBe('audit');
  });

  it('devrait permettre un skill de catégorie workflow', () => {
    const skill: Skill = {
      id: 'graphify',
      name: 'Graphify',
      emoji: '🕸️',
      description: 'Transforme en graphe de connaissances',
      tags: [],
      category: 'workflow',
      sourcePath: 'skills/graphify.md',
      order: 3,
    };

    expect(skill.category).toBe('workflow');
  });
});
