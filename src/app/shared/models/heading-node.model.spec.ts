import type { HeadingNode } from './heading-node.model';

describe('HeadingNode (modèle)', () => {
  it('devrait accepter un heading de niveau 1', () => {
    const node: HeadingNode = { id: 'intro', text: 'Introduction', level: 1 };
    expect(node.id).toBe('intro');
    expect(node.text).toBe('Introduction');
    expect(node.level).toBe(1);
    expect(node.children).toBeUndefined();
  });

  it('devrait accepter un heading avec enfants', () => {
    const node: HeadingNode = {
      id: 'archi',
      text: 'Architecture',
      level: 1,
      children: [
        { id: 'archi-front', text: 'Frontend', level: 2 },
        { id: 'archi-back', text: 'Backend', level: 2 },
      ],
    };
    expect(node.children).toBeDefined();
    expect(node.children!.length).toBe(2);
    expect(node.children![0].text).toBe('Frontend');
    expect(node.children![0].level).toBe(2);
  });

  it('devrait accepter les niveaux 1 à 4', () => {
    const levels: HeadingNode['level'][] = [1, 2, 3, 4];
    levels.forEach((level) => {
      const node: HeadingNode = { id: 'test', text: 'Test', level };
      expect(node.level).toBe(level);
    });
  });

  it('devrait accepter un heading de niveau 4 (profondeur max)', () => {
    const node: HeadingNode = { id: 'deep', text: 'Très profond', level: 4 };
    expect(node.level).toBe(4);
  });
});
