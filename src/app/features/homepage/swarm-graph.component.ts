import {
  Component,
  ElementRef,
  ViewChild,
  signal,
  OnDestroy,
  OnInit,
} from '@angular/core';

/** Données d'un agent dans le graphe */
interface AgentNode {
  id: string;
  label: string;
  role: string;
  color: string;
  radius: number;
}

/** Lien entre deux agents */
interface AgentLink {
  source: string;
  target: string;
}

/** Position d'un nœud pour le rendu */
interface NodePosition {
  id: string;
  x: number;
  y: number;
}

/** Position d'un lien pour le rendu */
interface LinkPosition {
  id: string;
  sourceId: string;
  targetId: string;
}

/** Données du tooltip */
interface TooltipData {
  label: string;
  role: string;
  x: number;
  y: number;
}

/**
 * Graphe interactif du Swarm — 9 agents interconnectés.
 * Utilise D3.js pour la simulation de forces (layout), Angular pour le rendu SVG.
 * Lazy-load D3 pour ne pas bloquer le chargement initial.
 *
 * États gérés : loading (squelette shimmer), error (message + icône), success (graphe interactif).
 */
@Component({
  selector: 'app-swarm-graph',
  standalone: true,
  template: `
    <div class="swarm-graph" #graphContainer>
      <!-- État de chargement -->
      @if (loading()) {
        <div class="swarm-graph__skeleton" aria-label="Chargement du graphe d'agents">
          <div class="swarm-graph__skeleton-pulse"></div>
          <span class="swarm-graph__skeleton-text">Chargement du graphe d'agents…</span>
        </div>
      }
      <!-- État d'erreur -->
      @else if (error()) {
        <div class="swarm-graph__error" role="alert">
          <span class="swarm-graph__error-icon">⚠️</span>
          <p class="swarm-graph__error-message">{{ error() }}</p>
        </div>
      }
      <!-- Graphe rendu -->
      @else {
        <svg
          #graphSvg
          class="swarm-graph__svg"
          viewBox="-400 -300 800 600"
          preserveAspectRatio="xMidYMid meet"
          aria-label="Graphe interactif des 9 agents du Swarm"
          role="img"
        >
          <!-- Liens entre agents -->
          <g class="swarm-graph__links">
            @for (link of linkPositions(); track link.id; let i = $index) {
              <line
                class="swarm-graph__link"
                [attr.x1]="linkPositionsMap()[link.sourceId].x"
                [attr.y1]="linkPositionsMap()[link.sourceId].y"
                [attr.x2]="linkPositionsMap()[link.targetId].x"
                [attr.y2]="linkPositionsMap()[link.targetId].y"
                [style.animation-delay.ms]="600 + i * 60"
              />
            }
          </g>
          <!-- Nœuds agents -->
          <g class="swarm-graph__nodes">
            @for (nodePos of nodePositions(); track nodePos.id; let idx = $index) {
              <g
                class="swarm-graph__node-group"
                [class.swarm-graph__node-group--pulse]="nodePos.id === 'orchestrateur'"
                (mouseenter)="onNodeHover($event, nodePos.id)"
                (mouseleave)="onNodeLeave()"
                [style.animation-delay.ms]="200 + idx * 50"
              >
                <!-- Glow externe -->
                <circle
                  class="swarm-graph__node-glow"
                  [attr.cx]="nodePos.x"
                  [attr.cy]="nodePos.y"
                  [attr.r]="getNodeRadius(nodePos.id) + 8"
                  fill="none"
                  [attr.stroke]="getNodeColor(nodePos.id)"
                />
                <!-- Cercle principal -->
                <circle
                  class="swarm-graph__node"
                  [attr.cx]="nodePos.x"
                  [attr.cy]="nodePos.y"
                  [attr.r]="getNodeRadius(nodePos.id)"
                  [attr.fill]="getNodeColor(nodePos.id)"
                />
                <!-- Label sous le nœud -->
                <text
                  class="swarm-graph__label"
                  [attr.x]="nodePos.x"
                  [attr.y]="nodePos.y + getNodeRadius(nodePos.id) + 20"
                  text-anchor="middle"
                >
                  {{ getNodeLabel(nodePos.id) }}
                </text>
              </g>
            }
          </g>
        </svg>
        <!-- Tooltip au survol -->
        @if (tooltip(); as tip) {
          <div
            class="swarm-graph__tooltip"
            [style.left.px]="tip.x"
            [style.top.px]="tip.y"
            role="tooltip"
          >
            <span class="swarm-graph__tooltip-name">{{ tip.label }}</span>
            <span class="swarm-graph__tooltip-role">{{ tip.role }}</span>
          </div>
        }
      }
    </div>
  `,
  styles: [
    `
      .swarm-graph {
        position: relative;
        width: 100%;
        height: clamp(380px, 55vh, 650px);
        display: flex;
        align-items: center;
        justify-content: center;
        overflow: visible;
      }

      /* --- Skeleton loading --- */
      .swarm-graph__skeleton {
        display: flex;
        flex-direction: column;
        align-items: center;
        gap: 16px;
      }
      .swarm-graph__skeleton-pulse {
        width: 180px;
        height: 180px;
        border-radius: 50%;
        background: linear-gradient(
          135deg,
          var(--color-bg-elevated, #4A4540) 0%,
          rgba(240, 165, 34, 0.1) 40%,
          var(--color-bg-elevated, #4A4540) 100%
        );
        background-size: 200% 200%;
        animation: graph-shimmer 2.2s ease-in-out infinite;
      }
      @keyframes graph-shimmer {
        0%, 100% { background-position: 0% 50%; opacity: 0.4; }
        50% { background-position: 100% 50%; opacity: 0.75; }
      }
      .swarm-graph__skeleton-text {
        font-family: var(--font-body, 'Satoshi', sans-serif);
        font-size: 0.875rem;
        color: var(--color-text-secondary, #8E8882);
      }

      /* --- Error state --- */
      .swarm-graph__error {
        display: flex;
        flex-direction: column;
        align-items: center;
        gap: 12px;
        padding: 48px 24px;
        text-align: center;
      }
      .swarm-graph__error-icon {
        font-size: 2rem;
      }
      .swarm-graph__error-message {
        font-family: var(--font-body, 'Satoshi', sans-serif);
        font-size: 0.9375rem;
        color: var(--color-text-secondary, #8E8882);
        margin: 0;
        max-width: 320px;
      }

      /* --- SVG --- */
      .swarm-graph__svg {
        width: 100%;
        height: 100%;
        overflow: visible;
        cursor: grab;
      }
      .swarm-graph__svg:active {
        cursor: grabbing;
      }

      /* --- Links --- */
      .swarm-graph__link {
        stroke: rgba(142, 136, 130, 0.18);
        stroke-width: 1.5;
        opacity: 0;
        animation: link-appear 1s var(--ease-natural, cubic-bezier(0.25, 0.46, 0.45, 0.94)) forwards;
      }
      @keyframes link-appear {
        from { opacity: 0; }
        to { opacity: 1; }
      }

      /* --- Nodes --- */
      .swarm-graph__node-group {
        opacity: 0;
        animation: node-appear 0.55s var(--ease-spring, cubic-bezier(0.22, 1, 0.36, 1)) forwards;
        cursor: pointer;
      }
      @keyframes node-appear {
        from { opacity: 0; }
        to { opacity: 1; }
      }
      .swarm-graph__node {
        transition: filter 200ms ease-out;
      }
      .swarm-graph__node-group:hover .swarm-graph__node {
        filter: brightness(1.35) drop-shadow(0 0 8px rgba(240, 165, 34, 0.35));
      }

      /* Glow ring */
      .swarm-graph__node-glow {
        opacity: 0;
        transition: opacity 300ms ease-out;
        stroke-width: 1.5;
      }
      .swarm-graph__node-group:hover .swarm-graph__node-glow {
        opacity: 0.45;
      }

      /* Pulse on orchestrator */
      .swarm-graph__node-group--pulse .swarm-graph__node-glow {
        animation: pulse-amber 3.5s ease-in-out infinite;
      }
      @keyframes pulse-amber {
        0%, 100% { opacity: 0.08; }
        50% { opacity: 0.3; }
      }

      /* --- Labels --- */
      .swarm-graph__label {
        font-family: var(--font-display, 'Cabinet Grotesk', sans-serif);
        font-size: 10px;
        font-weight: 700;
        fill: var(--color-text-secondary, #8E8882);
        letter-spacing: 0.03em;
        transition: fill 200ms ease-out;
        pointer-events: none;
        text-transform: uppercase;
      }
      .swarm-graph__node-group:hover .swarm-graph__label {
        fill: var(--color-text-primary, #F5F0EB);
      }

      /* --- Tooltip --- */
      .swarm-graph__tooltip {
        position: absolute;
        pointer-events: none;
        background: var(--color-bg-elevated, #4A4540);
        border: 1px solid rgba(142, 136, 130, 0.3);
        border-radius: 8px;
        padding: 8px 14px;
        z-index: 50;
        box-shadow: 0 0 20px rgba(240, 165, 34, 0.06);
        backdrop-filter: blur(12px);
        -webkit-backdrop-filter: blur(12px);
        display: flex;
        flex-direction: column;
        gap: 2px;
        transform: translate(-50%, calc(-100% - 12px));
        white-space: nowrap;
      }
      .swarm-graph__tooltip-name {
        font-family: var(--font-display, 'Cabinet Grotesk', sans-serif);
        font-weight: 700;
        font-size: 0.8125rem;
        color: var(--color-text-primary, #F5F0EB);
      }
      .swarm-graph__tooltip-role {
        font-family: var(--font-body, 'Satoshi', sans-serif);
        font-size: 0.6875rem;
        color: var(--color-text-secondary, #8E8882);
      }
    `,
  ],
})
export class SwarmGraphComponent implements OnInit, OnDestroy {
  @ViewChild('graphContainer', { static: true })
  containerRef!: ElementRef<HTMLDivElement>;

  /** État : chargement D3 en cours */
  readonly loading = signal(true);
  /** État : erreur de chargement */
  readonly error = signal<string | null>(null);
  /** Positions finales des nœuds (après simulation stabilisée) */
  readonly nodePositions = signal<NodePosition[]>([]);
  /** Map de lookup rapide des positions par id */
  readonly linkPositionsMap = signal<Record<string, NodePosition>>({});
  /** Liens du graphe */
  readonly linkPositions = signal<LinkPosition[]>([]);
  /** Données du tooltip au survol */
  readonly tooltip = signal<TooltipData | null>(null);

  /** Les 9 agents du Swarm avec leurs métadonnées */
  private readonly agents: AgentNode[] = [
    { id: 'orchestrateur', label: 'Orchestrateur', role: 'Coordination centrale du pipeline', color: '#F0A522', radius: 20 },
    { id: 'search', label: 'Search', role: 'Cartographie et analyse du codebase', color: '#B8A878', radius: 14 },
    { id: 'planner', label: 'Planner', role: 'Planification des tâches en étapes', color: '#C8A862', radius: 14 },
    { id: 'contract', label: 'Contract', role: 'Définition des contrats TypeScript', color: '#A89868', radius: 14 },
    { id: 'front', label: 'Front', role: 'Implémentation des composants UI', color: '#9A9590', radius: 14 },
    { id: 'back', label: 'Back', role: 'Backend, scripts et configurations', color: '#8A8580', radius: 14 },
    { id: 'tester', label: 'Tester', role: 'Génération et exécution des tests', color: '#A8907A', radius: 14 },
    { id: 'reviewer', label: 'Reviewer', role: 'Revue de code et validation qualité', color: '#B09078', radius: 14 },
    { id: 'writer', label: 'Writer', role: 'Documentation technique et suivi', color: '#9A9088', radius: 14 },
  ];

  /** Connexions entre agents (orchestrateur ↔ tous + liens transverses) */
  private readonly agentLinks: AgentLink[] = [
    { source: 'orchestrateur', target: 'search' },
    { source: 'orchestrateur', target: 'planner' },
    { source: 'orchestrateur', target: 'contract' },
    { source: 'orchestrateur', target: 'front' },
    { source: 'orchestrateur', target: 'back' },
    { source: 'orchestrateur', target: 'tester' },
    { source: 'orchestrateur', target: 'reviewer' },
    { source: 'orchestrateur', target: 'writer' },
    { source: 'search', target: 'planner' },
    { source: 'planner', target: 'contract' },
    { source: 'front', target: 'back' },
    { source: 'front', target: 'tester' },
    { source: 'tester', target: 'reviewer' },
  ];

  ngOnInit(): void {
    this.initGraph();
  }

  ngOnDestroy(): void {
    /* Nettoyage implicite — la simulation est stoppée après stabilisation */
  }

  /** Charge D3 dynamiquement et lance la simulation de forces */
  private async initGraph(): Promise<void> {
    try {
      const d3 = await import('d3');

      /* Préparer les nœuds avec positions initiales aléatoires */
      const simNodes: NodePosition[] = this.agents.map((a) => ({
        id: a.id,
        x: (Math.random() - 0.5) * 120,
        y: (Math.random() - 0.5) * 120,
      }));

      /* Préparer les liens pour la simulation */
      const simLinks = this.agentLinks.map((l, i) => ({
        id: `link-${i}`,
        sourceId: l.source,
        targetId: l.target,
        /* Cast pour compatibilité avec l'API forceLink */
        source: l.source,
        target: l.target,
      }));

      /* Configurer la simulation de forces D3 */
      const simulation = d3
        .forceSimulation<NodePosition>(simNodes)
        .force(
          'link',
          d3
            .forceLink<NodePosition, { source: string; target: string }>(
              simLinks.map((l) => ({ source: l.source, target: l.target }))
            )
            .id((d) => d.id)
            .distance(130)
        )
        .force('charge', d3.forceManyBody().strength(-350))
        .force('center', d3.forceCenter(0, 0))
        .force('collide', d3.forceCollide(38))
        .stop();

      /* Exécuter la simulation manuellement jusqu'à stabilisation */
      const totalTicks = 300;
      for (let i = 0; i < totalTicks; i++) {
        simulation.tick();
      }

      /* Arrondir les positions pour un rendu plus net */
      simNodes.forEach((n) => {
        n.x = Math.round(n.x);
        n.y = Math.round(n.y);
      });

      /* Construire le lookup map pour les liens */
      const posMap: Record<string, NodePosition> = {};
      simNodes.forEach((n) => {
        posMap[n.id] = n;
      });

      /* Mettre à jour les signaux → déclenche le rendu */
      this.nodePositions.set(simNodes);
      this.linkPositions.set(
        this.agentLinks.map((l, i) => ({
          id: `link-${i}`,
          sourceId: l.source,
          targetId: l.target,
        }))
      );
      this.linkPositionsMap.set(posMap);
      this.loading.set(false);
    } catch (err) {
      this.error.set(
        'Impossible de charger le graphe interactif. Veuillez réessayer.'
      );
      this.loading.set(false);
    }
  }

  /* ── Helpers de rendu ── */

  getNodeRadius(id: string): number {
    return this.agents.find((a) => a.id === id)?.radius ?? 14;
  }

  getNodeColor(id: string): string {
    return this.agents.find((a) => a.id === id)?.color ?? '#8E8882';
  }

  getNodeLabel(id: string): string {
    return this.agents.find((a) => a.id === id)?.label ?? id;
  }

  /* ── Interactions ── */

  onNodeHover(event: MouseEvent, nodeId: string): void {
    const agent = this.agents.find((a) => a.id === nodeId);
    if (!agent) return;
    const rect = this.containerRef.nativeElement.getBoundingClientRect();
    this.tooltip.set({
      label: agent.label,
      role: agent.role,
      x: event.clientX - rect.left,
      y: event.clientY - rect.top,
    });
  }

  onNodeLeave(): void {
    this.tooltip.set(null);
  }
}
