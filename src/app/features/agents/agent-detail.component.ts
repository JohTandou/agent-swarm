import { Component, signal, computed, inject, effect } from '@angular/core';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { MarkdownRendererComponent } from '../../shared/components/markdown-renderer/markdown-renderer.component';
import { TocService } from '../../shared/services/toc.service';
import { SeoService } from '../../shared/services/seo.service';
import { JsonLdService } from '../../shared/services/json-ld.service';
import type { AgentCategory, TocEntry, MarkdownDocument } from '@shared/models';
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
  private seoService = inject(SeoService);
  private jsonLdService = inject(JsonLdService);

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
      // SEO + données structurées de base (seront enrichies par onDocumentLoaded)
      this.setSeoAndSchemas(id);
    });
  }

  /**
   * Définit les métadonnées SEO et les schémas JSON-LD initiaux.
   * Sera mis à jour par onDocumentLoaded() quand le Markdown frontmatter est disponible.
   * @param id Identifiant de l'agent extrait de l'URL
   */
  private setSeoAndSchemas(id: string | null): void {
    if (!id) return;
    const agent = AGENTS_MAP[id];
    if (!agent) return;

    const canonicalUrl = `https://swarm-wiki.vercel.app/agents/${id}`;
    const avatarUrl = `https://swarm-wiki.vercel.app/assets/images/avatars/${id}.png`;

    this.seoService.updatePageMeta({
      title: agent.name,
      description: agent.description,
      canonicalUrl,
      image: avatarUrl,
      type: 'article',
      author: 'Joh Tandou',
    });

    const techArticle = this.jsonLdService.generateTechArticleSchema({
      headline: `${agent.name} — Agent IA Swarm`,
      description: agent.description,
      authorName: 'Joh Tandou',
      authorUrl: 'https://github.com/JohTandou',
      datePublished: '2025-05-15',
      image: avatarUrl,
      url: canonicalUrl,
    });

    this.jsonLdService.addSchemas([techArticle, this.jsonLdService.generatePersonSchema()]);
  }

  /**
   * Appelé quand le MarkdownRenderer a terminé le chargement du document.
   * Met à jour le SEO avec le frontmatter (titre/description plus précis) et enrichit le JSON-LD.
   * @param doc Document Markdown chargé (contient frontmatter, TOC, contenu)
   */
  onDocumentLoaded(doc: MarkdownDocument): void {
    const id = this.agentId();
    if (!id) return;

    const canonicalUrl = `https://swarm-wiki.vercel.app/agents/${id}`;
    const avatarUrl = `https://swarm-wiki.vercel.app/assets/images/avatars/${id}.png`;
    const title = doc.frontmatter.title || this.agent()?.name || 'Agent';
    const description = doc.frontmatter.description || this.agent()?.description || '';

    this.seoService.updatePageMeta({
      title,
      description,
      canonicalUrl,
      image: avatarUrl,
      type: 'article',
      author: 'Joh Tandou',
    });

    const techArticleUpdated = this.jsonLdService.generateTechArticleSchema({
      headline: title,
      description,
      authorName: 'Joh Tandou',
      authorUrl: 'https://github.com/JohTandou',
      datePublished: '2025-05-15',
      image: avatarUrl,
      url: canonicalUrl,
    });

    this.jsonLdService.addSchemas([techArticleUpdated, this.jsonLdService.generatePersonSchema()]);
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
