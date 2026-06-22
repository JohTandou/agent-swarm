/**
 * Élément de navigation pour la sidebar hiérarchique.
 * Supporte l'imbrication pour les menus pliables (arborescence).
 */
export interface NavItem {
  /** Texte affiché dans la navigation (français) */
  label: string;

  /** Route Angular associée à cet élément */
  route: string;

  /** Icône SVG optionnelle — nom de l'icône référencé dans le registre d'icônes */
  icon?: string;

  /** Sous-éléments de navigation pour créer un menu pliable hiérarchique */
  children?: NavItem[];

  /** État d'expansion du sous-menu — contrôlé par le toggle utilisateur */
  expanded?: boolean;

  /** Si true, le clic sur le label déclenche toggleExpand() + navigation vers children[0].route */
  expandOnClick?: boolean;
}
