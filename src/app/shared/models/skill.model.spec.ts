import type { Skill, SkillCategory } from './skill.model';

describe('Skill model', () => {
  it('devrait accepter un objet Skill valide', () => {
    const skill: Skill = {
      id: 'ui-ux-pro-max',
      name: 'UI/UX Pro Max',
      emoji: '🎨',
      description: 'Intelligence de design UI/UX',
      tags: [],
      category: 'création',
      sourcePath: 'skills/ui-ux-pro-max.md',
    };

    expect(skill.id).toBe('ui-ux-pro-max');
    expect(skill.name).toBe('UI/UX Pro Max');
    expect(skill.emoji).toBe('🎨');
    expect(skill.description).toBe('Intelligence de design UI/UX');
    expect(skill.tags).toEqual([]);
    expect(skill.category).toBe('création');
    expect(skill.sourcePath).toBe('skills/ui-ux-pro-max.md');
  });

  it('devrait accepter toutes les catégories valides', () => {
    const categories: SkillCategory[] = ['création', 'qualité', 'analyse'];
    expect(categories.length).toBe(3);
    expect(categories).toContain('création');
    expect(categories).toContain('qualité');
    expect(categories).toContain('analyse');
  });

  it('devrait permettre un skill de catégorie qualité', () => {
    const skill: Skill = {
      id: 'audit-global',
      name: 'Audit Global',
      emoji: '🔍',
      description: 'Audit complet du projet',
      tags: [],
      category: 'qualité',
      sourcePath: 'skills/audit-global.md',
    };

    expect(skill.category).toBe('qualité');
  });

  it('devrait permettre un skill de catégorie analyse', () => {
    const skill: Skill = {
      id: 'graphify',
      name: 'Graphify',
      emoji: '🕸️',
      description: 'Transforme en graphe de connaissances',
      tags: [],
      category: 'analyse',
      sourcePath: 'skills/graphify.md',
    };

    expect(skill.category).toBe('analyse');
  });
});
