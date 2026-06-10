import {
  Component,
  Input,
  OnChanges,
  SimpleChanges,
  inject,
  ElementRef,
  AfterViewInit,
  QueryList,
  ViewChildren,
  output,
} from '@angular/core';
import { MarkdownComponent, MarkdownService } from 'ngx-markdown';
import type { TocEntry } from '@shared/models';
import { ContentService } from '../../services/content.service';
import { UiSkeletonComponent } from '../ui-skeleton/ui-skeleton.component';

/** Regex pour détecter et transformer les callouts Markdown */
const CALLOUT_REGEX = /^:::(\w+)\s*\n([\s\S]*?)^:::/gm;
/** Types de callout valides */
type CalloutKind = 'info' | 'warning' | 'tip' | 'danger';
const VALID_CALLOUTS: Set<string> = new Set(['info', 'warning', 'tip', 'danger']);

/**
 * Composant de rendu Markdown riche.
 * Supporte :
 * - Rendu ngx-markdown depuis un fichier source
 * - Pre-processing des callouts (:::info, :::warning, etc.)
 * - Rendu Mermaid.js via ngx-markdown natif
 * - Génération automatique des ancres pour le TOC
 * - Intégration Prism.js pour la coloration syntaxique
 */
@Component({
  selector: 'app-markdown-renderer',
  standalone: true,
  imports: [MarkdownComponent, UiSkeletonComponent],
  templateUrl: './markdown-renderer.component.html',
  styleUrls: ['./markdown-renderer.component.scss'],
})
export class MarkdownRendererComponent implements OnChanges, AfterViewInit {
  private contentService = inject(ContentService);
  private markdownService = inject(MarkdownService);
  private hostRef = inject(ElementRef);

  /** Chemin source du fichier Markdown (relatif à src/content/) */
  @Input() sourcePath: string | null = null;

  /** Contenu Markdown brut (alternative à sourcePath) */
  @Input() content: string | null = null;

  /** Active le lazy-loading de Mermaid.js pour les diagrammes */
  @Input() enableMermaid = false;

  /** Active la coloration syntaxique Prism.js (par défaut) */
  @Input() enablePrism = true;

  /** URL de base pour la résolution des liens relatifs */
  @Input() baseUrl = '';

  /** Contenu traité prêt à être rendu */
  processedContent = '';

  /** Signal émis quand le contenu est chargé et les headings extraits */
  tocEntries = output<TocEntry[]>();

  /** État de chargement */
  isLoading = false;

  /** Message d'erreur */
  errorMessage: string | null = null;

  @ViewChildren(MarkdownComponent) markdownComponents!: QueryList<MarkdownComponent>;

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['sourcePath'] && this.sourcePath) {
      this.loadFromSource(this.sourcePath);
    } else if (changes['content'] && this.content !== null) {
      this.processContent(this.content);
      // Planifier le post-processing après mise à jour du DOM (Mermaid, Prism)
      setTimeout(() => this.afterRender(), 0);
    }
  }

  ngAfterViewInit(): void {
    // Post-processing après rendu initial
    this.markdownComponents.changes.subscribe(() => {
      this.afterRender();
    });
    if (this.processedContent) {
      this.afterRender();
    }
  }

  /** Charge le contenu depuis un fichier source */
  private loadFromSource(path: string): void {
    this.isLoading = true;
    this.errorMessage = null;

    this.contentService.loadDocument(path).subscribe({
      next: (doc) => {
        this.processContent(doc.content);
        this.tocEntries.emit(doc.tocEntries);
        this.isLoading = false;
      },
      error: (err: Error) => {
        this.errorMessage = err.message;
        this.isLoading = false;
        this.processedContent = '';
      },
    });
  }

  /**
   * Pre-processing du contenu Markdown avant rendu.
   * Transforme les callouts ::: en HTML structuré.
   */
  processContent(raw: string): void {
    let processed = raw;

    // Transformation des callouts
    processed = processed.replace(
      CALLOUT_REGEX,
      (_match: string, type: string, body: string) => {
        const kind: CalloutKind = VALID_CALLOUTS.has(type)
          ? (type as CalloutKind)
          : 'info';
        const iconMap: Record<CalloutKind, string> = {
          info: 'ℹ️',
          warning: '⚠️',
          tip: '💡',
          danger: '🚨',
        };
        return `<div class="callout callout--${kind}">
  <span class="callout__icon">${iconMap[kind]}</span>
  <div class="callout__body">${body.trim()}</div>
</div>`;
      },
    );

    // Ajout des IDs aux headings pour le scroll-spy
    processed = processed.replace(
      /^(#{1,4})\s+(.+)$/gm,
      (_match: string, hashes: string, text: string) => {
        const slug = this.contentService.generateSlug(text.trim());
        return `${hashes} <a id="${slug}" class="heading-anchor"></a>${text}`;
      },
    );

    this.processedContent = processed;
  }

  /** Post-processing après rendu ngx-markdown — coloration syntaxique Prism.js */
  private afterRender(): void {
    if (this.enableMermaid) {
      this.renderMermaidBlocks();
    }
    if (this.enablePrism) {
      this.highlightCode();
    }
  }

  /** Applique la coloration syntaxique Prism.js */
  private highlightCode(): void {
    try {
      this.markdownService.highlight(this.hostRef.nativeElement);
    } catch (prismErr) {
      console.warn(
        '[MarkdownRenderer] Erreur de coloration Prism :',
        prismErr,
      );
    }
  }

  /** Charge Mermaid.js depuis CDN et render les diagrammes avec MutationObserver */
  private async renderMermaidBlocks(): Promise<void> {
    const host: HTMLElement = this.hostRef.nativeElement;
    
    // Fonction de rendu
    const render = async () => {
      const mermaidBlocks = host.querySelectorAll('code.language-mermaid');
      if (mermaidBlocks.length === 0) return;

      try {
        const MERMAID_CDN = 'https://cdn.jsdelivr.net/npm/mermaid@11/dist/mermaid.min.js';
        if (!(window as any).mermaid) {
          await new Promise<void>((resolve, reject) => {
            const script = document.createElement('script');
            script.src = MERMAID_CDN;
            script.onload = () => resolve();
            script.onerror = () => reject(new Error('Échec chargement CDN'));
            document.head.appendChild(script);
          });
        }

        const mermaid = (window as any).mermaid;
        if (!mermaid) return;

        mermaid.initialize({ startOnLoad: false, theme: 'dark' });

        for (const block of Array.from(mermaidBlocks)) {
          const pre = block.parentElement;
          if (!pre || pre.classList.contains('mermaid-rendered')) continue;

          const graphDefinition = block.textContent ?? '';
          if (!graphDefinition.trim()) continue;

          try {
            const { svg } = await mermaid.render(
              `mermaid-${Math.random().toString(36).slice(2, 8)}`,
              graphDefinition,
            );
            const container = document.createElement('div');
            container.className = 'mermaid-diagram';
            container.innerHTML = svg;
            pre.replaceWith(container);
            pre.classList.add('mermaid-rendered');
          } catch (mermaidErr) {
            console.warn('[MarkdownRenderer] Erreur rendu :', mermaidErr);
          }
        }
      } catch (err) {
        console.warn('[MarkdownRenderer] Mermaid non disponible :', err);
      }
    };

    // Observer les changements du DOM pour détecter les blocs mermaid
    const observer = new MutationObserver(render);
    observer.observe(host, { childList: true, subtree: true });
    
    // Premier rendu
    render();
  }
}
