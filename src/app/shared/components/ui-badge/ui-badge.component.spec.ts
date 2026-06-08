import { ComponentFixture, TestBed } from '@angular/core/testing';
import { Component } from '@angular/core';
import { UiBadgeComponent } from './ui-badge.component';
import type { BadgeVariant } from './ui-badge.component';

describe('UiBadgeComponent', () => {
  let component: UiBadgeComponent;
  let fixture: ComponentFixture<UiBadgeComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [UiBadgeComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(UiBadgeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  // 1. Création
  it('devrait créer le composant', () => {
    expect(component).toBeTruthy();
  });

  // 2. Classe ui-badge
  it('devrait avoir la classe ui-badge', () => {
    const badge: HTMLElement = fixture.nativeElement.querySelector('.ui-badge');
    expect(badge).toBeTruthy();
  });

  // 3. Variant par défaut
  it('devrait appliquer le variant par défaut (default)', () => {
    const badge: HTMLElement = fixture.nativeElement.querySelector('.ui-badge');
    expect(badge.classList).toContain('ui-badge--default');
  });

  // 4. Taille par défaut
  it('devrait appliquer la taille par défaut (md)', () => {
    const badge: HTMLElement = fixture.nativeElement.querySelector('.ui-badge');
    expect(badge.classList).toContain('ui-badge--md');
  });

  // 5. Changement de variant
  it("devrait appliquer le variant 'success' via la classe CSS", () => {
    component.variant = 'success';
    fixture.detectChanges();
    const badge: HTMLElement = fixture.nativeElement.querySelector('.ui-badge');
    expect(badge.classList).toContain('ui-badge--success');
  });

  // 6. Changement de taille
  it("devrait appliquer la taille 'sm' via la classe CSS", () => {
    component.size = 'sm';
    fixture.detectChanges();
    const badge: HTMLElement = fixture.nativeElement.querySelector('.ui-badge');
    expect(badge.classList).toContain('ui-badge--sm');
  });

  // 7. Projection de contenu via ng-content
  it("devrait projeter le contenu via ng-content", () => {
    // On crée un composant hôte pour tester la projection
    @Component({
      template: '<app-ui-badge variant="info">Label test</app-ui-badge>',
      standalone: true,
      imports: [UiBadgeComponent],
    })
    class HostComponent {}

    const hostFixture = TestBed.createComponent(HostComponent);
    hostFixture.detectChanges();
    const badge: HTMLElement = hostFixture.nativeElement.querySelector('.ui-badge');
    expect(badge.textContent?.trim()).toBe('Label test');
  });

  // 8. Tous les variants appliquent la bonne classe
  const variants: BadgeVariant[] = ['default', 'success', 'warning', 'error', 'info'];
  variants.forEach((variant) => {
    it(`devrait avoir la classe ui-badge--${variant} pour le variant '${variant}'`, () => {
      component.variant = variant;
      fixture.detectChanges();
      const badge: HTMLElement = fixture.nativeElement.querySelector('.ui-badge');
      expect(badge.classList).toContain(`ui-badge--${variant}`);
    });
  });

  // 9. Toutes les tailles appliquent la bonne classe
  it("devrait avoir la classe ui-badge--md pour la taille 'md'", () => {
    component.size = 'md';
    fixture.detectChanges();
    const badge: HTMLElement = fixture.nativeElement.querySelector('.ui-badge');
    expect(badge.classList).toContain('ui-badge--md');
  });

  it("devrait avoir la classe ui-badge--sm pour la taille 'sm'", () => {
    component.size = 'sm';
    fixture.detectChanges();
    const badge: HTMLElement = fixture.nativeElement.querySelector('.ui-badge');
    expect(badge.classList).toContain('ui-badge--sm');
  });

  // 10. Le badge est bien un élément <span>
  it("devrait être rendu comme un élément <span>", () => {
    const badge: HTMLElement = fixture.nativeElement.querySelector('.ui-badge');
    expect(badge.tagName.toLowerCase()).toBe('span');
  });
});
