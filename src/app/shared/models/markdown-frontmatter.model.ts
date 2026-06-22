/**
 * Métadonnées extraites du bloc YAML en tête de chaque fichier Markdown.
 * Ces champs sont obligatoires dans le frontmatter de tous les fichiers .md du wiki.
 */
export interface MarkdownFrontmatter {
  /** Titre du document — affiché comme H1 et utilisé dans le breadcrumb */
  title: string;

  /** Description courte — utilisée pour le SEO et les aperçus dans les listes */
  description: string;

  /** Ordre de tri dans les listes et la navigation (ordre croissant) */
  order: number;

  /** Auteur du document (optionnel, utilisé pour le SEO) */
  author?: string;

  /** Champs additionnels libres — extensibilité sans rupture de contrat */
  [key: string]: unknown;
}
