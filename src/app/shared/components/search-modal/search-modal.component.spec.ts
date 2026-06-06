import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideHttpClient } from '@angular/common/http';
import { provideHttpClientTesting } from '@angular/common/http/testing';
import { provideRouter } from '@angular/router';
import { SearchModalComponent } from './search-modal.component';

describe('SearchModalComponent', () => {
  let component: SearchModalComponent;
  let fixture: ComponentFixture<SearchModalComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SearchModalComponent],
      providers: [
        provideHttpClient(),
        provideHttpClientTesting(),
        provideRouter([]),
      ],
    }).compileComponents();

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
    expect(input.placeholder).toBe('Rechercher un agent, un skill, une page...');
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

  it('devrait afficher le skeleton pendant le chargement', () => {
    component.searchService.isIndexing.set(true);
    fixture.detectChanges();
    fixture.detectChanges();
    const skeletons = fixture.nativeElement.querySelectorAll('.search-modal__skeleton');
    expect(skeletons.length).toBeGreaterThan(0);
  });

  it('devrait afficher l\'état vide quand isEmpty est true', () => {
    component.loading.set(false);
    component.isEmpty.set(true);
    component.query.set('zzztest123');
    fixture.detectChanges();
    const emptyEl = fixture.nativeElement.querySelector('.search-modal__empty');
    expect(emptyEl).toBeTruthy();
  });

  it('ne devrait pas afficher l\'état vide quand isLoading et isEmpty sont false', () => {
    component.loading.set(false);
    component.isEmpty.set(false);
    fixture.detectChanges();
    const emptyEl = fixture.nativeElement.querySelector('.search-modal__empty');
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
});
