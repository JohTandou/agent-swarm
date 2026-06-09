import { Component, signal, computed, inject } from '@angular/core';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { MarkdownRendererComponent } from '../../shared/components/markdown-renderer/markdown-renderer.component';
import { TocService } from '../../shared/services/toc.service';
import type { Skill, SkillCategory } from '@shared/models';
import type { TocEntry } from '@shared/models';

/**
 * Données statiques des skills pour l'affichage du header.
 * Synchronisé avec la liste dans skills-list.component.ts.
 */
const SKILLS_MAP: Record<string, Skill> = {
  'ui-ux-pro-max': {
    id: 'ui-ux-pro-max', name: 'UI/UX Pro Max', emoji: '🎨',
    description: 'Intelligence de design : 67 styles, 96 palettes.',
    tags: ['design', 'UI', 'UX', 'tailwind'],
    category: 'création',
    sourcePath: 'skills/ui-ux-pro-max.md',
  },
  'tests-create': {
    id: 'tests-create', name: 'Tests Create', emoji: '🧪',
    description: 'Génération de tests unitaires, fonctionnels, E2E.',
    tags: ['tests', 'jasmine', 'playwright'],
    category: 'qualité',
    sourcePath: 'skills/tests-create.md',
  },
  graphify: {
    id: 'graphify', name: 'Graphify', emoji: '🕸️',
    description: 'Transforme code et docs en graphes de connaissances.',
    tags: ['graphe', 'analyse', 'visualisation'],
    category: 'analyse',
    sourcePath: 'skills/graphify.md',
  },
  'admin-panel': {
    id: 'admin-panel', name: 'Panel d\'Administration', emoji: '🖥️',
    description: 'Génère un panel d\'administration complet.',
    tags: ['admin', 'dashboard', 'CRUD'],
    category: 'création',
    sourcePath: 'skills/admin-panel.md',
  },
  'audit-gamification': {
    id: 'audit-gamification', name: 'Audit Gamification', emoji: '🎮',
    description: 'Audit complet de gamification.',
    tags: ['audit', 'gamification', 'engagement'],
    category: 'analyse',
    sourcePath: 'skills/audit-gamification.md',
  },
  'audit-global': {
    id: 'audit-global', name: 'Audit Global', emoji: '🌍',
    description: 'Audit global complet du projet.',
    tags: ['audit', 'qualité', 'performance'],
    category: 'analyse',
    sourcePath: 'skills/audit-global.md',
  },
  'audit-implementation': {
    id: 'audit-implementation', name: 'Audit Implémentation', emoji: '📊',
    description: 'Audite le niveau d\'implémentation.',
    tags: ['audit', 'implémentation', 'features'],
    category: 'analyse',
    sourcePath: 'skills/audit-implementation.md',
  },
  'audit-marketing': {
    id: 'audit-marketing', name: 'Audit Marketing', emoji: '📈',
    description: 'Audit complet marketing et SEO.',
    tags: ['marketing', 'SEO', 'visibilité'],
    category: 'analyse',
    sourcePath: 'skills/audit-marketing.md',
  },
  'audit-production': {
    id: 'audit-production', name: 'Audit Production', emoji: '🏭',
    description: 'Audit complet de production-readiness.',
    tags: ['production', 'déploiement', 'sécurité'],
    category: 'analyse',
    sourcePath: 'skills/audit-production.md',
  },
  'audit-security': {
    id: 'audit-security', name: 'Audit Sécurité', emoji: '🔒',
    description: 'Audit de sécurité ciblé.',
    tags: ['sécurité', 'injection', 'vulnérabilités'],
    category: 'analyse',
    sourcePath: 'skills/audit-security.md',
  },
  'audit-uxui': {
    id: 'audit-uxui', name: 'Audit UX/UI', emoji: '🎨',
    description: 'Audit UX/UI complet.',
    tags: ['UX', 'UI', 'design', 'accessibilité'],
    category: 'analyse',
    sourcePath: 'skills/audit-uxui.md',
  },
  'background-images': {
    id: 'background-images', name: 'Images de Fond', emoji: '🖼️',
    description: 'Génération de prompts pour images de fond.',
    tags: ['images', 'design', 'GPT'],
    category: 'création',
    sourcePath: 'skills/background-images.md',
  },
  'customize-opencode': {
    id: 'customize-opencode', name: 'Personnalisation OpenCode', emoji: '⚙️',
    description: 'Édition de la configuration OpenCode.',
    tags: ['opencode', 'config', 'agents'],
    category: 'workflow',
    sourcePath: 'skills/customize-opencode.md',
  },
  'dispatching-parallel-agents': {
    id: 'dispatching-parallel-agents', name: 'Agents Parallèles', emoji: '🔀',
    description: 'Répartition d\'agents parallèles.',
    tags: ['parallèle', 'performance', 'workflow'],
    category: 'workflow',
    sourcePath: 'skills/dispatching-parallel-agents.md',
  },
  'documentation-create': {
    id: 'documentation-create', name: 'Création Documentation', emoji: '📝',
    description: 'Génération de documentation technique.',
    tags: ['documentation', 'technique', 'onboarding'],
    category: 'création',
    sourcePath: 'skills/documentation-create.md',
  },
  'documentation-update': {
    id: 'documentation-update', name: 'Mise à Jour Documentation', emoji: '📚',
    description: 'Mise à jour de la documentation.',
    tags: ['documentation', 'synchronisation', 'mise à jour'],
    category: 'documentation',
    sourcePath: 'skills/documentation-update.md',
  },
  'executing-plans': {
    id: 'executing-plans', name: 'Exécution de Plans', emoji: '📋',
    description: 'Exécute un plan d\'implémentation.',
    tags: ['plan', 'exécution', 'workflow'],
    category: 'workflow',
    sourcePath: 'skills/executing-plans.md',
  },
  'finishing-a-development-branch': {
    id: 'finishing-a-development-branch', name: 'Finalisation de Branche', emoji: '🌿',
    description: 'Finalisation de branche de développement.',
    tags: ['git', 'merge', 'PR', 'branche'],
    category: 'workflow',
    sourcePath: 'skills/finishing-a-development-branch.md',
  },
  'receiving-code-review': {
    id: 'receiving-code-review', name: 'Réception Code Review', emoji: '👁️',
    description: 'Réception de code review.',
    tags: ['review', 'feedback', 'qualité'],
    category: 'workflow',
    sourcePath: 'skills/receiving-code-review.md',
  },
  'requesting-code-review': {
    id: 'requesting-code-review', name: 'Demande Code Review', emoji: '📨',
    description: 'Demande de code review.',
    tags: ['review', 'PR', 'qualité'],
    category: 'workflow',
    sourcePath: 'skills/requesting-code-review.md',
  },
  'subagent-driven-development': {
    id: 'subagent-driven-development', name: 'Développement par Sous-Agents', emoji: '🤖',
    description: 'Développement piloté par sous-agents.',
    tags: ['agents', 'parallèle', 'workflow'],
    category: 'workflow',
    sourcePath: 'skills/subagent-driven-development.md',
  },
  'test-driven-development': {
    id: 'test-driven-development', name: 'TDD', emoji: '🔴🟢',
    description: 'Développement piloté par les tests.',
    tags: ['TDD', 'tests', 'qualité'],
    category: 'workflow',
    sourcePath: 'skills/test-driven-development.md',
  },
  'tests-run': {
    id: 'tests-run', name: 'Exécution des Tests', emoji: '🏃',
    description: 'Exécute tous les tests de l\'application.',
    tags: ['tests', 'exécution', 'rapport'],
    category: 'qualité',
    sourcePath: 'skills/tests-run.md',
  },
  'using-git-worktrees': {
    id: 'using-git-worktrees', name: 'Git Worktrees', emoji: '🌲',
    description: 'Utilisation des Git worktrees.',
    tags: ['git', 'worktree', 'isolation'],
    category: 'documentation',
    sourcePath: 'skills/using-git-worktrees.md',
  },
  'writing-plans': {
    id: 'writing-plans', name: 'Rédaction de Plans', emoji: '✍️',
    description: 'Rédaction de plans d\'implémentation.',
    tags: ['plan', 'spécification', 'architecture'],
    category: 'documentation',
    sourcePath: 'skills/writing-plans.md',
  },
  'writing-skills': {
    id: 'writing-skills', name: 'Création de Skills', emoji: '🛠️',
    description: 'Création et édition de skills.',
    tags: ['skills', 'création', 'opencode'],
    category: 'documentation',
    sourcePath: 'skills/writing-skills.md',
  },
};

/** Labels des catégories */
const CATEGORY_LABELS: Record<SkillCategory, string> = {
  création: 'Création',
  qualité: 'Qualité',
  analyse: 'Analyse',
  workflow: 'Workflow',
  documentation: 'Documentation',
};

/**
 * Page de détail d'un skill Swarm.
 * Charge le contenu Markdown depuis src/content/skills/:id.md
 * et l'affiche via MarkdownRenderer.
 *
 * États gérés :
 * - Loading : chargement du Markdown (géré par MarkdownRenderer)
 * - Success : header skill + contenu Markdown rendu
 * - Error : skill introuvable (ID invalide)
 */
@Component({
  selector: 'app-skill-detail',
  standalone: true,
  imports: [MarkdownRendererComponent, RouterLink],
  templateUrl: './skill-detail.component.html',
  styleUrls: ['./skill-detail.component.scss'],
})
export class SkillDetailComponent {
  private route = inject(ActivatedRoute);
  private tocService = inject(TocService);

  /** ID du skill extrait de l'URL */
  readonly skillId = signal<string>('');

  /** Données du skill (undefined si ID invalide) */
  readonly skill = computed<Skill | undefined>(() => {
    const id = this.skillId();
    return SKILLS_MAP[id];
  });

  /** Erreur si skill non trouvé */
  readonly notFound = computed(() => this.skillId() !== '' && !this.skill());

  /** Source path pour MarkdownRenderer */
  readonly sourcePath = computed(() => {
    const s = this.skill();
    return s?.sourcePath ?? '';
  });

  /** Le skill a-t-il un contenu Markdown ? */
  readonly hasContent = computed(() => this.sourcePath() !== '');

  constructor() {
    this.route.paramMap.subscribe((params) => {
      const id = params.get('id');
      this.skillId.set(id ?? '');
      this.tocService.clear();
    });
  }

  /** Transmet les entrées TOC au service partagé */
  onTocEntries(entries: TocEntry[]): void {
    this.tocService.setEntries(entries);
  }

  /** Retourne le label français pour une catégorie */
  getCategoryLabel(category: SkillCategory): string {
    return CATEGORY_LABELS[category];
  }
}
