import { Component, signal, computed, inject, effect } from '@angular/core';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { MarkdownRendererComponent } from '../../shared/components/markdown-renderer/markdown-renderer.component';
import { TocService } from '../../shared/services/toc.service';
import type { Agent, AgentCategory } from '@shared/models';
import type { TocEntry } from '@shared/models';

/**
 * Données statiques des agents pour l'affichage du header.
 * Synchronisé avec la liste dans agents-list.component.ts.
 */
const AGENTS_MAP: Record<string, Agent> = {
  orchestrateur: {
    id: 'orchestrateur', name: 'Orchestrateur', emoji: '🎯',
    role: "Chef d'orchestre du pipeline — classifie, route et supervise",
    description: "Point d'entrée unique du système Swarm.",
    route: 'FULL', active: true, category: 'build',
    sourcePath: 'agents/orchestrateur.md',
  },
  front: {
    id: 'front', name: 'Front', emoji: '🎨',
    role: 'Implémente le frontend et génère des composants UI Apple-grade',
    description: "Responsable de tous les composants visibles.",
    route: 'FULL', active: true, category: 'build',
    sourcePath: 'agents/front.md',
  },
  back: {
    id: 'back', name: 'Back', emoji: '⚙️',
    role: 'Implémente le backend, génère scripts, crons et configurations',
    description: "Respecte strictement la spécification OpenAPI.",
    route: 'FULL', active: false, category: 'build',
    sourcePath: 'agents/back.md',
  },
  planner: {
    id: 'planner', name: 'Planner', emoji: '🧭',
    role: 'Planifie le travail en tâches atomiques',
    description: "Détecte les choix architecturaux.",
    route: 'MEDIUM', active: true, category: 'build',
    sourcePath: 'agents/planner.md',
  },
  contract: {
    id: 'contract', name: 'Contract', emoji: '📋',
    role: 'Écrit les types TypeScript, la spec OpenAPI et les migrations',
    description: "Source de vérité absolue pour front et back.",
    route: 'FULL', active: true, category: 'qualité',
    sourcePath: 'agents/contract.md',
  },
  tester: {
    id: 'tester', name: 'Tester', emoji: '🧪',
    role: 'Génère les tests manquants et mesure la couverture',
    description: "Garant de la qualité logicielle. Seuil 80%.",
    route: 'FULL', active: true, category: 'qualité',
    sourcePath: 'agents/tester.md',
  },
  reviewer: {
    id: 'reviewer', name: 'Reviewer', emoji: '🔍',
    role: 'Gate de sécurité, qualité et audit des tests',
    description: "Intervient après tester PASS.",
    route: 'MEDIUM', active: true, category: 'qualité',
    sourcePath: 'agents/reviewer.md',
  },
  writer: {
    id: 'writer', name: 'Writer', emoji: '✍️',
    role: 'Met à jour la documentation technique',
    description: "Maintient CHANGELOG, ARCHITECTURE.md et README.",
    route: 'MEDIUM', active: true, category: 'qualité',
    sourcePath: 'agents/writer.md',
  },
  search: {
    id: 'search', name: 'Search', emoji: '🔎',
    role: 'Analyse le codebase et cartographie les dépendances',
    description: "LECTURE SEULE absolue.",
    route: 'ADAPT', active: true, category: 'infrastructure',
    sourcePath: 'agents/search.md',
  },
  explore: {
    id: 'explore', name: 'Explore', emoji: '🗺️',
    role: 'Exploration rapide du codebase',
    description: "Recherche par motif et mots-clés.",
    route: 'SIMPLE', active: true, category: 'infrastructure',
    sourcePath: 'agents/explore.md',
  },
  general: {
    id: 'general', name: 'General', emoji: '🤖',
    role: 'Agent polyvalent pour tâches multi-étapes',
    description: "Exécute des unités de travail indépendantes.",
    route: 'ADAPT', active: true, category: 'infrastructure',
    sourcePath: 'agents/general.md',
  },
};

/** Labels des catégories */
const CATEGORY_LABELS: Record<AgentCategory, string> = {
  build: 'Build',
  qualité: 'Qualité',
  infrastructure: 'Infrastructure',
};

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
  imports: [MarkdownRendererComponent, RouterLink],
  templateUrl: './agent-detail.component.html',
  styleUrls: ['./agent-detail.component.scss'],
})
export class AgentDetailComponent {
  private route = inject(ActivatedRoute);
  private tocService = inject(TocService);

  /** ID de l'agent extrait de l'URL */
  readonly agentId = signal<string>('');

  /** Données de l'agent (undefined si ID invalide) */
  readonly agent = computed<Agent | undefined>(() => {
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
