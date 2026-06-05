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
    id: 'ui-ux-pro-max',
    name: 'UI/UX Pro Max',
    emoji: '🎨',
    description: 'Intelligence de design UI/UX — 67 styles, 96 palettes, 57 paires typographiques. Supporte 13 stacks techniques.',
    category: 'creation',
    sourcePath: 'skills/ui-ux-pro-max.md',
  },
  'tests-create': {
    id: 'tests-create',
    name: 'Tests Create',
    emoji: '🧪',
    description: 'Génère des tests unitaires, fonctionnels, d\'intégration et E2E optimaux.',
    category: 'creation',
    sourcePath: 'skills/tests-create.md',
  },
  'graphify': {
    id: 'graphify',
    name: 'Graphify',
    emoji: '🕸️',
    description: 'Transforme n\'importe quelle entrée en graphe de connaissances interactif.',
    category: 'workflow',
    sourcePath: 'skills/graphify.md',
  },
};

/** Labels des catégories */
const CATEGORY_LABELS: Record<SkillCategory, string> = {
  audit: 'Audit',
  creation: 'Création',
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
    // Lit le paramètre de route :id
    this.route.paramMap.subscribe((params) => {
      const id = params.get('id');
      this.skillId.set(id ?? '');
      // Réinitialise la TOC à chaque navigation
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
