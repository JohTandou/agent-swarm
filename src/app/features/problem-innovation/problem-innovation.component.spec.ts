import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ProblemInnovationComponent } from './problem-innovation.component';

describe('ProblemInnovationComponent', () => {
  let component: ProblemInnovationComponent;
  let fixture: ComponentFixture<ProblemInnovationComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ProblemInnovationComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(ProblemInnovationComponent);
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
   * État erreur
   * ========================================================================== */

  it('devrait afficher l\'état d\'erreur quand error est défini', () => {
    component['error'].set('Une erreur est survenue');
    fixture.detectChanges();

    const errorState: HTMLElement = fixture.nativeElement.querySelector('.error-state');
    expect(errorState).toBeTruthy();
  });

  it('devrait afficher le message d\'erreur', () => {
    component['error'].set('Erreur de chargement');
    fixture.detectChanges();

    const message: HTMLElement = fixture.nativeElement.querySelector('.error-state__message');
    expect(message).toBeTruthy();
    expect(message.textContent?.trim()).toBe('Erreur de chargement');
  });

  it('devrait avoir un bouton retry visible dans l\'état d\'erreur', () => {
    component['error'].set('Erreur');
    fixture.detectChanges();

    const button: HTMLElement = fixture.nativeElement.querySelector('.error-state app-ui-button');
    expect(button).toBeTruthy();
    expect(button.textContent?.trim()).toBe('Réessayer');
  });

  /* ==========================================================================
   * État succès
   * ========================================================================== */

  it('devrait afficher le contenu principal', () => {
    fixture.detectChanges();

    const main: HTMLElement = fixture.nativeElement.querySelector('.page');
    expect(main).toBeTruthy();
  });

  it('devrait afficher la section hero', () => {
    fixture.detectChanges();

    const hero: HTMLElement = fixture.nativeElement.querySelector('.hero');
    expect(hero).toBeTruthy();
  });

  it('devrait afficher la section comparison', () => {
    fixture.detectChanges();

    const comparison: HTMLElement = fixture.nativeElement.querySelector('.comparison');
    expect(comparison).toBeTruthy();
  });

  it('devrait afficher la section pillars', () => {
    fixture.detectChanges();

    const pillars: HTMLElement = fixture.nativeElement.querySelector('.pillars');
    expect(pillars).toBeTruthy();
  });

  it('devrait afficher la section costs', () => {
    fixture.detectChanges();

    const costs: HTMLElement = fixture.nativeElement.querySelector('.costs');
    expect(costs).toBeTruthy();
  });

  it('devrait afficher la section models', () => {
    fixture.detectChanges();

    const models: HTMLElement = fixture.nativeElement.querySelector('.models');
    expect(models).toBeTruthy();
  });

  it('devrait afficher la section limits', () => {
    fixture.detectChanges();

    const limits: HTMLElement = fixture.nativeElement.querySelector('.limits');
    expect(limits).toBeTruthy();
  });

  it('chaque section devrait avoir un section-header avec kicker', () => {
    fixture.detectChanges();

    const headers = fixture.nativeElement.querySelectorAll('.section-header');
    expect(headers.length).toBe(5);
    
    const kickers = fixture.nativeElement.querySelectorAll('.section-header__kicker');
    expect(kickers.length).toBe(5);
    
    const titles = fixture.nativeElement.querySelectorAll('.section-header__title');
    expect(titles.length).toBe(5);
  });

  /* ==========================================================================
   * Données — hero
   * ========================================================================== */

  it('devrait avoir un heroTitle défini', () => {
    const title = (component as any).heroTitle as string;
    expect(title).toBeTruthy();
    expect(title).toBe('Pourquoi la Swarm ?');
  });

  it('devrait avoir un heroSubtitle non vide', () => {
    const subtitle = (component as any).heroSubtitle as string;
    expect(subtitle).toBeTruthy();
    expect(subtitle.length).toBeGreaterThan(50);
  });

  /* ==========================================================================
   * Données — comparisonData
   * ========================================================================== */

  it('comparisonData devrait avoir 4 entrées', () => {
    const data = (component as any).comparisonData;
    expect(data.length).toBe(4);
  });

  it('chaque entrée de comparisonData devrait avoir label, withoutSwarm, withSwarm, improvement', () => {
    const data = (component as any).comparisonData;
    for (const entry of data) {
      expect(entry.label).toBeTruthy();
      expect(entry.withoutSwarm).toBeTruthy();
      expect(entry.withSwarm).toBeTruthy();
      expect(entry.improvement).toBeTruthy();
    }
  });

  it('devrait afficher 4 cartes de comparaison dans la section comparison', () => {
    fixture.detectChanges();

    const cards = fixture.nativeElement.querySelectorAll('.comparison-card');
    expect(cards.length).toBe(4);
  });

  it('chaque carte de comparaison devrait avoir une amélioration visible', () => {
    fixture.detectChanges();

    const improvements = fixture.nativeElement.querySelectorAll('.comparison-card__improvement');
    expect(improvements.length).toBe(4);
  });

  /* ==========================================================================
   * Données — pillars
   * ========================================================================== */

  it('devrait avoir 7 piliers d\'innovation', () => {
    const pillars = (component as any).pillars;
    expect(pillars.length).toBe(7);
  });

  it('chaque pilier devrait avoir un titre et une description', () => {
    const pillars = (component as any).pillars;
    for (const pillar of pillars) {
      expect(pillar.title).toBeTruthy();
      expect(pillar.description).toBeTruthy();
    }
  });

  it('devrait rendre 7 cartes de pilier dans la section pillars', () => {
    fixture.detectChanges();

    const cards = fixture.nativeElement.querySelectorAll('.pillar-card');
    expect(cards.length).toBe(7);
  });

  /* ==========================================================================
   * Données — limits
   * ========================================================================== */

  it('limits devrait avoir 3 catégories de limites', () => {
    const limits = (component as any).limits;
    expect(limits.length).toBe(3);
  });

  /* ==========================================================================
   * Données — models
   * ========================================================================== */

  it('devrait exposer les données du modèle unique', () => {
    const modelInfo = (component as any).modelInfo;
    expect(modelInfo).toBeTruthy();
    expect(modelInfo.name).toBe('DeepSeek V4 Pro');
    expect(modelInfo.description).toContain('Modèle unique utilisé par tous les agents');
    expect(modelInfo.costNote).toContain('0,435 $/M tokens');
  });

  /* ==========================================================================
   * Méthode retry()
   * ========================================================================== */

  it('retry() devrait effacer le message d\'erreur', () => {
    component['error'].set('Ancienne erreur');
    expect(component['error']()).toBe('Ancienne erreur');

    component['retry']();
    expect(component['error']()).toBeNull();
  });
});
