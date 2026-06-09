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

};

/** Labels des catégories */
const CATEGORY_LABELS: Record<SkillCategory, string> = {
  création: 'Création',
  qualité: 'Qualité',
  analyse: 'Analyse',
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
