/**
 * Configuration du layout shell (coquille applicative).
 * Définit la visibilité et les dimensions des zones structurelles de l'interface.
 */
export interface ShellConfig {
  /**
   * Affichage de la sidebar de navigation gauche.
   * `false` sur mobile (navigation via overlay/bottom sheet à la place).
   */
  showSidebar: boolean;

  /**
   * Affichage de la table des matières (TOC) dans le panneau droit.
   * `true` uniquement sur les pages de contenu long (documentation, articles).
   */
  showToc: boolean;

  /** Largeur de la sidebar gauche en unités CSS (ex: '280px') */
  sidebarWidth: string;

  /** Largeur de la table des matières droite en unités CSS (ex: '220px') */
  tocWidth: string;
}
