import { Component, signal, computed, inject } from '@angular/core';
import { RouterLink } from '@angular/router';
import { StaggerChildrenDirective } from '@shared/directives/stagger-children.directive';
import { UiBadgeComponent } from '@shared/components/ui-badge/ui-badge.component';
import { ToastService } from '@shared/services/toast.service';
import { UiButtonComponent } from '@shared/components/ui-button/ui-button.component';
import { TextRevealDirective } from '@shared/directives/text-reveal.directive';
import { UiEmptyStateComponent } from '@shared/components/ui-empty-state/ui-empty-state.component';
import type { Agent, AgentCategory } from '@shared/models';
import { AGENTS, CATEGORY_LABELS, ROUTE_COLORS } from '@shared/data/agents.data';

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
    return ROUTE_COLORS[route] ?? '#7A8899';
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
