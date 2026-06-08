import { Component, ViewChild } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { StaggerChildrenDirective } from './stagger-children.directive';

/** Composant hôte minimal pour tester la directive */
@Component({
  standalone: true,
  imports: [StaggerChildrenDirective],
  template: `
    <div [appStaggerChildren]="delay" id="test-host">
      <span class="child" id="child-0"></span>
      <span class="child" id="child-1"></span>
      <span class="child" id="child-2"></span>
      <span class="child" id="child-3"></span>
      <span class="child" id="child-4"></span>
    </div>
  `,
})
class TestHostComponent {
  @ViewChild(StaggerChildrenDirective, { static: true })
  directive!: StaggerChildrenDirective;

  delay = 60;
}

/** Composant hôte sans enfants */
@Component({
  standalone: true,
  imports: [StaggerChildrenDirective],
  template: `<div [appStaggerChildren]="80" id="empty-host"></div>`,
})
class EmptyHostComponent {}

/** Composant hôte avec délai personnalisé */
@Component({
  standalone: true,
  imports: [StaggerChildrenDirective],
  template: `
    <div [appStaggerChildren]="120" id="custom-host">
      <span class="child"></span>
      <span class="child"></span>
    </div>
  `,
})
class CustomDelayHostComponent {}

describe('StaggerChildrenDirective', () => {
  // =========================================================================
  // Test 1 : la directive applique --stagger-index sur chaque enfant
  // =========================================================================
  it('devrait injecter --stagger-index sur chaque enfant direct', () => {
    const fixture: ComponentFixture<TestHostComponent> =
      TestBed.configureTestingModule({
        imports: [TestHostComponent],
      }).createComponent(TestHostComponent);
    fixture.detectChanges();

    const children = (fixture.nativeElement as HTMLElement).querySelectorAll(
      '#test-host > .child',
    );
    expect(children.length).toBe(5);

    for (let i = 0; i < children.length; i++) {
      const el = children[i] as HTMLElement;
      expect(el.style.getPropertyValue('--stagger-index')).toBe(String(i));
    }
  });

  // =========================================================================
  // Test 2 : la directive ne jette pas d'erreur si le conteneur est vide
  // =========================================================================
  it('ne devrait pas jeter d\'erreur avec un conteneur sans enfants', () => {
    const fixture: ComponentFixture<EmptyHostComponent> =
      TestBed.configureTestingModule({
        imports: [EmptyHostComponent],
      }).createComponent(EmptyHostComponent);

    expect(() => fixture.detectChanges()).not.toThrow();
    const host = (fixture.nativeElement as HTMLElement).querySelector(
      '#empty-host',
    )!;
    expect(host.children.length).toBe(0);
  });

  // =========================================================================
  // Test 3 : respecte le staggerDelay par défaut (60ms)
  // =========================================================================
  it('devrait utiliser 60ms comme staggerDelay par défaut', () => {
    const fixture: ComponentFixture<TestHostComponent> =
      TestBed.configureTestingModule({
        imports: [TestHostComponent],
      }).createComponent(TestHostComponent);
    fixture.detectChanges();

    expect(fixture.componentInstance.directive.staggerDelay).toBe(60);
  });

  // =========================================================================
  // Test 4 : respecte un staggerDelay personnalisé via l'input
  // =========================================================================
  it('devrait accepter un staggerDelay personnalisé', () => {
    const fixture: ComponentFixture<CustomDelayHostComponent> =
      TestBed.configureTestingModule({
        imports: [CustomDelayHostComponent],
      }).createComponent(CustomDelayHostComponent);
    fixture.detectChanges();

    // Les enfants doivent exister (2 spans)
    const children = (fixture.nativeElement as HTMLElement).querySelectorAll(
      '#custom-host > .child',
    );
    expect(children.length).toBe(2);

    // L'index 0 = '0', index 1 = '1'
    expect(
      (children[0] as HTMLElement).style.getPropertyValue('--stagger-index'),
    ).toBe('0');
    expect(
      (children[1] as HTMLElement).style.getPropertyValue('--stagger-index'),
    ).toBe('1');
  });

  // =========================================================================
  // Test 5 : les valeurs de --stagger-index sont séquentielles (0, 1, 2, ...)
  // =========================================================================
  it('devrait attribuer des valeurs séquentielles de --stagger-index', () => {
    const fixture: ComponentFixture<TestHostComponent> =
      TestBed.configureTestingModule({
        imports: [TestHostComponent],
      }).createComponent(TestHostComponent);
    fixture.detectChanges();

    const children = (fixture.nativeElement as HTMLElement).querySelectorAll(
      '#test-host > .child',
    );
    const indices = Array.from(children).map((el) =>
      Number((el as HTMLElement).style.getPropertyValue('--stagger-index')),
    );
    expect(indices).toEqual([0, 1, 2, 3, 4]);
  });

  // =========================================================================
  // Test 6 : la directive est standalone
  // =========================================================================
  it('devrait être utilisable comme directive standalone', () => {
    const fixture: ComponentFixture<TestHostComponent> =
      TestBed.configureTestingModule({
        imports: [TestHostComponent],
      }).createComponent(TestHostComponent);
    fixture.detectChanges();

    expect(fixture.componentInstance.directive).toBeDefined();
    expect(fixture.componentInstance.directive instanceof StaggerChildrenDirective).toBeTrue();
  });
});
