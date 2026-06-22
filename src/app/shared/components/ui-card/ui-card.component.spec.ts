import { ComponentFixture, TestBed } from '@angular/core/testing';
import { Component } from '@angular/core';
import { UiCardComponent } from './ui-card.component';

describe('UiCardComponent', () => {
  let component: UiCardComponent;
  let fixture: ComponentFixture<UiCardComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [UiCardComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(UiCardComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  // -----------------------------------------------------------------------
  // Création
  // -----------------------------------------------------------------------

  it('devrait créer le composant', () => {
    expect(component).toBeTruthy();
  });

  // -----------------------------------------------------------------------
  // Variant par défaut
  // -----------------------------------------------------------------------

  it('devrait appliquer le variant par défaut (default)', () => {
    const cardEl: HTMLElement = fixture.nativeElement.querySelector('.ui-card');
    expect(cardEl).toBeTruthy();
    // Le variant default n'ajoute aucune classe modificateur
    expect(cardEl.classList.contains('ui-card--glass')).toBeFalse();
    expect(cardEl.classList.contains('ui-card--hover')).toBeFalse();
  });

  // -----------------------------------------------------------------------
  // Variant glass
  // -----------------------------------------------------------------------

  it('devrait appliquer le variant glass', () => {
    component.variant = 'glass';
    fixture.detectChanges();

    const cardEl: HTMLElement = fixture.nativeElement.querySelector('.ui-card');
    expect(cardEl.classList.contains('ui-card--glass')).toBeTrue();
  });

  // -----------------------------------------------------------------------
  // Variant hover
  // -----------------------------------------------------------------------

  it('devrait appliquer le variant hover', () => {
    component.variant = 'hover';
    fixture.detectChanges();

    const cardEl: HTMLElement = fixture.nativeElement.querySelector('.ui-card');
    expect(cardEl.classList.contains('ui-card--hover')).toBeTrue();
  });

  // -----------------------------------------------------------------------
  // Variant bento sur le host
  // -----------------------------------------------------------------------

  it('devrait appliquer le variant bento sur le host', () => {
    component.variant = 'bento';
    fixture.detectChanges();

    const hostEl: HTMLElement = fixture.nativeElement;
    expect(hostEl.classList.contains('ui-card--bento')).toBeTrue();
  });

  it('ne devrait pas appliquer bento quand le variant est différent', () => {
    component.variant = 'default';
    fixture.detectChanges();

    const hostEl: HTMLElement = fixture.nativeElement;
    expect(hostEl.classList.contains('ui-card--bento')).toBeFalse();
  });

  // -----------------------------------------------------------------------
  // Padding
  // -----------------------------------------------------------------------

  it('devrait appliquer le padding md par défaut', () => {
    const cardEl: HTMLElement = fixture.nativeElement.querySelector('.ui-card');
    expect(cardEl.classList.contains('ui-card--padding-md')).toBeTrue();
  });

  it('devrait appliquer le padding personnalisé', () => {
    component.padding = 'lg';
    fixture.detectChanges();

    const cardEl: HTMLElement = fixture.nativeElement.querySelector('.ui-card');
    expect(cardEl.classList.contains('ui-card--padding-lg')).toBeTrue();
    expect(cardEl.classList.contains('ui-card--padding-md')).toBeFalse();
  });

  it('devrait appliquer le padding none', () => {
    component.padding = 'none';
    fixture.detectChanges();

    const cardEl: HTMLElement = fixture.nativeElement.querySelector('.ui-card');
    expect(cardEl.classList.contains('ui-card--padding-none')).toBeTrue();
  });

  // -----------------------------------------------------------------------
  // Clickable
  // -----------------------------------------------------------------------

  it('devrait appliquer clickable', () => {
    component.clickable = true;
    fixture.detectChanges();

    const cardEl: HTMLElement = fixture.nativeElement.querySelector('.ui-card');
    expect(cardEl.classList.contains('ui-card--clickable')).toBeTrue();
  });

  it('ne devrait pas appliquer clickable par défaut', () => {
    const cardEl: HTMLElement = fixture.nativeElement.querySelector('.ui-card');
    expect(cardEl.classList.contains('ui-card--clickable')).toBeFalse();
  });

  // -----------------------------------------------------------------------
  // Highlight
  // -----------------------------------------------------------------------

  it('devrait appliquer highlight', () => {
    component.highlight = true;
    fixture.detectChanges();

    const cardEl: HTMLElement = fixture.nativeElement.querySelector('.ui-card');
    expect(cardEl.classList.contains('ui-card--highlight')).toBeTrue();
  });

  it('ne devrait pas appliquer highlight par défaut', () => {
    const cardEl: HTMLElement = fixture.nativeElement.querySelector('.ui-card');
    expect(cardEl.classList.contains('ui-card--highlight')).toBeFalse();
  });

  // -----------------------------------------------------------------------
  // ng-content — projection de contenu
  // -----------------------------------------------------------------------

  it('devrait projeter le contenu via ng-content', () => {
    // On crée un composant hôte qui wrappe app-ui-card avec du contenu
    @Component({
      standalone: true,
      imports: [UiCardComponent],
      template: `<app-ui-card><p class="test-content">Contenu projeté</p></app-ui-card>`,
    })
    class HostComponent {}

    const hostFixture = TestBed.createComponent(HostComponent);
    hostFixture.detectChanges();

    const projectedEl = hostFixture.nativeElement.querySelector('.test-content');
    expect(projectedEl).toBeTruthy();
    expect(projectedEl.textContent?.trim()).toBe('Contenu projeté');
  });
});
