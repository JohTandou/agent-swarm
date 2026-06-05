/**
 * Configuration d'entrée pour le composant MarkdownRenderer.
 * Définit le contenu à rendre et les options de plugins.
 */
export interface MarkdownConfig {
  /** Contenu Markdown brut à rendre (corps sans frontmatter) */
  content: string;

  /** URL de base pour la résolution des liens relatifs internes au wiki */
  baseUrl?: string;

  /** Active le lazy-loading de Mermaid.js pour les diagrammes (charge ~500KB) */
  enableMermaid?: boolean;

  /** Active la coloration syntaxique via Prism.js (activé par défaut) */
  enablePrism?: boolean;
}
