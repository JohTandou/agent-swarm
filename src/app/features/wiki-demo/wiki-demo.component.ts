import { Component, inject, signal } from '@angular/core';
import { MarkdownRendererComponent } from '../../shared/components/markdown-renderer/markdown-renderer.component';
import { TocService } from '../../shared/services/toc.service';
import type { TocEntry } from '@shared/models';

/**
 * Page de démonstration du système de contenu statique.
 * Charge le fichier demo.md et affiche le Markdown rendu.
 * Illustre l'intégration complète : ContentService → MarkdownRenderer → TOC.
 */
@Component({
  selector: 'app-wiki-demo',
  standalone: true,
  imports: [MarkdownRendererComponent],
  template: `
    <section class="wiki-demo">
      <header class="wiki-demo__header">
        <p class="wiki-demo__eyebrow">Démonstration</p>
        <h1 class="wiki-demo__title">Système de contenu statique</h1>
        <p class="wiki-demo__subtitle">
          Cette page démontre le rendu Markdown riche avec callouts, coloration syntaxique
          et navigation intra-page via la table des matières.
        </p>
      </header>

      <app-markdown-renderer
        [sourcePath]="'demo.md'"
        [enableMermaid]="true"
        [enablePrism]="true"
        (tocEntries)="onTocEntries($event)"
      />
    </section>
  `,
  styles: [`
    .wiki-demo { display: flex; flex-direction: column; gap: 32px; padding: 32px 0 64px; }

    .wiki-demo__header {
      margin-bottom: 16px;
    }

    .wiki-demo__eyebrow {
      font-family: var(--font-display);
      font-weight: 700;
      font-size: 0.75rem;
      letter-spacing: 0.08em;
      text-transform: uppercase;
      color: var(--color-accent);
      margin-bottom: 8px;
    }

    .wiki-demo__title {
      font-family: var(--font-display);
      font-weight: 800;
      font-size: clamp(2rem, 4vw, 3rem);
      letter-spacing: -0.03em;
      color: var(--color-text-primary);
      background: linear-gradient(135deg, var(--color-text-primary) 0%, var(--color-accent) 100%);
      -webkit-background-clip: text;
      -webkit-text-fill-color: transparent;
      background-clip: text;
      margin-bottom: 12px;
    }

    .wiki-demo__subtitle {
      font-family: var(--font-body);
      font-size: 1.0625rem;
      color: var(--color-text-secondary);
      max-width: 600px;
      line-height: 1.7;
    }
  `],
})
export class WikiDemoComponent {
  private tocService = inject(TocService);

  /** Transmet les entrées TOC au service partagé */
  onTocEntries(entries: TocEntry[]): void {
    this.tocService.setEntries(entries);
  }
}
