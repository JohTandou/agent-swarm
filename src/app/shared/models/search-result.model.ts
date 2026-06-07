/**
 * Résultat de recherche pour le composant Cmd+K.
 * Chaque entrée correspond à un document Markdown indexable.
 */
export interface SearchResult {
  /** Titre du document (extrait du frontmatter YAML) */
  title: string;

  /** Description courte (extrait du frontmatter YAML) */
  description: string;

  /** Route Angular pour la navigation (ex: '/agents/orchestrateur') */
  route: string;

  /** Section du wiki à laquelle appartient le document (ex: 'Agents', 'Skills') */
  section: string;

  /** Chemin relatif du fichier dans src/content/ (ex: 'agents/orchestrateur.md') */
  sourcePath: string;
}
