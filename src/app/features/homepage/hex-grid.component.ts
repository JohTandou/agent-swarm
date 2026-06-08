import {
  Component,
  ElementRef,
  signal,
  OnDestroy,
  OnInit,
  ViewChild,
  HostListener,
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
 *
 * Easter egg : tapez "swarm" au clavier pour illuminer tous les hexagones.
 */
@Component({
  selector: 'app-hex-grid',
  standalone: true,
  template: `
    <canvas
      #hexCanvas
      class="hex-grid__canvas"
      [class.hex-grid__hidden]="isMobile()"
      aria-hidden="true"
    ></canvas>
    <svg
      class="hex-grid__fallback"
      [class.hex-grid__hidden]="!isMobile()"
      [class.hex-grid__easter-egg]="easterEggMobile()"
      viewBox="0 0 400 300"
      aria-hidden="true"
      preserveAspectRatio="xMidYMid slice"
    >
      <defs>
        <polygon id="hf" points="20,0 30,17 20,34 0,34 -10,17 0,0" />
      </defs>
      <use href="#hf" x="40" y="20" fill="var(--color-text-secondary)" opacity="0.04" />
      <use href="#hf" x="120" y="20" fill="var(--color-text-secondary)" opacity="0.06" />
      <use href="#hf" x="200" y="20" fill="var(--color-text-secondary)" opacity="0.04" />
      <use href="#hf" x="80" y="75" fill="var(--color-text-secondary)" opacity="0.05" />
      <use href="#hf" x="160" y="75" fill="var(--color-text-secondary)" opacity="0.03" />
      <use href="#hf" x="40" y="130" fill="var(--color-text-secondary)" opacity="0.06" />
      <use href="#hf" x="120" y="130" fill="var(--color-text-secondary)" opacity="0.04" />
      <use href="#hf" x="200" y="130" fill="var(--color-text-secondary)" opacity="0.05" />
      <use href="#hf" x="80" y="185" fill="var(--color-text-secondary)" opacity="0.03" />
      <use href="#hf" x="160" y="185" fill="var(--color-text-secondary)" opacity="0.06" />
      <use href="#hf" x="40" y="240" fill="var(--color-text-secondary)" opacity="0.04" />
      <use href="#hf" x="120" y="240" fill="var(--color-text-secondary)" opacity="0.05" />
      <use href="#hf" x="200" y="240" fill="var(--color-text-secondary)" opacity="0.03" />
    </svg>
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
      .hex-grid__fallback {
        position: absolute;
        inset: 0;
        width: 100%;
        height: 100%;
        z-index: 0;
        pointer-events: none;
      }
      .hex-grid__hidden {
        display: none;
      }

      /* Animations SVG mobile — hexagones qui pulsent */
      .hex-grid__fallback use {
        fill: var(--color-accent);
        opacity: 0.02;
        animation: hexPulseMobile 3s ease-in-out infinite;
      }

      .hex-grid__fallback use:nth-child(1) { animation-delay: 0s; }
      .hex-grid__fallback use:nth-child(2) { animation-delay: 0.3s; }
      .hex-grid__fallback use:nth-child(3) { animation-delay: 0.6s; }
      .hex-grid__fallback use:nth-child(4) { animation-delay: 0.9s; }
      .hex-grid__fallback use:nth-child(5) { animation-delay: 1.2s; }
      .hex-grid__fallback use:nth-child(6) { animation-delay: 1.5s; }
      .hex-grid__fallback use:nth-child(7) { animation-delay: 1.8s; }
      .hex-grid__fallback use:nth-child(8) { animation-delay: 2.1s; }
      .hex-grid__fallback use:nth-child(9) { animation-delay: 2.4s; }
      .hex-grid__fallback use:nth-child(10) { animation-delay: 2.7s; }
      .hex-grid__fallback use:nth-child(11) { animation-delay: 3.0s; }
      .hex-grid__fallback use:nth-child(12) { animation-delay: 3.3s; }
      .hex-grid__fallback use:nth-child(13) { animation-delay: 3.6s; }

      @keyframes hexPulseMobile {
        0%, 100% { opacity: 0.02; }
        50% { opacity: 0.08; }
      }

      .hex-grid__fallback.hex-grid__easter-egg use {
        opacity: 0.4 !important;
        animation: none;
      }

      @media (prefers-reduced-motion: reduce) {
        .hex-grid__fallback use {
          animation: none;
          opacity: 0.04;
        }
      }
    `,
  ],
})
export class HexGridComponent implements OnInit, OnDestroy {
  @ViewChild('hexCanvas', { static: true })
  canvasRef!: ElementRef<HTMLCanvasElement>;

  /** Désactivé sur mobile pour la performance (le SVG fallback prend le relais) */
  readonly isMobile = signal(false);

  /** Easter egg actif sur le SVG mobile */
  readonly easterEggMobile = signal(false);

  private ctx: CanvasRenderingContext2D | null = null;
  private hexagons: HexData[] = [];
  private animFrameId: number | null = null;
  private resizeObserver: ResizeObserver | null = null;
  private pulseTween: any = null;

  /* ==========================================================================
   * Easter egg
   * ========================================================================== */

  /** Buffer accumulant les touches pour détecter "swarm" */
  private easterEggBuffer = '';

  /** Timer pour reset le buffer après 3s d'inactivité */
  private easterEggTimer: any = null;

  /** Flag empêchant les déclenchements multiples pendant l'animation */
  private easterEggActive = false;

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
    clearTimeout(this.easterEggTimer);
  }

  /* ==========================================================================
   * Easter egg — détection clavier "swarm"
   * ========================================================================== */

  @HostListener('window:keydown', ['$event'])
  onKeydown(event: KeyboardEvent): void {
    // Ignore les touches de contrôle et les champs de saisie
    if (event.ctrlKey || event.metaKey || event.altKey) return;
    const target = event.target as HTMLElement | null;
    if (!target) return; // Garde contre les événements dispatchés sur window (tests)
    if (target.tagName === 'INPUT' || target.tagName === 'TEXTAREA' || target.isContentEditable) return;

    this.easterEggBuffer += event.key.toLowerCase();
    clearTimeout(this.easterEggTimer);
    this.easterEggTimer = setTimeout(() => {
      this.easterEggBuffer = '';
    }, 3000);

    if (this.easterEggBuffer.includes('swarm')) {
      this.easterEggBuffer = '';
      this.triggerEasterEgg();
    }
  }

  /** Illumine tous les hexagones en #F0A522 pendant 2s */
  private triggerEasterEgg(): void {
    if (this.easterEggActive) return;

    if (this.isMobile()) {
      this.easterEggMobile.set(true);
      setTimeout(() => this.easterEggMobile.set(false), 2000);
      return;
    }

    this.easterEggActive = true;

    // Sauvegarde les opacités d'origine et applique l'illumination
    this.hexagons.forEach((hex) => {
      (hex as any)._savedOpacity = hex.baseOpacity;
      hex.baseOpacity = 0.4;
    });

    // Restauration après 2s
    setTimeout(() => {
      this.hexagons.forEach((hex) => {
        hex.baseOpacity = (hex as any)._savedOpacity ?? 0.03;
        delete (hex as any)._savedOpacity;
      });
      this.easterEggActive = false;
    }, 2000);
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

    // Pendant l'easter egg, utiliser la couleur accent
    const fillColor = this.easterEggActive
      ? 'rgba(240, 165, 34, '
      : 'rgba(142, 136, 130, ';
    const strokeColor = this.easterEggActive
      ? 'rgba(240, 165, 34, '
      : 'rgba(142, 136, 130, ';

    // Lignes de connexion entre hexagones voisins
    ctx.strokeStyle = this.easterEggActive
      ? 'rgba(240, 165, 34, 0.15)'
      : 'rgba(142, 136, 130, 0.06)';
    ctx.lineWidth = this.easterEggActive ? 1 : 0.5;
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
      // Pendant l'easter egg, ignorer l'opacité GSAP et utiliser baseOpacity=0.4
      const opacity = this.easterEggActive ? 0.4 : ((hex as any).opacity ?? hex.baseOpacity);

      ctx.fillStyle = `${fillColor}${opacity})`;
      ctx.strokeStyle = `${strokeColor}${opacity * 1.5})`;
      ctx.lineWidth = this.easterEggActive ? 1 : 0.5;

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
