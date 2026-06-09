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
  {
    id: 'admin-panel',
    name: 'Panel d\'Administration',
    emoji: '🖥️',
    description: 'Génère un panel d\'administration complet et prêt pour la production : CRUD, analytics, gestion utilisateurs, contrôle d\'accès par rôles',
    tags: ['admin', 'dashboard', 'CRUD'],
    category: 'création',
    sourcePath: 'skills/admin-panel.md',
  },
  {
    id: 'audit-gamification',
    name: 'Audit Gamification',
    emoji: '🎮',
    description: 'Audit complet de gamification : boucles d\'engagement, systèmes de progression, récompenses, rétention, onboarding, équilibrage, intégration monétisation',
    tags: ['audit', 'gamification', 'engagement'],
    category: 'analyse',
    sourcePath: 'skills/audit-gamification.md',
  },
  {
    id: 'audit-global',
    name: 'Audit Global',
    emoji: '🌍',
    description: 'Audit global complet du projet couvrant complétude d\'implémentation, production-readiness, sécurité, performance, qualité de code et marketing/SEO',
    tags: ['audit', 'qualité', 'performance'],
    category: 'analyse',
    sourcePath: 'skills/audit-global.md',
  },
  {
    id: 'audit-implementation',
    name: 'Audit Implémentation',
    emoji: '📊',
    description: 'Audite le niveau d\'implémentation des fonctionnalités décrites dans PROPOSITION_VALEUR.md par rapport au codebase réel',
    tags: ['audit', 'implémentation', 'features'],
    category: 'analyse',
    sourcePath: 'skills/audit-implementation.md',
  },
  {
    id: 'audit-marketing',
    name: 'Audit Marketing',
    emoji: '📈',
    description: 'Audit complet marketing et SEO : analyse de la visibilité web, optimisation du référencement et présence en ligne',
    tags: ['marketing', 'SEO', 'visibilité'],
    category: 'analyse',
    sourcePath: 'skills/audit-marketing.md',
  },
  {
    id: 'audit-production',
    name: 'Audit Production',
    emoji: '🏭',
    description: 'Audit complet de production-readiness : vérification sécurité, fiabilité, performance, observabilité et infrastructure',
    tags: ['production', 'déploiement', 'sécurité'],
    category: 'analyse',
    sourcePath: 'skills/audit-production.md',
  },
  {
    id: 'audit-security',
    name: 'Audit Sécurité',
    emoji: '🔒',
    description: 'Audit de sécurité ciblé : détection des injections SQL, injections de prompt et empoisonnement de contexte',
    tags: ['sécurité', 'injection', 'vulnérabilités'],
    category: 'analyse',
    sourcePath: 'skills/audit-security.md',
  },
  {
    id: 'audit-uxui',
    name: 'Audit UX/UI',
    emoji: '🎨',
    description: 'Audit UX/UI complet : design system, typographie, palette, layout, composants, animations, accessibilité WCAG, responsive, copywriting, navigation',
    tags: ['UX', 'UI', 'design', 'accessibilité'],
    category: 'analyse',
    sourcePath: 'skills/audit-uxui.md',
  },
  {
    id: 'background-images',
    name: 'Images de Fond',
    emoji: '🖼️',
    description: 'Analyse l\'application, identifie les pages qui bénéficieraient d\'images de fond et génère des prompts optimaux pour GPT Image',
    tags: ['images', 'design', 'GPT'],
    category: 'création',
    sourcePath: 'skills/background-images.md',
  },
  {
    id: 'customize-opencode',
    name: 'Personnalisation OpenCode',
    emoji: '⚙️',
    description: 'Édition et création de la configuration OpenCode : opencode.json, agents, subagents, skills, plugins, MCP servers, règles de permission',
    tags: ['opencode', 'config', 'agents'],
    category: 'workflow',
    sourcePath: 'skills/customize-opencode.md',
  },
  {
    id: 'dispatching-parallel-agents',
    name: 'Agents Parallèles',
    emoji: '🔀',
    description: 'Répartition de tâches indépendantes entre agents parallèles sans état partagé ni dépendances séquentielles',
    tags: ['parallèle', 'performance', 'workflow'],
    category: 'workflow',
    sourcePath: 'skills/dispatching-parallel-agents.md',
  },
  {
    id: 'documentation-create',
    name: 'Création Documentation',
    emoji: '📝',
    description: 'Génération de documentation technique complète : architecture, stack, structure, APIs, modèles de données, configuration, déploiement et onboarding développeur',
    tags: ['documentation', 'technique', 'onboarding'],
    category: 'création',
    sourcePath: 'skills/documentation-create.md',
  },
  {
    id: 'documentation-update',
    name: 'Mise à Jour Documentation',
    emoji: '📚',
    description: 'Mise à jour de TECHNICAL_DOCUMENTATION.md, README.md et PROPOSITION_VALEUR.md pour refléter l\'état réel du codebase',
    tags: ['documentation', 'synchronisation', 'mise à jour'],
    category: 'documentation',
    sourcePath: 'skills/documentation-update.md',
  },
  {
    id: 'executing-plans',
    name: 'Exécution de Plans',
    emoji: '📋',
    description: 'Exécute un plan d\'implémentation écrit dans une session séparée avec des points de contrôle de revue',
    tags: ['plan', 'exécution', 'workflow'],
    category: 'workflow',
    sourcePath: 'skills/executing-plans.md',
  },
  {
    id: 'finishing-a-development-branch',
    name: 'Finalisation de Branche',
    emoji: '🌿',
    description: 'Finalisation du travail sur une branche de développement : options structurées pour merge, PR ou nettoyage',
    tags: ['git', 'merge', 'PR', 'branche'],
    category: 'workflow',
    sourcePath: 'skills/finishing-a-development-branch.md',
  },
  {
    id: 'receiving-code-review',
    name: 'Réception Code Review',
    emoji: '👁️',
    description: 'Réception et traitement des retours de code review avec rigueur technique et vérification — pas d\'accord performatif ni d\'implémentation aveugle',
    tags: ['review', 'feedback', 'qualité'],
    category: 'workflow',
    sourcePath: 'skills/receiving-code-review.md',
  },
  {
    id: 'requesting-code-review',
    name: 'Demande Code Review',
    emoji: '📨',
    description: 'Demande de revue de code pour vérifier que le travail répond aux exigences avant merge',
    tags: ['review', 'PR', 'qualité'],
    category: 'workflow',
    sourcePath: 'skills/requesting-code-review.md',
  },
  {
    id: 'subagent-driven-development',
    name: 'Développement par Sous-Agents',
    emoji: '🤖',
    description: 'Exécution de plans d\'implémentation avec des tâches indépendantes dans la session courante via sous-agents',
    tags: ['agents', 'parallèle', 'workflow'],
    category: 'workflow',
    sourcePath: 'skills/subagent-driven-development.md',
  },
  {
    id: 'test-driven-development',
    name: 'TDD',
    emoji: '🔴🟢',
    description: 'Développement piloté par les tests (TDD) : écriture des tests avant le code d\'implémentation pour toute feature ou bugfix',
    tags: ['TDD', 'tests', 'qualité'],
    category: 'workflow',
    sourcePath: 'skills/test-driven-development.md',
  },
  {
    id: 'tests-run',
    name: 'Exécution des Tests',
    emoji: '🏃',
    description: 'Exécute tous les tests de l\'application, détecte l\'infrastructure de test, analyse les échecs et produit un rapport clair avec corrections actionnables',
    tags: ['tests', 'exécution', 'rapport'],
    category: 'qualité',
    sourcePath: 'skills/tests-run.md',
  },
  {
    id: 'using-git-worktrees',
    name: 'Git Worktrees',
    emoji: '🌲',
    description: 'Création de worktrees Git isolés avec sélection intelligente de répertoire et vérification de sécurité',
    tags: ['git', 'worktree', 'isolation'],
    category: 'documentation',
    sourcePath: 'skills/using-git-worktrees.md',
  },
  {
    id: 'writing-plans',
    name: 'Rédaction de Plans',
    emoji: '✍️',
    description: 'Rédaction de plans d\'implémentation à partir de specs ou d\'exigences pour les tâches multi-étapes',
    tags: ['plan', 'spécification', 'architecture'],
    category: 'documentation',
    sourcePath: 'skills/writing-plans.md',
  },
  {
    id: 'writing-skills',
    name: 'Création de Skills',
    emoji: '🛠️',
    description: 'Création de nouveaux skills, édition de skills existants et vérification avant déploiement',
    tags: ['skills', 'création', 'opencode'],
    category: 'documentation',
    sourcePath: 'skills/writing-skills.md',
  },
];

/** Labels des catégories pour les boutons de filtre */
const CATEGORY_LABELS: Record<SkillCategory, string> = {
  création: 'Création',
  qualité: 'Qualité',
  analyse: 'Analyse',
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
  readonly categories: SkillCategory[] = ['création', 'qualité', 'analyse', 'workflow', 'documentation'];

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
