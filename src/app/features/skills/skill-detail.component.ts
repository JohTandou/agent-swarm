import { Component, signal, computed, inject } from '@angular/core';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { MarkdownRendererComponent } from '../../shared/components/markdown-renderer/markdown-renderer.component';
import { ContentService } from '../../shared/services/content.service';
import { TocService } from '../../shared/services/toc.service';
import type { Skill, SkillCategory } from '@shared/models';
import type { TocEntry } from '@shared/models';

/** Labels des catégories */
const CATEGORY_LABELS: Record<SkillCategory, string> = {
  creation: 'Création',
  audit: 'Audit',
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
  private contentService = inject(ContentService);

  /** ID du skill extrait de l'URL */
  readonly skillId = signal<string>('');

  /** Tous les skills chargés depuis le manifeste */
  readonly allSkills = signal<Skill[]>([]);

  /** Données du skill (undefined si ID invalide) */
  readonly skill = computed<Skill | undefined>(() => {
    const id = this.skillId();
    const skills = this.allSkills();
    if (!id || skills.length === 0) return undefined;
    return skills.find((s) => s.id === id);
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

    this.contentService.loadSkillsManifest().subscribe((skills) => {
      this.allSkills.set(skills);
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
