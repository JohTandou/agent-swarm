import { Component, signal, computed } from '@angular/core';
import { RouterLink } from '@angular/router';
import type { Skill, SkillCategory } from '@shared/models';

/**
 * Définitions statiques des skills du pipeline Swarm.
 * Chaque skill est documenté en Markdown dans src/content/skills/.
 */
const SKILLS: Skill[] = [
  {
    id: 'ui-ux-pro-max',
    name: 'UI/UX Pro Max',
    emoji: '🎨',
    description: 'Intelligence de design UI/UX — 67 styles, 96 palettes, 57 paires typographiques. Supporte 13 stacks techniques.',
    category: 'creation',
    sourcePath: 'skills/ui-ux-pro-max.md',
  },
  {
    id: 'tests-create',
    name: 'Tests Create',
    emoji: '🧪',
    description: 'Génère des tests unitaires, fonctionnels, d\'intégration et E2E optimaux. Analyse le codebase pour identifier toutes les unités testables.',
    category: 'creation',
    sourcePath: 'skills/tests-create.md',
  },
  {
    id: 'graphify',
    name: 'Graphify',
    emoji: '🕸️',
    description: 'Transforme n\'importe quelle entrée (code, docs, papiers, images) en graphe de connaissances interactif avec visualisation D3.js.',
    category: 'workflow',
    sourcePath: 'skills/graphify.md',
  },
];

/** Labels des catégories pour les boutons de filtre */
const CATEGORY_LABELS: Record<SkillCategory, string> = {
  audit: 'Audit',
  creation: 'Création',
  workflow: 'Workflow',
  documentation: 'Documentation',
};

/**
 * Page listing des skills Swarm — grille bento asymétrique.
 *
 * États gérés :
 * - Success : grille de cartes avec hover interactif
 * - Filtered : résultat filtré par catégorie
 * - Empty state : aucun skill ne correspond au filtre
 */
@Component({
  selector: 'app-skills-list',
  standalone: true,
  imports: [RouterLink],
  templateUrl: './skills-list.component.html',
  styleUrls: ['./skills-list.component.scss'],
})
export class SkillsListComponent {
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
  readonly categories: SkillCategory[] = ['audit', 'creation', 'workflow', 'documentation'];

  /** Vrai si un filtre est actif */
  readonly isFiltered = computed(() => this.activeCategory() !== null);

  /**
   * Active ou désactive un filtre de catégorie.
   * Si la catégorie est déjà active → désactive (affiche tout).
   */
  toggleCategory(category: SkillCategory): void {
    if (this.activeCategory() === category) {
      this.activeCategory.set(null);
    } else {
      this.activeCategory.set(category);
    }
  }

  /** Retourne le label français pour une catégorie */
  getCategoryLabel(category: SkillCategory): string {
    return CATEGORY_LABELS[category];
  }

  /** Détermine si une carte doit être "featured" (grand format) dans la grille */
  isFeatured(skill: Skill): boolean {
    return skill.id === 'ui-ux-pro-max';
  }

  /** Détermine si une carte doit être "wide" (large format) dans la grille */
  isWide(skill: Skill): boolean {
    return skill.id === 'graphify';
  }

  /** Retourne le nombre de skills dans une catégorie donnée */
  getCategoryCount(category: SkillCategory): number {
    return this.skills.filter((s) => s.category === category).length;
  }
}
