import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideRouter } from '@angular/router';
import { UiEmptyStateComponent } from './ui-empty-state.component';
import { UiButtonComponent } from '../ui-button/ui-button.component';

describe('UiEmptyStateComponent', () => {
  let component: UiEmptyStateComponent;
  let fixture: ComponentFixture<UiEmptyStateComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [UiEmptyStateComponent, UiButtonComponent],
      providers: [provideRouter([])],
    }).compileComponents();

    fixture = TestBed.createComponent(UiEmptyStateComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('devrait créer le composant', () => {
    expect(component).toBeTruthy();
  });

  it('devrait afficher le titre quand fourni', () => {
    component.title = 'Aucun résultat';
    fixture.detectChanges();
    const titleElement: HTMLElement = fixture.nativeElement.querySelector('.ui-empty-state__title');
    expect(titleElement).toBeTruthy();
    expect(titleElement.textContent?.trim()).toBe('Aucun résultat');
  });

  it("devrait ne pas afficher le titre quand vide", () => {
    component.title = '';
    fixture.detectChanges();
    const titleElement: HTMLElement = fixture.nativeElement.querySelector('.ui-empty-state__title');
    expect(titleElement).toBeFalsy();
  });

  it('devrait afficher la description quand fournie', () => {
    component.description = "Essayez de modifier vos filtres pour obtenir plus de résultats.";
    fixture.detectChanges();
    const descElement: HTMLElement = fixture.nativeElement.querySelector('.ui-empty-state__description');
    expect(descElement).toBeTruthy();
    expect(descElement.textContent?.trim()).toBe("Essayez de modifier vos filtres pour obtenir plus de résultats.");
  });

  it("devrait ne pas afficher la description quand vide", () => {
    component.description = '';
    fixture.detectChanges();
    const descElement: HTMLElement = fixture.nativeElement.querySelector('.ui-empty-state__description');
    expect(descElement).toBeFalsy();
  });

  it('devrait afficher le bouton primaire quand primaryActionLabel est fourni', () => {
    component.primaryActionLabel = "Créer un agent";
    fixture.detectChanges();
    const button: HTMLElement = fixture.nativeElement.querySelector('app-ui-button');
    expect(button).toBeTruthy();
    expect(button.textContent?.trim()).toBe("Créer un agent");
  });

  it("ne devrait pas afficher le bouton primaire quand le label est vide", () => {
    component.primaryActionLabel = '';
    fixture.detectChanges();
    const button: HTMLElement = fixture.nativeElement.querySelector('app-ui-button');
    expect(button).toBeFalsy();
  });

  it('devrait émettre primaryAction au clic sur le bouton primaire', () => {
    component.primaryActionLabel = "Créer un agent";
    fixture.detectChanges();

    let emitted = false;
    component.primaryAction.subscribe(() => { emitted = true; });

    const button: HTMLElement = fixture.nativeElement.querySelector('app-ui-button');
    button.click();
    expect(emitted).toBeTrue();
  });

  it("devrait afficher le lien secondaire quand secondaryActionLabel et secondaryActionRoute sont fournis", () => {
    component.secondaryActionLabel = "Retour à l'accueil";
    component.secondaryActionRoute = '/';
    fixture.detectChanges();
    const link: HTMLAnchorElement = fixture.nativeElement.querySelector('.ui-empty-state__secondary');
    expect(link).toBeTruthy();
    expect(link.textContent?.trim()).toContain("Retour à l'accueil");
  });

  it("devrait ne pas afficher le lien secondaire quand les labels sont vides", () => {
    component.secondaryActionLabel = '';
    component.secondaryActionRoute = '';
    fixture.detectChanges();
    const link: HTMLAnchorElement = fixture.nativeElement.querySelector('.ui-empty-state__secondary');
    expect(link).toBeFalsy();
  });

  it("devrait ne pas afficher le lien secondaire quand seul le label est fourni (route manquante)", () => {
    component.secondaryActionLabel = "Retour";
    component.secondaryActionRoute = '';
    fixture.detectChanges();
    const link: HTMLAnchorElement = fixture.nativeElement.querySelector('.ui-empty-state__secondary');
    expect(link).toBeFalsy();
  });

  it("devrait avoir l'illustration SVG avec aria-hidden", () => {
    const svg: SVGElement = fixture.nativeElement.querySelector('.ui-empty-state__hex');
    expect(svg).toBeTruthy();
    const illustration: HTMLElement = fixture.nativeElement.querySelector('.ui-empty-state__illustration');
    expect(illustration?.getAttribute('aria-hidden')).toBe('true');
  });

  it('devrait avoir le routerLink correct sur le lien secondaire', () => {
    component.secondaryActionLabel = "Explorer les agents";
    component.secondaryActionRoute = '/agents';
    fixture.detectChanges();
    const link: HTMLAnchorElement = fixture.nativeElement.querySelector('.ui-empty-state__secondary');
    expect(link).toBeTruthy();
    expect(link.getAttribute('ng-reflect-router-link')).toBe('/agents');
  });
});
