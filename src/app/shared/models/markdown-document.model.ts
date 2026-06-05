import type { MarkdownFrontmatter } from './markdown-frontmatter.model';
import type { HeadingNode } from './heading-node.model';
import type { TocEntry } from './toc-entry.model';

/**
 * Document Markdown complètement parsé — résultat du ContentService.
 * Combine le frontmatter, le corps brut, la hiérarchie des headings
 * et la version aplatie pour le composant TOC.
 */
export interface MarkdownDocument {
  /** Métadonnées extraites du bloc YAML en-tête */
  frontmatter: MarkdownFrontmatter;

  /** Corps Markdown brut sans le bloc frontmatter — prêt à être rendu par ngx-markdown */
  content: string;

  /** Hiérarchie complète des headings pour navigation intra-document */
  headings: HeadingNode[];

  /** Version aplatie des headings pour le composant TOC de la sidebar */
  tocEntries: TocEntry[];

  /** Chemin relatif du fichier source (ex: 'agents/orchestrateur.md') */
  sourcePath: string;
}
