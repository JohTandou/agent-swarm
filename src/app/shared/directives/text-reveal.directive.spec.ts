import { Component, ViewChild } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { TextRevealDirective } from './text-reveal.directive';

/** Composant hôte minimal avec un titre */
@Component({
  standalone: true,
  imports: [TextRevealDirective],
  template: `
    <h1 appTextReveal [revealDelay]="100" id="test-title">
      la Swarm orchestre vos agents
    </h1>
  `,
})
class TestHostComponent {
  @ViewChild(TextRevealDirective, { static: true })
  directive!: TextRevealDirective;
}

/** Composant hôte avec texte vide */
@Component({
  standalone: true,
  imports: [TextRevealDirective],
  template: `<p appTextReveal id="empty-text"></p>`,
})
class EmptyHostComponent {}

/** Composant hôte sans revealDelay (utilise la valeur par défaut) */
@Component({
  standalone: true,
  imports: [TextRevealDirective],
  template: `<h2 appTextReveal id="default-delay">Texte simple</h2>`,
})
class DefaultDelayHostComponent {}

describe('TextRevealDirective', () => {
  // =========================================================================
  // Test 1 : la directive découpe le texte en mots dans des <span>
  // =========================================================================
  it('devrait découper le texte en spans individuelles par mot', () => {
    const fixture: ComponentFixture<TestHostComponent> =
      TestBed.configureTestingModule({
        imports: [TestHostComponent],
      }).createComponent(TestHostComponent);
    fixture.detectChanges();

    const title = (fixture.nativeElement as HTMLElement).querySelector('#test-title')!;
    const spans = title.querySelectorAll('span');
    // "la Swarm orchestre vos agents" = 5 mots
    expect(spans.length).toBe(5);
    expect(spans[0].textContent).toContain('Le');
    expect(spans[1].textContent).toContain('Swarm');
  });

  // =========================================================================
  // Test 2 : les spans ont l'opacité initiale à 0 et blur(4px)
  // =========================================================================
  it('devrait initialiser les spans avec opacité 0 et flou', () => {
    const fixture: ComponentFixture<TestHostComponent> =
      TestBed.configureTestingModule({
        imports: [TestHostComponent],
      }).createComponent(TestHostComponent);
    fixture.detectChanges();

    const title = (fixture.nativeElement as HTMLElement).querySelector('#test-title')!;
    const firstSpan = title.querySelector('span') as HTMLElement;
    expect(firstSpan.style.opacity).toBe('0');
    expect(firstSpan.style.filter).toBe('blur(4px)');
    expect(firstSpan.style.transform).toBe('translateY(16px)');
  });

  // =========================================================================
  // Test 3 : ne jette pas d'erreur avec un texte vide
  // =========================================================================
  it('ne devrait pas jeter d\'erreur avec un texte vide', () => {
    const fixture: ComponentFixture<EmptyHostComponent> =
      TestBed.configureTestingModule({
        imports: [EmptyHostComponent],
      }).createComponent(EmptyHostComponent);

    expect(() => fixture.detectChanges()).not.toThrow();
    const el = (fixture.nativeElement as HTMLElement).querySelector('#empty-text')!;
    expect(el.children.length).toBe(0);
  });

  // =========================================================================
  // Test 4 : respecte la valeur revealDelay passée en input
  // =========================================================================
  it('devrait accepter revealDelay via l\'input', () => {
    const fixture: ComponentFixture<TestHostComponent> =
      TestBed.configureTestingModule({
        imports: [TestHostComponent],
      }).createComponent(TestHostComponent);
    fixture.detectChanges();

    expect(fixture.componentInstance.directive.revealDelay).toBe(100);
  });

  // =========================================================================
  // Test 5 : la valeur par défaut de revealDelay est 0
  // =========================================================================
  it('devrait utiliser 0 comme revealDelay par défaut', () => {
    const fixture: ComponentFixture<DefaultDelayHostComponent> =
      TestBed.configureTestingModule({
        imports: [DefaultDelayHostComponent],
      }).createComponent(DefaultDelayHostComponent);
    fixture.detectChanges();

    // L'élément doit contenir des spans même sans revealDelay explicite
    const el = (fixture.nativeElement as HTMLElement).querySelector('#default-delay')!;
    const spans = el.querySelectorAll('span');
    expect(spans.length).toBeGreaterThan(0);
  });

  // =========================================================================
  // Test 6 : les spans ont des transition-delay croissants
  // =========================================================================
  it('devrait appliquer des transition-delay croissants (stagger)', () => {
    const fixture: ComponentFixture<TestHostComponent> =
      TestBed.configureTestingModule({
        imports: [TestHostComponent],
      }).createComponent(TestHostComponent);
    fixture.detectChanges();

    const title = (fixture.nativeElement as HTMLElement).querySelector('#test-title')!;
    const spans = title.querySelectorAll('span');

    // Premier span : revealDelay(100) + 0*80 = 100ms
    expect(spans[0].style.transitionDelay).toBe('100ms');
    // Deuxième span : 100 + 1*80 = 180ms
    expect(spans[1].style.transitionDelay).toBe('180ms');
    // Troisième span : 100 + 2*80 = 260ms
    expect(spans[2].style.transitionDelay).toBe('260ms');
  });

  // =========================================================================
  // Test 7 : la directive est standalone
  // =========================================================================
  it('devrait être utilisable comme directive standalone', () => {
    const fixture: ComponentFixture<TestHostComponent> =
      TestBed.configureTestingModule({
        imports: [TestHostComponent],
      }).createComponent(TestHostComponent);
    fixture.detectChanges();

    expect(fixture.componentInstance.directive).toBeDefined();
    expect(fixture.componentInstance.directive instanceof TextRevealDirective).toBeTrue();
  });
});
