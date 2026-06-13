import { Component, signal, computed, inject } from '@angular/core';
import { RouterLink } from '@angular/router';
import { StaggerChildrenDirective } from '@shared/directives/stagger-children.directive';
import { ToastService } from '@shared/services/toast.service';
import { UiButtonComponent } from '@shared/components/ui-button/ui-button.component';
import { UiBadgeComponent } from '@shared/components/ui-badge/ui-badge.component';
import { TextRevealDirective } from '@shared/directives/text-reveal.directive';
import { UiEmptyStateComponent } from '@shared/components/ui-empty-state/ui-empty-state.component';
import type { Skill, SkillCategory } from '@shared/models';

/** Skills hardcodés */
const SKILLS: Skill[] = [
  { id: 'ui-ux-pro-max', name: 'UI/UX Pro Max', emoji: '🎨', category: 'creation', sourcePath: 'skills/ui-ux-pro-max.md', order: 1, tags: [], description: 'Intelligence de design UI/UX avec 67 styles, 96 palettes' },
  { id: 'tests-create', name: 'Tests Create', emoji: '🧪', category: 'creation', sourcePath: 'skills/tests-create.md', order: 2, tags: [], description: 'Génération optimale de tests unitaires, fonctionnels, intégration et E2E' },
  { id: 'graphify', name: 'Graphify', emoji: '🕸️', category: 'audit', sourcePath: 'skills/graphify.md', order: 3, tags: [], description: 'Transforme code, docs, papiers en graphes de connaissances' },
];

/** Labels des catégories pour les boutons de filtre */
const CATEGORY_LABELS: Record<SkillCategory, string> = {
  creation: 'Création',
  audit: 'Audit',
  workflow: 'Workflow',
  documentation: 'Documentation',
};

/**
 * Page listing des skills Swarm — grille bento asymétrique.
 *
 * États gérés :
 * - Success : grille de cartes avec animations
 * - Filtered : résultat filtré par catégorie
 * - Empty state : aucun skill ne correspond au filtre
 */
@Component({
  selector: 'app-skills-list',
  standalone: true,
  imports: [RouterLink, UiButtonComponent, UiBadgeComponent, StaggerChildrenDirective, TextRevealDirective, UiEmptyStateComponent],
  templateUrl: './skills-list.component.html',
  styleUrls: ['./skills-list.component.scss'],
})
export class SkillsListComponent {
  private readonly toastService = inject(ToastService);

  /** Liste complète des skills (hardcodée) */
  readonly skills = signal<Skill[]>(SKILLS);

  /** Catégorie active pour le filtrage (null = toutes) */
  readonly activeCategory = signal<SkillCategory | null>(null);

  /** État de chargement (désactivé — skills hardcodés) */
  readonly isLoading = signal(false);

  /** Skills filtrés selon la catégorie active */
  readonly filteredSkills = computed<Skill[]>(() => {
    const category = this.activeCategory();
    if (category === null) return this.skills();
    return this.skills().filter((s) => s.category === category);
  });

  /** Catégories disponibles avec leur label */
  readonly categories: SkillCategory[] = ['creation', 'audit'];

  /** Vrai si un filtre est actif */
  readonly isFiltered = computed(() => this.activeCategory() !== null);

  /**
   * Active ou désactive un filtre de catégorie.
   * Si la catégorie est déjà active → désactive (affiche tout).
   * Affiche un toast avec le nombre de skills trouvés.
   */
  toggleCategory(category: SkillCategory): void {
    if (this.activeCategory() === category) {
      this.activeCategory.set(null);
      this.toastService.show(`${this.skills().length} skills affichés`, 'info');
    } else {
      this.activeCategory.set(category);
      const count = this.getCategoryCount(category);
      this.toastService.show(`${count} skills trouvés — ${CATEGORY_LABELS[category]}`, 'success');
    }
  }

  /** Retourne le label français pour une catégorie */
  getCategoryLabel(category: SkillCategory): string {
    return CATEGORY_LABELS[category];
  }

  /** Retourne le nombre de skills dans une catégorie donnée */
  getCategoryCount(category: SkillCategory): number {
    return this.skills().filter((s) => s.category === category).length;
  }

  /** Réinitialise tous les filtres — affiche tous les skills */
  resetFilters(): void {
    this.activeCategory.set(null);
    this.toastService.show(`${this.skills().length} skills affichés`, 'info');
  }
}
