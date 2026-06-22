import type { MarkdownConfig } from './markdown-config.model';

describe('MarkdownConfig (modèle)', () => {
  it('devrait accepter une config minimale', () => {
    const config: MarkdownConfig = { content: '# Hello' };
    expect(config.content).toBe('# Hello');
    expect(config.baseUrl).toBeUndefined();
    expect(config.enableMermaid).toBeUndefined();
    expect(config.enablePrism).toBeUndefined();
  });

  it('devrait accepter toutes les options', () => {
    const config: MarkdownConfig = {
      content: '# Titre\n\nTexte.',
      baseUrl: '/wiki/',
      enableMermaid: true,
      enablePrism: false,
    };
    expect(config.content).toContain('# Titre');
    expect(config.baseUrl).toBe('/wiki/');
    expect(config.enableMermaid).toBe(true);
    expect(config.enablePrism).toBe(false);
  });
});
