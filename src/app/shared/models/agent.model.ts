/**
 * Catégorie fonctionnelle d'un agent Swarm.
 * Utilisée pour le filtrage sur la page de listing.
 */
export type AgentCategory = 'build' | 'qualité' | 'infrastructure';

/**
 * Route de complexité associée à un agent.
 * Définit le niveau de délégation de l'agent dans le pipeline Swarm.
 */
export type AgentRoute = 'DIRECT' | 'SIMPLE' | 'ADAPT' | 'MEDIUM' | 'FULL';

/**
 * Définition d'un agent du pipeline Swarm.
 * Chaque agent est une entité spécialisée avec un rôle, des responsabilités
 * et des contraintes spécifiques documentées en Markdown.
 */
export interface Agent {
  /** Identifiant unique pour le routage (ex: 'orchestrateur', 'front') */
  id: string;

  /** Nom affiché de l'agent (français) */
  name: string;

  /** Icône représentant l'agent (emoji) */
  emoji: string;

  /** Rôle résumé en une phrase (français) */
  role: string;

  /** Description détaillée pour la carte listing */
  description: string;

  /** Route de complexité associée */
  route: AgentRoute;

  /** L'agent est-il actif dans le pipeline ? */
  active: boolean;

  /** Catégorie fonctionnelle pour le filtrage */
  category: AgentCategory;

  /** Chemin relatif du fichier Markdown dans src/content/agents/ */
  sourcePath: string;
}
