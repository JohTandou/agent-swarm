/**
 * Segment du fil d'Ariane (breadcrumb).
 * Utilisé pour construire la navigation contextuelle secondaire.
 */
export interface Breadcrumb {
  /** Texte affiché pour ce segment du fil d'Ariane */
  label: string;

  /**
   * Route cliquable associée à ce segment.
   * `undefined` pour le dernier segment (page courante, non cliquable).
   * `/` pour la racine (Accueil).
   */
  route?: string;
}
