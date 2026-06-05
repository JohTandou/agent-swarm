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
 * - Post-processing Mermaid.js (lazy-load)
 * - Génération automatique des ancres pour le TOC
 * - Intégration Prism.js pour la coloration syntaxique
 */
@Component({
  selector: 'app-markdown-renderer',
  standalone: true,
  imports: [MarkdownComponent],
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

  /**
   * Post-processing après rendu ngx-markdown.
   * - Mermaid : cherche <code class="language-mermaid"> et render via Mermaid
   * - Prism : coloration syntaxique
   */
  private afterRender(): void {
    if (this.enableMermaid) {
      this.renderMermaidBlocks();
    }
    if (this.enablePrism) {
      this.highlightCode();
    }
  }

  /** Lazy-load Mermaid.js et render les diagrammes */
  private async renderMermaidBlocks(): Promise<void> {
    const host: HTMLElement = this.hostRef.nativeElement;
    const mermaidBlocks = host.querySelectorAll('code.language-mermaid');

    if (mermaidBlocks.length === 0) return;

    try {
      const mermaid = await import('mermaid');
      mermaid.default.initialize({
        startOnLoad: false,
        theme: 'dark',
        themeVariables: {
          primaryColor: '#3A3530',
          primaryTextColor: '#F5F0EB',
          primaryBorderColor: 'rgba(142,136,130,0.3)',
          lineColor: '#8E8882',
          secondaryColor: '#4A4540',
          tertiaryColor: '#2A2520',
        },
      });

      for (const block of Array.from(mermaidBlocks)) {
        const pre = block.parentElement;
        if (!pre) continue;

        const graphDefinition = block.textContent ?? '';
        if (!graphDefinition.trim()) continue;

        try {
          const { svg } = await mermaid.default.render(
            `mermaid-${Math.random().toString(36).slice(2, 8)}`,
            graphDefinition,
          );
          const container = document.createElement('div');
          container.className = 'mermaid-diagram';
          container.innerHTML = svg;
          pre.replaceWith(container);
        } catch (mermaidErr) {
          console.warn(
            '[MarkdownRenderer] Erreur de rendu Mermaid :',
            mermaidErr,
          );
        }
      }
    } catch (importErr) {
      console.warn(
        '[MarkdownRenderer] Impossible de charger Mermaid.js :',
        importErr,
      );
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
}
