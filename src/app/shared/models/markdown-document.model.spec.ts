import type { MarkdownDocument } from './markdown-document.model';
import type { MarkdownFrontmatter } from './markdown-frontmatter.model';
import type { HeadingNode } from './heading-node.model';
import type { TocEntry } from './toc-entry.model';

describe('MarkdownDocument (modèle)', () => {
  it('devrait accepter un document complet', () => {
    const fm: MarkdownFrontmatter = { title: 'Test', description: 'Desc', order: 1 };
    const headings: HeadingNode[] = [{ id: 'intro', text: 'Introduction', level: 1 }];
    const toc: TocEntry[] = [{ id: 'intro', label: 'Introduction', level: 1 }];

    const doc: MarkdownDocument = {
      frontmatter: fm,
      content: '# Introduction\n\nContenu.',
      headings,
      tocEntries: toc,
      sourcePath: 'test.md',
    };

    expect(doc.frontmatter.title).toBe('Test');
    expect(doc.content).toContain('# Introduction');
    expect(doc.headings.length).toBe(1);
    expect(doc.tocEntries.length).toBe(1);
    expect(doc.sourcePath).toBe('test.md');
  });

  it('devrait accepter des tableaux vides pour headings et tocEntries', () => {
    const doc: MarkdownDocument = {
      frontmatter: { title: 'Vide', description: '', order: 0 },
      content: '',
      headings: [],
      tocEntries: [],
      sourcePath: 'vide.md',
    };
    expect(doc.headings).toEqual([]);
    expect(doc.tocEntries).toEqual([]);
  });
});
