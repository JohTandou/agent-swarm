/**
 * Catégorie fonctionnelle d'un skill Swarm.
 * Utilisée pour le filtrage sur la page de listing.
 */
export type SkillCategory = 'audit' | 'creation' | 'workflow' | 'documentation';

/**
 * Définition d'un skill du pipeline Swarm.
 * Chaque skill est une capacité spécialisée documentée en Markdown.
 */
export interface Skill {
  /** Identifiant unique pour le routage (ex: 'ui-ux-pro-max') */
  id: string;

  /** Nom affiché du skill (français) */
  name: string;

  /** Icône représentant le skill (emoji) */
  emoji: string;

  /** Description résumée pour la carte listing */
  description: string;

  /** Catégorie fonctionnelle pour le filtrage */
  category: SkillCategory;

  /** Chemin relatif du fichier Markdown dans src/content/skills/ */
  sourcePath: string;
}
