import { Component, signal, computed, inject } from '@angular/core';
import { RouterLink } from '@angular/router';
import { StaggerChildrenDirective } from '@shared/directives/stagger-children.directive';
import { ToastService } from '@shared/services/toast.service';
import { UiButtonComponent } from '@shared/components/ui-button/ui-button.component';
import { UiBadgeComponent } from '@shared/components/ui-badge/ui-badge.component';
import { TextRevealDirective } from '@shared/directives/text-reveal.directive';
import { UiEmptyStateComponent } from '@shared/components/ui-empty-state/ui-empty-state.component';
import type { Skill, SkillCategory } from '@shared/models';

/**
 * Définitions statiques des skills Swarm.
 * Chaque skill est documenté en Markdown dans src/content/skills/.
 */
const SKILLS: Skill[] = [
  {
    id: 'ui-ux-pro-max',
    name: 'UI/UX Pro Max',
    emoji: '🎨',
    description: 'Intelligence de design : 67 styles, 96 palettes, 57 pairings typographiques, 13 stacks. Planification, création, revue et amélioration UI/UX.',
    tags: ['design', 'UI', 'UX', 'tailwind'],
    category: 'création',
    sourcePath: 'skills/ui-ux-pro-max.md',
  },
  {
    id: 'tests-create',
    name: 'Tests Create',
    emoji: '🧪',
    description: 'Génération de tests unitaires, fonctionnels, intégration et E2E. Analyse le codebase et suit les conventions existantes.',
    tags: ['tests', 'jasmine', 'playwright', 'couverture'],
    category: 'qualité',
    sourcePath: 'skills/tests-create.md',
  },
  {
    id: 'graphify',
    name: 'Graphify',
    emoji: '🕸️',
    description: 'Transforme code, docs et données en graphes de connaissances avec clustering par communautés. Export HTML + JSON + rapport.',
    tags: ['graphe', 'analyse', 'visualisation', 'clustering'],
    category: 'analyse',
    sourcePath: 'skills/graphify.md',
  },

];

/** Labels des catégories pour les boutons de filtre */
const CATEGORY_LABELS: Record<SkillCategory, string> = {
  création: 'Création',
  qualité: 'Qualité',
  analyse: 'Analyse',
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

  /** Liste complète des skills */
  readonly skills = SKILLS;

  /** Catégorie active pour le filtrage (null = toutes) */
  readonly activeCategory = signal<SkillCategory | null>(null);

  /** Skills filtrés selon la catégorie active */
  readonly filteredSkills = computed<Skill[]>(() => {
    const category = this.activeCategory();
    if (category === null) return this.skills;
    return this.skills.filter((s) => s.category === category);
  });

  /** Catégories disponibles avec leur label */
  readonly categories: SkillCategory[] = ['création', 'qualité', 'analyse'];

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
      this.toastService.show(`${this.skills.length} skills affichés`, 'info');
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
    return this.skills.filter((s) => s.category === category).length;
  }

  /** Réinitialise tous les filtres — affiche tous les skills */
  resetFilters(): void {
    this.activeCategory.set(null);
    this.toastService.show(`${this.skills.length} skills affichés`, 'info');
  }
}
