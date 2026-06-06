import {
  Component,
  ElementRef,
  signal,
  OnDestroy,
  OnInit,
  ViewChild,
} from '@angular/core';

/**
 * Grille hexagonale animée — signature visuelle du Swarm.
 *
 * Métaphore de la ruche : chaque hexagone représente un agent,
 * les lignes les connectent. Pulsation lente, illumination
 * au scroll, désactivé sur mobile pour la performance.
 *
 * Implémentation Canvas 2D pour éviter la surcharge DOM.
 * Animations pilotées par GSAP (lazy-load via AnimationService).
 */
@Component({
  selector: 'app-hex-grid',
  standalone: true,
  template: `
    <canvas
      #hexCanvas
      class="hex-grid__canvas"
      aria-hidden="true"
    ></canvas>
  `,
  styles: [
    `
      .hex-grid__canvas {
        position: absolute;
        inset: 0;
        width: 100%;
        height: 100%;
        z-index: 0;
        pointer-events: none;
      }
    `,
  ],
})
export class HexGridComponent implements OnInit, OnDestroy {
  @ViewChild('hexCanvas', { static: true })
  canvasRef!: ElementRef<HTMLCanvasElement>;

  /** Désactivé sur mobile pour la performance */
  readonly isMobile = signal(false);

  private ctx: CanvasRenderingContext2D | null = null;
  private hexagons: HexData[] = [];
  private animFrameId: number | null = null;
  private resizeObserver: ResizeObserver | null = null;
  private pulseTween: any = null;

  /* ==========================================================================
   * Configuration de la grille
   * ========================================================================== */

  /** Nombre d'hexagones dans la grille */
  private readonly HEX_COUNT = 25;

  /** Rayon d'un hexagone en pixels (avant mise à l'échelle responsive) */
  private readonly HEX_RADIUS = 32;

  /** Espacement horizontal entre centres */
  private readonly H_SPACING = 72;

  /** Espacement vertical entre centres */
  private readonly V_SPACING = 62;

  /* ==========================================================================
   * Lifecycle
   * ========================================================================== */

  ngOnInit(): void {
    this.detectMobile();
    if (this.isMobile()) return;

    this.ctx = this.canvasRef.nativeElement.getContext('2d');
    if (!this.ctx) return;

    this.resize();
    this.resizeObserver = new ResizeObserver(() => this.resize());
    this.resizeObserver.observe(this.canvasRef.nativeElement.parentElement!);

    this.generateHexagons();
    this.startPulse();
    this.drawLoop();
  }

  ngOnDestroy(): void {
    if (this.resizeObserver) {
      this.resizeObserver.disconnect();
      this.resizeObserver = null;
    }
    if (this.animFrameId !== null) {
      cancelAnimationFrame(this.animFrameId);
      this.animFrameId = null;
    }
    if (this.pulseTween) {
      this.pulseTween.kill();
      this.pulseTween = null;
    }
  }

  /* ==========================================================================
   * Méthodes privées
   * ========================================================================== */

  private detectMobile(): void {
    const mq = window.matchMedia('(max-width: 767px)');
    this.isMobile.set(mq.matches);
  }

  /** Redimensionne le canvas pour couvrir le parent */
  private resize(): void {
    const canvas = this.canvasRef.nativeElement;
    const parent = canvas.parentElement;
    if (!parent) return;

    const dpr = window.devicePixelRatio || 1;
    const w = parent.clientWidth;
    const h = parent.clientHeight;

    canvas.width = w * dpr;
    canvas.height = h * dpr;
    canvas.style.width = `${w}px`;
    canvas.style.height = `${h}px`;

    this.ctx?.setTransform(dpr, 0, 0, dpr, 0, 0);

    // Recalculer les positions des hexagones après resize
    if (this.hexagons.length > 0) {
      this.layoutHexagons(w, h);
    }
  }

  /** Génère les positions des hexagones en grille */
  private generateHexagons(): void {
    this.hexagons = [];
    const canvas = this.canvasRef.nativeElement;
    const w = (canvas.parentElement?.clientWidth ?? canvas.width) || 800;
    const h = (canvas.parentElement?.clientHeight ?? canvas.height) || 600;

    for (let i = 0; i < this.HEX_COUNT; i++) {
      this.hexagons.push({
        id: i,
        cx: 0,
        cy: 0,
        baseOpacity: 0.03 + Math.random() * 0.03,
        phase: Math.random() * Math.PI * 2,
      });
    }

    this.layoutHexagons(w, h);
  }

  /** Positionne les hexagones en grille après resize */
  private layoutHexagons(w: number, h: number): void {
    const cols = Math.ceil(w / this.H_SPACING) + 1;
    const rows = Math.ceil(h / this.V_SPACING) + 1;
    const totalCells = cols * rows;

    this.hexagons.forEach((hex, i) => {
      // Répartir les hexagones sur la grille avec un offset aléatoire
      const cellIndex = (i * Math.floor(totalCells / this.HEX_COUNT)) % totalCells;
      const col = cellIndex % cols;
      const row = Math.floor(cellIndex / cols);

      hex.cx = col * this.H_SPACING + (row % 2 === 0 ? 0 : this.H_SPACING / 2) - this.H_SPACING / 2;
      hex.cy = row * this.V_SPACING - this.V_SPACING / 2;

      // Léger offset aléatoire pour un aspect organique
      hex.cx += (Math.random() - 0.5) * 20;
      hex.cy += (Math.random() - 0.5) * 20;

      // Voisins pour les lignes de connexion
      hex.neighbors = this.findNeighbors(i, w, h);
    });
  }

  /** Trouve les voisins proches d'un hexagone pour les lignes de connexion */
  private findNeighbors(idx: number, _w: number, _h: number): number[] {
    const neighbors: number[] = [];
    const hex = this.hexagons[idx];
    if (!hex) return neighbors;

    const maxDist = this.H_SPACING * 1.3;

    this.hexagons.forEach((other, i) => {
      if (i === idx) return;
      const dx = hex.cx - other.cx;
      const dy = hex.cy - other.cy;
      const dist = Math.sqrt(dx * dx + dy * dy);
      if (dist < maxDist && neighbors.length < 4) {
        neighbors.push(i);
      }
    });

    return neighbors;
  }

  /** Démarre la pulsation GSAP */
  private async startPulse(): Promise<void> {
    try {
      const gsapModule = await import('gsap');
      const gsap = gsapModule.default ?? gsapModule;

      this.pulseTween = gsap.to(this.hexagons, {
        opacity: 0.06,
        duration: 3,
        ease: 'sine.inOut',
        yoyo: true,
        repeat: -1,
        stagger: {
          each: 0.15,
          from: 'random',
        },
        onUpdate: () => {
          /* Le drawLoop lit les valeurs en continu */
        },
      });
    } catch {
      // GSAP non disponible — pulsation désactivée, rendu statique OK
    }
  }

  /** Boucle de rendu continue */
  private drawLoop = (): void => {
    this.draw();
    this.animFrameId = requestAnimationFrame(this.drawLoop);
  };

  /** Dessine la frame courante */
  private draw(): void {
    const ctx = this.ctx;
    if (!ctx) return;

    const w = this.canvasRef.nativeElement.parentElement?.clientWidth ?? 0;
    const h = this.canvasRef.nativeElement.parentElement?.clientHeight ?? 0;

    ctx.clearRect(0, 0, w, h);

    // Lignes de connexion entre hexagones voisins
    ctx.strokeStyle = 'rgba(142, 136, 130, 0.06)';
    ctx.lineWidth = 0.5;
    this.hexagons.forEach((hex) => {
      hex.neighbors?.forEach((nIdx) => {
        const neighbor = this.hexagons[nIdx];
        if (!neighbor) return;
        ctx.beginPath();
        ctx.moveTo(hex.cx, hex.cy);
        ctx.lineTo(neighbor.cx, neighbor.cy);
        ctx.stroke();
      });
    });

    // Hexagones
    this.hexagons.forEach((hex) => {
      const opacity = (hex as any).opacity ?? hex.baseOpacity;

      ctx.fillStyle = `rgba(142, 136, 130, ${opacity})`;
      ctx.strokeStyle = `rgba(142, 136, 130, ${opacity * 1.5})`;
      ctx.lineWidth = 0.5;

      ctx.beginPath();
      for (let s = 0; s < 6; s++) {
        const angle = (Math.PI / 3) * s - Math.PI / 6;
        const x = hex.cx + this.HEX_RADIUS * Math.cos(angle);
        const y = hex.cy + this.HEX_RADIUS * Math.sin(angle);
        if (s === 0) ctx.moveTo(x, y);
        else ctx.lineTo(x, y);
      }
      ctx.closePath();
      ctx.fill();
      ctx.stroke();
    });
  }
}

/* ==========================================================================
 * Types internes
 * ========================================================================== */

interface HexData {
  id: number;
  cx: number;
  cy: number;
  baseOpacity: number;
  phase: number;
  neighbors?: number[];
}
