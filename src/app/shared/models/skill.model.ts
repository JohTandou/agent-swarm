/**
 * Catégorie fonctionnelle d'un skill Swarm.
 * Utilisée pour le filtrage sur la page de listing.
 */
export type SkillCategory = 'creation' | 'audit' | 'workflow' | 'documentation';

/**
 * Définition d'un skill du système Swarm.
 * Chaque skill est un module réutilisable documenté en Markdown.
 */
export interface Skill {
  /** Identifiant unique pour le routage (ex: 'ui-ux-pro-max', 'tests-create') */
  id: string;

  /** Nom affiché du skill (français) */
  name: string;

  /** Icône représentant le skill (emoji) */
  emoji: string;

  /** Description courte pour la carte listing */
  description: string;

  /** Tags associés au skill */
  tags: string[];

  /** Catégorie fonctionnelle pour le filtrage */
  category: SkillCategory;

  /** Chemin relatif du fichier Markdown dans src/content/skills/ */
  sourcePath: string;

  /** Ordre d'affichage (défini dans le frontmatter YAML) */
  order: number;
}
