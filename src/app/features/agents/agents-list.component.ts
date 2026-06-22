import { Component, signal, computed, inject } from '@angular/core';
import { RouterLink } from '@angular/router';
import { StaggerChildrenDirective } from '@shared/directives/stagger-children.directive';
import { UiBadgeComponent } from '@shared/components/ui-badge/ui-badge.component';
import { ToastService } from '@shared/services/toast.service';
import { TranslationService } from '@shared/services/translation.service';
import { UiButtonComponent } from '@shared/components/ui-button/ui-button.component';
import { TextRevealDirective } from '@shared/directives/text-reveal.directive';
import { UiEmptyStateComponent } from '@shared/components/ui-empty-state/ui-empty-state.component';
import { JsonLdService } from '@shared/services/json-ld.service';
import type { Agent, AgentCategory } from '@shared/models';
import { AGENTS, ROUTE_COLORS } from '@shared/data/agents.data';

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
  private readonly translate = inject(TranslationService);
  private readonly toastService = inject(ToastService);
  private readonly jsonLdService = inject(JsonLdService);

  /** Liste complète des agents */
  readonly agents = AGENTS;

  /** Catégorie active pour le filtrage (null = toutes) */
  readonly activeCategory = signal<AgentCategory | null>(null);

  constructor() {
    // Schéma ItemList pour le SEO — liste des 11 agents
    const itemListItems = AGENTS.map((agent) => ({
      name: agent.name,
      url: `https://swarm-wiki.vercel.app/agents/${agent.id}`,
      description: agent.description,
    }));
    this.jsonLdService.addSchemas([this.jsonLdService.generateItemListSchema(itemListItems)]);
  }

  /** Raccourci pour les traductions dans le template */
  t(key: string): string {
    return this.translate.translate(key);
  }

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
      this.toastService.show(
        this.translate.translate('toast.agents.all').replace('{n}', String(this.agents.length)),
        'info',
      );
    } else {
      this.activeCategory.set(category);
      const count = this.getCategoryCount(category);
      const categoryLabel = this.translate.translate('agents.category.' + category);
      this.toastService.show(
        this.translate.translate('toast.agents.filtered').replace('{n}', String(count)).replace('{category}', categoryLabel),
        'success',
      );
    }
  }

  /** Retourne le label traduit pour une catégorie */
  getCategoryLabel(category: AgentCategory): string {
    return this.translate.translate('agents.category.' + category);
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
    this.toastService.show(
      this.translate.translate('toast.agents.all').replace('{n}', String(this.agents.length)),
      'info',
    );
  }
}
