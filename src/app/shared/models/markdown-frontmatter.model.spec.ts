import type { MarkdownFrontmatter } from './markdown-frontmatter.model';

describe('MarkdownFrontmatter (modèle)', () => {
  it('devrait accepter les champs obligatoires', () => {
    const fm: MarkdownFrontmatter = { title: 'Test', description: 'Desc', order: 1 };
    expect(fm.title).toBe('Test');
    expect(fm.description).toBe('Desc');
    expect(fm.order).toBe(1);
  });

  it('devrait accepter des champs additionnels via l\'index signature', () => {
    const fm: MarkdownFrontmatter = {
      title: 'Titre',
      description: 'Description',
      order: 5,
      customField: 'valeur',
      tags: ['swarm', 'wiki'],
    };
    expect(fm['customField']).toBe('valeur');
    expect(fm['tags']).toEqual(['swarm', 'wiki']);
  });

  it('devrait accepter un order à 0', () => {
    const fm: MarkdownFrontmatter = { title: 'T', description: 'D', order: 0 };
    expect(fm.order).toBe(0);
  });
});
