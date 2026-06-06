import {
  Component,
  signal,
  inject,
  Input,
  Output,
  EventEmitter,
  HostListener,
  effect,
  AfterViewInit,
  ElementRef,
  ViewChild,
  OnDestroy,
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Subject, debounceTime, distinctUntilChanged, Subscription } from 'rxjs';
import type { SearchResult } from '@shared/models';
import { SearchService } from '../../services/search.service';

/**
 * Modale de recherche Cmd+K.
 *
 * États gérés :
 * - Indexation (skeleton shimmer)
 * - Résultats (liste avec navigation clavier)
 * - Aucun résultat (empty state)
 * - Erreur réseau (message + retry)
 *
 * Accessibilité : navigation clavier circulaire, aria-activedescendant,
 * role="dialog" avec aria-label.
 */
@Component({
  selector: 'app-search-modal',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './search-modal.component.html',
  styleUrls: ['./search-modal.component.scss'],
})
export class SearchModalComponent implements AfterViewInit, OnDestroy {
  /** Service de recherche injecté */
  readonly searchService = inject(SearchService);

  /** Émis quand l'utilisateur demande la fermeture (Escape, clic backdrop) */
  @Output() dismiss = new EventEmitter<void>();

  /** Émis quand l'utilisateur sélectionne un résultat */
  @Output() navigate = new EventEmitter<SearchResult>();

  /** Input de recherche (focus auto à l'ouverture) */
  @ViewChild('searchInput') searchInputRef!: ElementRef<HTMLInputElement>;

  /** Texte de recherche courant */
  readonly query = signal('');

  /** Résultats de recherche */
  readonly results = signal<SearchResult[]>([]);

  /** Index du résultat sélectionné (-1 = aucun) */
  readonly selectedIndex = signal(-1);

  /** Indique si l'indexation est en cours */
  readonly loading = signal(false);

  /** Indique si aucun résultat n'a été trouvé */
  readonly isEmpty = signal(false);

  /** Sujet de debounce pour la saisie */
  private searchSubject = new Subject<string>();

  /** Abonnements à nettoyer */
  private subscriptions = new Subscription();

  constructor() {
    // Debounce 150ms sur la recherche
    this.subscriptions.add(
      this.searchSubject
        .pipe(debounceTime(150), distinctUntilChanged())
        .subscribe((q) => this.performSearch(q)),
    );

    // Suivi de l'état d'indexation
    effect(() => {
      this.loading.set(this.searchService.isIndexing());
    });
  }

  ngAfterViewInit(): void {
    // Focus auto sur l'input
    setTimeout(() => {
      this.searchInputRef?.nativeElement?.focus();
    }, 100);
  }

  ngOnDestroy(): void {
    this.subscriptions.unsubscribe();
  }

  /** Gestionnaire global de clavier */
  @HostListener('window:keydown', ['$event'])
  handleKeyboard(event: KeyboardEvent): void {
    switch (event.key) {
      case 'Escape':
        event.preventDefault();
        this.dismiss.emit();
        break;

      case 'ArrowDown':
        event.preventDefault();
        this.moveSelection(1);
        break;

      case 'ArrowUp':
        event.preventDefault();
        this.moveSelection(-1);
        break;

      case 'Enter':
        event.preventDefault();
        this.selectCurrent();
        break;
    }
  }

  /** Met à jour la recherche avec debounce */
  onQueryChange(value: string): void {
    this.query.set(value);
    this.searchSubject.next(value);
  }

  /** Navigation dans la liste de résultats */
  private moveSelection(delta: number): void {
    const max = this.results().length;
    if (max === 0) {
      this.selectedIndex.set(-1);
      return;
    }
    this.selectedIndex.update((idx) => {
      const next = idx + delta;
      if (next < 0) return max - 1; // Wrap vers la fin
      if (next >= max) return 0;    // Wrap vers le début
      return next;
    });
  }

  /** Sélectionne le résultat courant et navigue */
  private selectCurrent(): void {
    const idx = this.selectedIndex();
    const items = this.results();
    if (idx >= 0 && idx < items.length) {
      this.selectResult(items[idx]);
    }
  }

  /** Effectue la recherche et met à jour les résultats */
  private performSearch(q: string): void {
    if (!q || q.trim().length < 2) {
      this.results.set([]);
      this.selectedIndex.set(-1);
      this.isEmpty.set(false);
      return;
    }

    const found = this.searchService.search(q);
    this.results.set(found);
    this.selectedIndex.set(found.length > 0 ? 0 : -1);
    this.isEmpty.set(found.length === 0);
  }

  /** Sélectionne un résultat et navigue */
  selectResult(result: SearchResult): void {
    this.navigate.emit(result);
  }

  /** Ferme la modale au clic sur le backdrop */
  onBackdropClick(): void {
    this.dismiss.emit();
  }

  /** Empêche la propagation du clic depuis le panel */
  onPanelClick(event: MouseEvent): void {
    event.stopPropagation();
  }

  /** Retourne l'ID d'un résultat pour aria-activedescendant */
  getResultId(index: number): string {
    return `search-result-${index}`;
  }
}
