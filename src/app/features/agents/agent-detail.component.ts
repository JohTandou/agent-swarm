import { Component, signal, computed, inject, effect } from '@angular/core';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { MarkdownRendererComponent } from '../../shared/components/markdown-renderer/markdown-renderer.component';
import { TocService } from '../../shared/services/toc.service';
import type { AgentCategory } from '@shared/models';
import type { TocEntry } from '@shared/models';
import { UiBadgeComponent } from '@shared/components/ui-badge/ui-badge.component';
import { AGENTS_MAP, CATEGORY_LABELS } from '@shared/data/agents.data';

/**
 * Page de détail d'un agent Swarm.
 * Charge le contenu Markdown depuis src/content/agents/:id.md
 * et l'affiche via MarkdownRenderer.
 *
 * États gérés :
 * - Loading : chargement du Markdown (géré par MarkdownRenderer)
 * - Success : header agent + contenu Markdown rendu
 * - Error : agent introuvable (ID invalide)
 */
@Component({
  selector: 'app-agent-detail',
  standalone: true,
  imports: [MarkdownRendererComponent, RouterLink, UiBadgeComponent],
  templateUrl: './agent-detail.component.html',
  styleUrls: ['./agent-detail.component.scss'],
})
export class AgentDetailComponent {
  private route = inject(ActivatedRoute);
  private tocService = inject(TocService);

  /** ID de l'agent extrait de l'URL */
  readonly agentId = signal<string>('');

  /** Données de l'agent (undefined si ID invalide) */
  readonly agent = computed(() => {
    const id = this.agentId();
    return AGENTS_MAP[id];
  });

  /** Erreur si agent non trouvé */
  readonly notFound = computed(() => this.agentId() !== '' && !this.agent());

  /** Source path pour MarkdownRenderer */
  readonly sourcePath = computed(() => {
    const a = this.agent();
    return a?.sourcePath ?? '';
  });

  /** L'agent a-t-il un contenu Markdown ? */
  readonly hasContent = computed(() => this.sourcePath() !== '');

  constructor() {
    // Lit le paramètre de route :id
    this.route.paramMap.subscribe((params) => {
      const id = params.get('id');
      this.agentId.set(id ?? '');
      // Réinitialise la TOC à chaque navigation
      this.tocService.clear();
    });
  }

  /** Transmet les entrées TOC au service partagé */
  onTocEntries(entries: TocEntry[]): void {
    this.tocService.setEntries(entries);
  }

  /** Retourne le label français pour une catégorie */
  getCategoryLabel(category: AgentCategory): string {
    return CATEGORY_LABELS[category];
  }
}
