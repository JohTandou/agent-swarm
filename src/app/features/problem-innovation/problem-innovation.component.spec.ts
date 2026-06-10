import { ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { ProblemInnovationComponent } from './problem-innovation.component';
import { UiSkeletonComponent } from '@shared/components/ui-skeleton/ui-skeleton.component';

describe('ProblemInnovationComponent', () => {
  let component: ProblemInnovationComponent;
  let fixture: ComponentFixture<ProblemInnovationComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ProblemInnovationComponent, UiSkeletonComponent],
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
   * État loading
   * ========================================================================== */

  it('devrait afficher le shimmer skeleton quand loading est true', () => {
    const loader: HTMLElement = fixture.nativeElement.querySelector('.page-loader');
    expect(loader).toBeTruthy();
  });

  it('devrait afficher le skeleton-title dans l\'état loading', () => {
    const skeletons = fixture.debugElement.queryAll(By.css('app-ui-skeleton'));
    const titleSkeleton = skeletons.find(
      (el) => el.componentInstance.variant === 'text' && el.componentInstance.width === '280px'
    );
    expect(titleSkeleton).toBeTruthy();
  });

  it('devrait afficher les skeleton-cards dans l\'état loading', () => {
    const skeletons = fixture.debugElement.queryAll(By.css('app-ui-skeleton'));
    const cardSkeletons = skeletons.filter(
      (el) => el.componentInstance.variant === 'card' && el.componentInstance.height === '180px'
    );
    expect(cardSkeletons.length).toBe(3);
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

  it('ne devrait pas afficher le loader quand il y a une erreur', () => {
    component['loading'].set(false);
    component['error'].set('Erreur');
    fixture.detectChanges();

    const loader = fixture.nativeElement.querySelector('.page-loader');
    expect(loader).toBeFalsy();
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

  it('devrait afficher la section comparison', () => {
    component['loading'].set(false);
    fixture.detectChanges();

    const comparison: HTMLElement = fixture.nativeElement.querySelector('.comparison');
    expect(comparison).toBeTruthy();
  });

  it('devrait afficher la section systems', () => {
    component['loading'].set(false);
    fixture.detectChanges();

    const systems: HTMLElement = fixture.nativeElement.querySelector('.systems');
    expect(systems).toBeTruthy();
  });

  it('devrait afficher la section pillars', () => {
    component['loading'].set(false);
    fixture.detectChanges();

    const pillars: HTMLElement = fixture.nativeElement.querySelector('.pillars');
    expect(pillars).toBeTruthy();
  });

  it('devrait afficher la section costs', () => {
    component['loading'].set(false);
    fixture.detectChanges();

    const costs: HTMLElement = fixture.nativeElement.querySelector('.costs');
    expect(costs).toBeTruthy();
  });

  it('devrait afficher la section models', () => {
    component['loading'].set(false);
    fixture.detectChanges();

    const models: HTMLElement = fixture.nativeElement.querySelector('.models');
    expect(models).toBeTruthy();
  });

  it('devrait afficher la section limits', () => {
    component['loading'].set(false);
    fixture.detectChanges();

    const limits: HTMLElement = fixture.nativeElement.querySelector('.limits');
    expect(limits).toBeTruthy();
  });

  it('devrait afficher la section audience', () => {
    component['loading'].set(false);
    fixture.detectChanges();

    const audience: HTMLElement = fixture.nativeElement.querySelector('.audience');
    expect(audience).toBeTruthy();
  });

  it('devrait afficher le footer', () => {
    component['loading'].set(false);
    fixture.detectChanges();

    const footer: HTMLElement = fixture.nativeElement.querySelector('.page-footer');
    expect(footer).toBeTruthy();
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

  it('comparisonData devrait avoir 5 entrées', () => {
    const data = (component as any).comparisonData;
    expect(data.length).toBe(5);
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

  it('devrait afficher 5 cartes de comparaison dans la section comparison', () => {
    component['loading'].set(false);
    fixture.detectChanges();

    const cards = fixture.nativeElement.querySelectorAll('.comparison-card');
    expect(cards.length).toBe(5);
  });

  it('chaque carte de comparaison devrait avoir une amélioration visible', () => {
    component['loading'].set(false);
    fixture.detectChanges();

    const improvements = fixture.nativeElement.querySelectorAll('.comparison-card__improvement');
    expect(improvements.length).toBe(5);
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
    component['loading'].set(false);
    fixture.detectChanges();

    const cards = fixture.nativeElement.querySelectorAll('.pillar-card');
    expect(cards.length).toBe(7);
  });

  /* ==========================================================================
   * Données — systemComparisons
   * ========================================================================== */

  it('systemComparisons devrait inclure la Swarm', () => {
    const systems = (component as any).systemComparisons;
    const swarmEntry = systems.find((s: any) => s.system === 'Swarm');
    expect(swarmEntry).toBeTruthy();
  });

  it('la ligne Swarm devrait avoir la classe systems__row--swarm', () => {
    component['loading'].set(false);
    fixture.detectChanges();

    const swarmRow: HTMLElement = fixture.nativeElement.querySelector('.systems__row--swarm');
    expect(swarmRow).toBeTruthy();
    const name = swarmRow.querySelector('.systems__cell-name');
    expect(name?.textContent?.trim()).toBe('Swarm');
  });

  /* ==========================================================================
   * Données — costData
   * ========================================================================== */

  it('costData devrait avoir 4 entrées', () => {
    const costs = (component as any).costData;
    expect(costs.length).toBe(4);
  });

  it('les routes SIMPLE, ADAPT, MEDIUM et FULL devraient être représentées', () => {
    const costs = (component as any).costData;
    const routes = costs.map((c: any) => c.route);
    expect(routes).toEqual(['SIMPLE', 'ADAPT', 'MEDIUM', 'FULL']);
  });

  /* ==========================================================================
   * Données — targetAudiences
   * ========================================================================== */

  it('targetAudiences devrait avoir 4 audiences cibles', () => {
    const audiences = (component as any).targetAudiences;
    expect(audiences.length).toBe(4);
  });

  it('devrait rendre 4 cartes audience', () => {
    component['loading'].set(false);
    fixture.detectChanges();

    const cards = fixture.nativeElement.querySelectorAll('.audience-card');
    expect(cards.length).toBe(4);
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

  it('retry() devrait relancer le chargement avec loading=true', () => {
    component['loading'].set(false);
    component['retry']();

    expect(component['loading']()).toBeTrue();
    expect(component['error']()).toBeNull();
  });
});
