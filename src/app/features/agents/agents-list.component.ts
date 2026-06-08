import { Component, signal, computed, inject } from '@angular/core';
import { RouterLink } from '@angular/router';
import { StaggerChildrenDirective } from '@shared/directives/stagger-children.directive';
import { UiBadgeComponent } from '@shared/components/ui-badge/ui-badge.component';
import { ToastService } from '@shared/services/toast.service';
import { UiButtonComponent } from '@shared/components/ui-button/ui-button.component';
import { TextRevealDirective } from '@shared/directives/text-reveal.directive';
import { UiEmptyStateComponent } from '@shared/components/ui-empty-state/ui-empty-state.component';
import type { Agent, AgentCategory } from '@shared/models';

/**
 * Définitions statiques des agents du pipeline Swarm.
 * Chaque agent est documenté en Markdown dans src/content/agents/.
 */
const AGENTS: Agent[] = [
  {
    id: 'orchestrateur',
    name: 'Orchestrateur',
    emoji: '🎯',
    role: "Chef d'orchestre du pipeline — classifie, route et supervise",
    description: "Point d'entrée unique, il analyse la complexité des demandes et orchestre la collaboration entre agents.",
    route: 'FULL',
    active: true,
    category: 'build',
    sourcePath: 'agents/orchestrateur.md',
  },
  {
    id: 'front',
    name: 'Front',
    emoji: '🎨',
    role: 'Implémente le frontend et génère des composants UI Apple-grade',
    description: "Responsable de tous les composants visibles : UI, animations, accessibilité, intégration des contrats TypeScript.",
    route: 'FULL',
    active: true,
    category: 'build',
    sourcePath: 'agents/front.md',
  },
  {
    id: 'back',
    name: 'Back',
    emoji: '⚙️',
    role: 'Implémente le backend, génère scripts, crons et configurations',
    description: "Respecte strictement la spécification OpenAPI sur la route FULL. S'appuie sur context7 pour la doc des frameworks.",
    route: 'FULL',
    active: false,
    category: 'build',
    sourcePath: 'agents/back.md',
  },
  {
    id: 'planner',
    name: 'Planner',
    emoji: '🧭',
    role: 'Planifie le travail en tâches atomiques assignées à front et back',
    description: "Détecte les choix architecturaux, les soumet à l'utilisateur, et délègue la définition des contrats à contract.",
    route: 'MEDIUM',
    active: true,
    category: 'build',
    sourcePath: 'agents/planner.md',
  },
  {
    id: 'contract',
    name: 'Contract',
    emoji: '📋',
    role: 'Écrit les types TypeScript, la spec OpenAPI et les migrations Supabase',
    description: "Source de vérité absolue pour front et back. Appelé uniquement sur la route FULL, par planner.",
    route: 'FULL',
    active: true,
    category: 'qualité',
    sourcePath: 'agents/contract.md',
  },
  {
    id: 'tester',
    name: 'Tester',
    emoji: '🧪',
    role: 'Génère les tests manquants, mesure la couverture et catégorise les erreurs',
    description: "Garant de la qualité logicielle. Seuil de couverture 80%. Rapporte des faits, corrige les gaps de test.",
    route: 'FULL',
    active: true,
    category: 'qualité',
    sourcePath: 'agents/tester.md',
  },
  {
    id: 'reviewer',
    name: 'Reviewer',
    emoji: '🔍',
    role: 'Gate de sécurité, qualité et audit des tests avant commit',
    description: "Intervient uniquement après tester PASS. Vérifie le code ET les tests générés. Approuve ou rejette.",
    route: 'MEDIUM',
    active: true,
    category: 'qualité',
    sourcePath: 'agents/reviewer.md',
  },
  {
    id: 'writer',
    name: 'Writer',
    emoji: '✍️',
    role: 'Met à jour la documentation technique après chaque commit',
    description: "Maintient CHANGELOG, API.md, ARCHITECTURE.md et README. Déclenché sur MEDIUM et FULL.",
    route: 'MEDIUM',
    active: true,
    category: 'qualité',
    sourcePath: 'agents/writer.md',
  },
  {
    id: 'search',
    name: 'Search',
    emoji: '🔎',
    role: 'Analyse le codebase et cartographie les dépendances',
    description: "Identifie les fichiers impactés, détecte les patterns, récupère la doc à jour. LECTURE SEULE absolue.",
    route: 'ADAPT',
    active: true,
    category: 'infrastructure',
    sourcePath: 'agents/search.md',
  },
  {
    id: 'explore',
    name: 'Explore',
    emoji: '🗺️',
    role: 'Exploration rapide du codebase pour recherche de fichiers et patterns',
    description: "Agent spécialisé dans la découverte : recherche par motif, mots-clés, et analyse de structure.",
    route: 'SIMPLE',
    active: true,
    category: 'infrastructure',
    sourcePath: 'agents/explore.md',
  },
  {
    id: 'general',
    name: 'General',
    emoji: '🤖',
    role: 'Agent polyvalent pour les tâches de recherche et exécution multi-étapes',
    description: "Exécute des unités de travail indépendantes, délègue les commandes shell, et orchestre les sous-tâches.",
    route: 'ADAPT',
    active: true,
    category: 'infrastructure',
    sourcePath: 'agents/general.md',
  },
];

/** Couleurs associées à chaque route de complexité */
const ROUTE_COLORS: Record<string, string> = {
  DIRECT: '#8E8882',
  SIMPLE: '#8E8882',
  ADAPT: '#F0A522',
  MEDIUM: '#F0A522',
  FULL: '#F0A522',
};

/** Labels des catégories pour les boutons de filtre */
const CATEGORY_LABELS: Record<AgentCategory, string> = {
  build: 'Build',
  qualité: 'Qualité',
  infrastructure: 'Infrastructure',
};

/**
 * Page listing des agents Swarm — grille bento asymétrique.
 *
 * États gérés :
 * - Success : grille de cartes avec pipeline animé
 * - Filtered : résultat filtré par catégorie
 * - Empty state : aucun agent ne correspond au filtre (ne devrait pas arriver)
 */
@Component({
  selector: 'app-agents-list',
  standalone: true,
  imports: [RouterLink, UiButtonComponent, UiBadgeComponent, StaggerChildrenDirective, TextRevealDirective, UiEmptyStateComponent],
  templateUrl: './agents-list.component.html',
  styleUrls: ['./agents-list.component.scss'],
})
export class AgentsListComponent {
  private readonly toastService = inject(ToastService);

  /** Liste complète des agents */
  readonly agents = AGENTS;

  /** Catégorie active pour le filtrage (null = toutes) */
  readonly activeCategory = signal<AgentCategory | null>(null);

  /** Agents filtrés selon la catégorie active */
  readonly filteredAgents = computed<Agent[]>(() => {
    const category = this.activeCategory();
    if (category === null) return this.agents;
    return this.agents.filter((a) => a.category === category);
  });

  /** Catégories disponibles avec leur label */
  readonly categories: AgentCategory[] = ['build', 'qualité', 'infrastructure'];

  /** Vrai si un filtre est actif */
  readonly isFiltered = computed(() => this.activeCategory() !== null);

  /**
   * Active ou désactive un filtre de catégorie.
   * Si la catégorie est déjà active → désactive (affiche tout).
   * Affiche un toast avec le nombre d'agents trouvés.
   */
  toggleCategory(category: AgentCategory): void {
    if (this.activeCategory() === category) {
      this.activeCategory.set(null);
      this.toastService.show(`${this.agents.length} agents affichés`, 'info');
    } else {
      this.activeCategory.set(category);
      const count = this.getCategoryCount(category);
      this.toastService.show(`${count} agents trouvés — ${CATEGORY_LABELS[category]}`, 'success');
    }
  }

  /** Retourne le label français pour une catégorie */
  getCategoryLabel(category: AgentCategory): string {
    return CATEGORY_LABELS[category];
  }

  /** Retourne la couleur associée à une route */
  getRouteColor(route: string): string {
    return ROUTE_COLORS[route] ?? '#8E8882';
  }

  /** Retourne le nombre d'agents dans une catégorie donnée */
  getCategoryCount(category: AgentCategory): number {
    return this.agents.filter((a) => a.category === category).length;
  }

  /** Réinitialise tous les filtres — affiche tous les agents */
  resetFilters(): void {
    this.activeCategory.set(null);
    this.toastService.show(`${this.agents.length} agents affichés`, 'info');
  }
}
