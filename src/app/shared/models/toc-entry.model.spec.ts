import type { TocEntry } from './toc-entry.model';

describe('TocEntry (modèle)', () => {
  it('devrait accepter un TocEntry de niveau 1', () => {
    const entry: TocEntry = {
      id: 'introduction',
      label: 'Introduction',
      level: 1,
    };
    expect(entry.id).toBe('introduction');
    expect(entry.label).toBe('Introduction');
    expect(entry.level).toBe(1);
    expect(entry.children).toBeUndefined();
  });

  it('devrait accepter un TocEntry de niveau 2 avec enfants', () => {
    const entry: TocEntry = {
      id: 'architecture',
      label: 'Architecture',
      level: 2,
      children: [
        { id: 'architecture-frontend', label: 'Frontend', level: 3 },
      ],
    };
    expect(entry.level).toBe(2);
    expect(entry.children).toBeDefined();
    expect(entry.children!.length).toBe(1);
    expect(entry.children![0].level).toBe(3);
  });

  it('devrait accepter les niveaux valides (1, 2, 3)', () => {
    const levels: TocEntry['level'][] = [1, 2, 3];
    levels.forEach((level) => {
      const entry: TocEntry = { id: 'test', label: 'Test', level };
      expect(entry.level).toBe(level);
    });
  });
});
