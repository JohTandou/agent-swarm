import { ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { StandardsComponent } from './standards.component';
import { UiSkeletonComponent } from '@shared/components/ui-skeleton/ui-skeleton.component';

describe('StandardsComponent', () => {
  let component: StandardsComponent;
  let fixture: ComponentFixture<StandardsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [StandardsComponent, UiSkeletonComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(StandardsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  /* ==========================================================================
   * Création
   * ========================================================================== */

  it('devrait créer le composant', () => {
    expect(component).toBeTruthy();
  });

  /* ==========================================================================
   * État loading
   * ========================================================================== */

  it('devrait afficher le shimmer skeleton quand loading est true', () => {
    const loader: HTMLElement = fixture.nativeElement.querySelector('.page-loader');
    expect(loader).toBeTruthy();
  });

  it('devrait afficher le skeleton-title dans l\'état loading', () => {
    const titleSkeleton = fixture.debugElement.query(
      By.css('app-ui-skeleton[variant="text"][width="280px"]')
    );
    expect(titleSkeleton).toBeTruthy();
  });

  it('devrait afficher les skeleton-cards dans l\'état loading', () => {
    const cards = fixture.debugElement.queryAll(
      By.css('app-ui-skeleton[variant="card"]')
    );
    expect(cards.length).toBe(3);
  });

  it('ne devrait pas afficher le contenu principal pendant le loading', () => {
    const main = fixture.nativeElement.querySelector('.page');
    expect(main).toBeFalsy();
  });

  /* ==========================================================================
   * État erreur
   * ========================================================================== */

  it('devrait afficher l\'état d\'erreur quand error est défini', () => {
    component['loading'].set(false);
    component['error'].set('Une erreur est survenue');
    fixture.detectChanges();

    const errorState: HTMLElement = fixture.nativeElement.querySelector('.error-state');
    expect(errorState).toBeTruthy();
  });

  it('devrait afficher le message d\'erreur', () => {
    component['loading'].set(false);
    component['error'].set('Erreur de chargement');
    fixture.detectChanges();

    const message: HTMLElement = fixture.nativeElement.querySelector('.error-state__message');
    expect(message).toBeTruthy();
    expect(message.textContent?.trim()).toBe('Erreur de chargement');
  });

  it('devrait avoir un bouton retry visible dans l\'état d\'erreur', () => {
    component['loading'].set(false);
    component['error'].set('Erreur');
    fixture.detectChanges();

    const button: HTMLElement = fixture.nativeElement.querySelector('.error-state app-ui-button');
    expect(button).toBeTruthy();
    expect(button.textContent?.trim()).toBe('Réessayer');
  });

  /* ==========================================================================
   * État succès
   * ========================================================================== */

  it('devrait afficher le contenu principal quand ni loading ni error', () => {
    component['loading'].set(false);
    fixture.detectChanges();

    const main: HTMLElement = fixture.nativeElement.querySelector('.page');
    expect(main).toBeTruthy();
  });

  it('devrait afficher la section hero', () => {
    component['loading'].set(false);
    fixture.detectChanges();

    const hero: HTMLElement = fixture.nativeElement.querySelector('.hero');
    expect(hero).toBeTruthy();
  });

  it('devrait afficher la section palette', () => {
    component['loading'].set(false);
    fixture.detectChanges();

    const palette: HTMLElement = fixture.nativeElement.querySelector('.palette');
    expect(palette).toBeTruthy();
  });

  it('devrait afficher la section conventions', () => {
    component['loading'].set(false);
    fixture.detectChanges();

    const conventions: HTMLElement = fixture.nativeElement.querySelector('.conventions');
    expect(conventions).toBeTruthy();
  });

  it('devrait afficher la section testing', () => {
    component['loading'].set(false);
    fixture.detectChanges();

    const testing: HTMLElement = fixture.nativeElement.querySelector('.testing');
    expect(testing).toBeTruthy();
  });

  it('devrait afficher la section documentation', () => {
    component['loading'].set(false);
    fixture.detectChanges();

    const documentation: HTMLElement = fixture.nativeElement.querySelector('.documentation');
    expect(documentation).toBeTruthy();
  });

  it('devrait afficher le footer', () => {
    component['loading'].set(false);
    fixture.detectChanges();

    const footer: HTMLElement = fixture.nativeElement.querySelector('.page-footer');
    expect(footer).toBeTruthy();
  });

  /* ==========================================================================
   * Section typographie
   * ========================================================================== */

  it("devrait afficher la section typographie", () => {
    component['loading'].set(false);
    fixture.detectChanges();

    const typography: HTMLElement = fixture.nativeElement.querySelector('.typography');
    expect(typography).toBeTruthy();
  });

  it("devrait afficher 2 démonstrations typographiques", () => {
    component['loading'].set(false);
    fixture.detectChanges();

    const demos = fixture.nativeElement.querySelectorAll('.typo-demo');
    expect(demos.length).toBe(2);
  });

  /* ==========================================================================
   * Section animations
   * ========================================================================== */

  it("devrait afficher la section animations", () => {
    component['loading'].set(false);
    fixture.detectChanges();

    const animations: HTMLElement = fixture.nativeElement.querySelector('.animations');
    expect(animations).toBeTruthy();
  });

  it("devrait avoir un tableau d'animations", () => {
    component['loading'].set(false);
    fixture.detectChanges();

    const table: HTMLElement = fixture.nativeElement.querySelector('.animations__table');
    expect(table).toBeTruthy();
  });

  it("devrait afficher 6 lignes dans le tableau d'animation", () => {
    component['loading'].set(false);
    fixture.detectChanges();

    const rows = fixture.nativeElement.querySelectorAll('.animations__table tbody tr');
    expect(rows.length).toBe(6);
  });

  /* ==========================================================================
   * Données — palette
   * ========================================================================== */

  it('devrait avoir 6 couleurs dans la palette', () => {
    const colors = (component as any).paletteColors;
    expect(colors.length).toBe(6);
  });

  it('devrait afficher 6 swatches de couleur', () => {
    component['loading'].set(false);
    fixture.detectChanges();

    const swatches = fixture.nativeElement.querySelectorAll('.palette-swatch');
    expect(swatches.length).toBe(6);
  });

  /* ==========================================================================
   * Données — élévation
   * ========================================================================== */

  it('devrait avoir 4 niveaux d\'élévation', () => {
    const levels = (component as any).elevationLevels;
    expect(levels.length).toBe(4);
  });

  it('devrait afficher 4 cartes d\'élévation', () => {
    component['loading'].set(false);
    fixture.detectChanges();

    const cards = fixture.nativeElement.querySelectorAll('.elevation-card');
    expect(cards.length).toBe(4);
  });

  /* ==========================================================================
   * Données — animation
   * ========================================================================== */

  it('devrait avoir 6 entrées dans le vocabulaire d\'animation', () => {
    const vocab = (component as any).animationVocabulary;
    expect(vocab.length).toBe(6);
  });

  /* ==========================================================================
   * Données — conventions
   * ========================================================================== */

  it('devrait avoir 4 conventions de code', () => {
    const convs = (component as any).codeConventions;
    expect(convs.length).toBe(4);
  });

  /* ==========================================================================
   * Données — tests
   * ========================================================================== */

  it('devrait avoir 4 principes de test', () => {
    const principles = (component as any).testPrinciples;
    expect(principles.length).toBe(4);
  });

  /* ==========================================================================
   * Données — documentation
   * ========================================================================== */

  it('devrait avoir 4 ressources de documentation', () => {
    const docs = (component as any).docResources;
    expect(docs.length).toBe(4);
  });

  /* ==========================================================================
   * Méthode retry()
   * ========================================================================== */

  it('retry() devrait réinitialiser loading à true', () => {
    component['loading'].set(false);
    component['retry']();
    expect(component['loading']()).toBeTrue();
  });

  it('retry() devrait effacer le message d\'erreur', () => {
    component['loading'].set(false);
    component['error'].set('Ancienne erreur');
    expect(component['error']()).toBe('Ancienne erreur');

    component['retry']();
    expect(component['error']()).toBeNull();
  });
});
