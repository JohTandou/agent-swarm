/**
 * Entrée de la table des matières (Table of Contents).
 * Représente un heading extrait du contenu Markdown pour la navigation intra-page.
 */
export interface TocEntry {
  /** ID du heading HTML utilisé pour l'ancre de navigation (ex: 'section-introduction') */
  id: string;

  /** Texte affiché du heading dans la table des matières */
  label: string;

  /**
   * Niveau hiérarchique du heading.
   * 1 = h1 (titre principal), 2 = h2 (section), 3 = h3 (sous-section).
   * Utilisé pour l'indentation visuelle dans la TOC.
   */
  level: 1 | 2 | 3;

  /** Sous-entrées pour une table des matières hiérarchique */
  children?: TocEntry[];
}
