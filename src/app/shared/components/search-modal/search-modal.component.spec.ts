import { ComponentFixture, TestBed, fakeAsync, tick, flush } from '@angular/core/testing';
import { signal } from '@angular/core';
import { provideHttpClient } from '@angular/common/http';
import { provideHttpClientTesting } from '@angular/common/http/testing';
import { provideRouter } from '@angular/router';
import { SearchModalComponent } from './search-modal.component';
import { LanguageService } from '../../services/language.service';
import type { SearchResult } from '@shared/models';

describe('SearchModalComponent', () => {
  let component: SearchModalComponent;
  let fixture: ComponentFixture<SearchModalComponent>;

  const mockResult: SearchResult = {
    title: 'Orchestrator',
    description: "Chef d'orchestre du pipeline",
    route: '/agents/orchestrateur',
    section: 'Agents',
    sourcePath: 'agents/orchestrateur.md',
  };

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SearchModalComponent],
      providers: [
        provideHttpClient(),
        provideHttpClientTesting(),
        provideRouter([]),
        LanguageService,
      ],
    }).compileComponents();

    TestBed.inject(LanguageService).setLang('fr');
    sessionStorage.clear();

    fixture = TestBed.createComponent(SearchModalComponent);
    component = fixture.componentInstance;
  });

  it('devrait créer le composant', () => {
    fixture.detectChanges();
    expect(component).toBeTruthy();
  });

  it('devrait afficher l\'input de recherche', () => {
    fixture.detectChanges();
    const input: HTMLInputElement = fixture.nativeElement.querySelector('.search-modal__input');
    expect(input).toBeTruthy();
  });

  it('devrait afficher un placeholder dans l\'input', () => {
    fixture.detectChanges();
    const input: HTMLInputElement = fixture.nativeElement.querySelector('.search-modal__input');
    expect(input.placeholder).toBe('Rechercher un agent, un skill, une page\u2026');
  });

  it('devrait émettre dismiss quand Escape est pressé', () => {
    const spy = spyOn(component.dismiss, 'emit');
    component.handleKeyboard(new KeyboardEvent('keydown', { key: 'Escape' }));
    expect(spy).toHaveBeenCalled();
  });

  it('devrait fermer au clic sur le backdrop', () => {
    fixture.detectChanges();
    const spy = spyOn(component.dismiss, 'emit');
    const backdrop: HTMLElement = fixture.nativeElement.querySelector('.search-modal__backdrop');
    backdrop.click();
    expect(spy).toHaveBeenCalled();
  });

  it('devrait afficher le message d\'indexation pendant le chargement', () => {
    component.searchService.isIndexing.set(true);
    fixture.detectChanges();
    const indexingEl = fixture.nativeElement.querySelector('.search-modal__indexing');
    expect(indexingEl).toBeTruthy();
    expect(indexingEl.textContent?.trim()).toBe('Indexation en cours…');
  });

  it('devrait afficher l\'état vide quand isEmpty est true', () => {
    component.loading.set(false);
    component.isEmpty.set(true);
    component.query.set('zzztest123');
    fixture.detectChanges();
    const emptyEl = fixture.nativeElement.querySelector('app-ui-empty-state');
    expect(emptyEl).toBeTruthy();
  });

  it('ne devrait pas afficher l\'état vide quand isLoading et isEmpty sont false', () => {
    component.loading.set(false);
    component.isEmpty.set(false);
    fixture.detectChanges();
    const emptyEl = fixture.nativeElement.querySelector('app-ui-empty-state');
    expect(emptyEl).toBeFalsy();
  });

  it('devrait avoir le rôle dialog sur le panel', () => {
    fixture.detectChanges();
    const panel = fixture.nativeElement.querySelector('[role="dialog"]');
    expect(panel).toBeTruthy();
  });

  it('devrait avoir le footer avec les raccourcis clavier', () => {
    component.loading.set(false);
    fixture.detectChanges();
    const footer = fixture.nativeElement.querySelector('.search-modal__footer');
    expect(footer).toBeTruthy();
  });

  // ─── Nouveaux tests pour la couverture ───

  it('onQueryChange() devrait mettre à jour le signal query', () => {
    component.onQueryChange('orchestrateur');
    expect(component.query()).toBe('orchestrateur');
  });

  it('onQueryChange() devrait déclencher le debounce', fakeAsync(() => {
    const searchSpy = spyOn(component.searchService, 'search').and.returnValue([]);
    component.onQueryChange('ab'); // >= 2 caractères
    tick(200); // debounce 150ms + marge
    flush();
    expect(searchSpy).toHaveBeenCalled();
  }));

  it('performSearch() ne devrait rien retourner pour une requête < 2 caractères', fakeAsync(() => {
    component.onQueryChange('a');
    tick(200);
    flush();
    expect(component.results().length).toBe(0);
    expect(component.isEmpty()).toBe(false);
    expect(component.selectedIndex()).toBe(-1);
  }));

  it('performSearch() devrait retourner des résultats pour une requête ≥ 2 caractères', fakeAsync(() => {
    const mockResults: SearchResult[] = [mockResult];
    const searchSpy = spyOn(component.searchService, 'search').and.returnValue(mockResults);
    component.onQueryChange('orchestrateur');
    tick(200);
    flush();
    expect(searchSpy).toHaveBeenCalledWith('orchestrateur');
    expect(component.results().length).toBe(1);
    expect(component.selectedIndex()).toBe(0);
    expect(component.isEmpty()).toBe(false);
  }));

  it('performSearch() devrait marquer isEmpty si aucun résultat', fakeAsync(() => {
    spyOn(component.searchService, 'search').and.returnValue([]);
    component.onQueryChange('zzzrien');
    tick(200);
    flush();
    expect(component.isEmpty()).toBe(true);
    expect(component.selectedIndex()).toBe(-1);
  }));

  it('handleKeyboard ArrowDown devrait sélectionner le premier résultat (index 0)', () => {
    const mockResults: SearchResult[] = [mockResult, { ...mockResult, title: 'Front' }];
    component.results.set(mockResults);
    component.handleKeyboard(new KeyboardEvent('keydown', { key: 'ArrowDown' }));
    // selectedIndex initial = -1, ArrowDown (+1) → 0 (premier élément)
    expect(component.selectedIndex()).toBe(0);
  });

  it('handleKeyboard ArrowUp devrait wrapper vers la fin', () => {
    const mockResults: SearchResult[] = [mockResult];
    component.results.set(mockResults);
    component.selectedIndex.set(0);
    component.handleKeyboard(new KeyboardEvent('keydown', { key: 'ArrowUp' }));
    expect(component.selectedIndex()).toBe(0); // wrap: 0 -> -1 + 1 = 0, or wrap to max-1
  });

  it('handleKeyboard ArrowDown ne fait rien si pas de résultats', () => {
    component.results.set([]);
    component.handleKeyboard(new KeyboardEvent('keydown', { key: 'ArrowDown' }));
    expect(component.selectedIndex()).toBe(-1);
  });

  it('handleKeyboard Enter devrait émettre navigate si sélection valide', () => {
    const navigateSpy = spyOn(component.navigate, 'emit');
    const mockResults: SearchResult[] = [mockResult];
    component.results.set(mockResults);
    component.selectedIndex.set(0);
    component.handleKeyboard(new KeyboardEvent('keydown', { key: 'Enter' }));
    expect(navigateSpy).toHaveBeenCalledWith(mockResult);
  });

  it('handleKeyboard Enter ne fait rien si pas de résultat sélectionné', () => {
    const navigateSpy = spyOn(component.navigate, 'emit');
    component.results.set([mockResult]);
    component.selectedIndex.set(-1);
    component.handleKeyboard(new KeyboardEvent('keydown', { key: 'Enter' }));
    expect(navigateSpy).not.toHaveBeenCalled();
  });

  it('selectResult() devrait émettre l\'événement navigate', () => {
    const navigateSpy = spyOn(component.navigate, 'emit');
    component.selectResult(mockResult);
    expect(navigateSpy).toHaveBeenCalledWith(mockResult);
  });

  it('onBackdropClick() devrait émettre dismiss', () => {
    const dismissSpy = spyOn(component.dismiss, 'emit');
    component.onBackdropClick();
    expect(dismissSpy).toHaveBeenCalled();
  });

  it('onPanelClick() devrait empêcher la propagation', () => {
    const event = new MouseEvent('click', { bubbles: true });
    const stopPropagationSpy = spyOn(event, 'stopPropagation');
    component.onPanelClick(event);
    expect(stopPropagationSpy).toHaveBeenCalled();
  });

  it('getResultId() devrait retourner le bon format d\'ID', () => {
    expect(component.getResultId(0)).toBe('search-result-0');
    expect(component.getResultId(5)).toBe('search-result-5');
  });

  it('ngOnDestroy() devrait se désabonner sans erreur', () => {
    expect(() => component.ngOnDestroy()).not.toThrow();
  });

  it('query devrait être vide au départ', () => {
    expect(component.query()).toBe('');
  });

  it('selectedIndex devrait être -1 au départ', () => {
    expect(component.selectedIndex()).toBe(-1);
  });

  it('isEmpty devrait être false au départ', () => {
    expect(component.isEmpty()).toBe(false);
  });

  it('loading devrait suivre isIndexing du searchService', () => {
    component.searchService.isIndexing.set(true);
    fixture.detectChanges();
    fixture.detectChanges();
    expect(component.loading()).toBe(true);

    component.searchService.isIndexing.set(false);
    fixture.detectChanges();
    fixture.detectChanges();
    expect(component.loading()).toBe(false);
  });
});
