import { Component, signal, computed, inject } from '@angular/core';
import { RouterLink } from '@angular/router';
import { StaggerChildrenDirective } from '@shared/directives/stagger-children.directive';
import { ToastService } from '@shared/services/toast.service';
import { TranslationService } from '@shared/services/translation.service';
import { UiButtonComponent } from '@shared/components/ui-button/ui-button.component';
import { UiBadgeComponent } from '@shared/components/ui-badge/ui-badge.component';
import { TextRevealDirective } from '@shared/directives/text-reveal.directive';
import { UiEmptyStateComponent } from '@shared/components/ui-empty-state/ui-empty-state.component';
import { JsonLdService } from '@shared/services/json-ld.service';
import { LanguageService, type Lang } from '../../shared/services/language.service';
import type { Skill, SkillCategory } from '@shared/models';

/** Skills hardcodés */
const SKILLS: Skill[] = [
  { id: 'ui-ux-pro-max', name: 'UI/UX Pro Max', emoji: '🎨', category: 'creation', sourcePath: 'skills/ui-ux-pro-max.md', order: 1, tags: [], description: 'Intelligence de design UI/UX avec 67 styles, 96 palettes' },
  { id: 'tests-create', name: 'Tests Create', emoji: '🧪', category: 'creation', sourcePath: 'skills/tests-create.md', order: 2, tags: [], description: 'Génération optimale de tests unitaires, fonctionnels, intégration et E2E' },
  { id: 'graphify', name: 'Graphify', emoji: '🕸️', category: 'audit', sourcePath: 'skills/graphify.md', order: 3, tags: [], description: 'Transforme code, docs, papiers en graphes de connaissances' },
];

const SKILL_DESCS_EN: Record<string, string> = {
  'ui-ux-pro-max': 'UI/UX design intelligence with 67 styles, 96 palettes',
  'tests-create': 'Optimal generation of unit, functional, integration and E2E tests',
  'graphify': 'Transforms code, docs, papers into knowledge graphs',
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
  private readonly translate = inject(TranslationService);
  private readonly toastService = inject(ToastService);
  private readonly jsonLdService = inject(JsonLdService);
  private readonly langService = inject(LanguageService);

  private get lang(): Lang { return this.langService.currentLang(); }

  /** Liste complète des skills (hardcodée), localisée selon la langue */
  readonly skills = computed<Skill[]>(() => {
    if (this.langService.currentLang() === 'fr') return SKILLS;
    return SKILLS.map(s => ({ ...s, description: SKILL_DESCS_EN[s.id] ?? s.description }));
  });

  /** Catégorie active pour le filtrage (null = toutes) */
  readonly activeCategory = signal<SkillCategory | null>(null);

  constructor() {
    // Schéma ItemList pour le SEO — liste des skills disponibles
    const itemListItems = SKILLS.map((skill) => ({
      name: skill.name,
      url: `https://swarm-wiki.vercel.app/skills/${skill.id}`,
      description: skill.description,
    }));
    this.jsonLdService.addSchemas([this.jsonLdService.generateItemListSchema(itemListItems)]);
  }

  /** Raccourci pour les traductions dans le template */
  t(key: string): string {
    return this.translate.translate(key);
  }

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
      this.toastService.show(
        this.translate.translate('toast.skills.all').replace('{n}', String(this.skills().length)),
        'info',
      );
    } else {
      this.activeCategory.set(category);
      const count = this.getCategoryCount(category);
      const categoryLabel = this.translate.translate('skills.category.' + category);
      this.toastService.show(
        this.translate.translate('toast.skills.filtered').replace('{n}', String(count)).replace('{category}', categoryLabel),
        'success',
      );
    }
  }

  /** Retourne le label traduit pour une catégorie */
  getCategoryLabel(category: SkillCategory): string {
    return this.translate.translate('skills.category.' + category);
  }

  /** Retourne le nombre de skills dans une catégorie donnée */
  getCategoryCount(category: SkillCategory): number {
    return this.skills().filter((s) => s.category === category).length;
  }

  /** Réinitialise tous les filtres — affiche tous les skills */
  resetFilters(): void {
    this.activeCategory.set(null);
    this.toastService.show(
      this.translate.translate('toast.skills.all').replace('{n}', String(this.skills().length)),
      'info',
    );
  }
}
