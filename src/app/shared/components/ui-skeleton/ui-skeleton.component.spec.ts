import { ComponentFixture, TestBed } from '@angular/core/testing';
import { UiSkeletonComponent, SkeletonVariant } from './ui-skeleton.component';

describe('UiSkeletonComponent', () => {
  let component: UiSkeletonComponent;
  let fixture: ComponentFixture<UiSkeletonComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [UiSkeletonComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(UiSkeletonComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  /** Helper : retourne l'élément DOM .ui-skeleton après un éventuel re-render */
  function getSkeletonEl(): HTMLElement {
    return fixture.nativeElement.querySelector('.ui-skeleton');
  }

  it('devrait créer le composant', () => {
    expect(component).toBeTruthy();
  });

  it("devrait appliquer le variant par défaut (text)", () => {
    const el = getSkeletonEl();
    expect(el).toBeTruthy();
    expect(el.classList).toContain('ui-skeleton--text');
  });

  it("devrait appliquer chaque variant via la classe CSS", () => {
    const variants: SkeletonVariant[] = ['text', 'card', 'circle', 'table-row'];

    for (const variant of variants) {
      component.variant = variant;
      fixture.detectChanges();
      const el = getSkeletonEl();
      expect(el).toBeTruthy();
      expect(el.classList).toContain(`ui-skeleton--${variant}`);
    }
  });

  it("devrait appliquer la largeur personnalisée", () => {
    component.width = '300px';
    fixture.detectChanges();
    const el = getSkeletonEl();
    expect(el.style.width).toBe('300px');
  });

  it("devrait appliquer la hauteur personnalisée", () => {
    component.height = '120px';
    fixture.detectChanges();
    const el = getSkeletonEl();
    expect(el.style.height).toBe('120px');
  });

  it("devrait appliquer le délai d'animation", () => {
    component.delay = 240;
    fixture.detectChanges();
    const el = getSkeletonEl();
    expect(el.style.animationDelay).toBe('240ms');
  });

  it('devrait avoir aria-hidden="true"', () => {
    const el = getSkeletonEl();
    expect(el.getAttribute('aria-hidden')).toBe('true');
  });

  it("devrait avoir la classe shimmer", () => {
    const el = getSkeletonEl();
    expect(el.classList).toContain('ui-skeleton');

    const animationName = window.getComputedStyle(el).animationName;
    expect(animationName).toContain('shimmer');
  });

  it("devrait exposer la largeur par défaut à 100%", () => {
    const el = getSkeletonEl();
    expect(el.style.width).toBe('100%');
  });

  it("devrait exposer la hauteur par défaut à auto", () => {
    const el = getSkeletonEl();
    expect(el.style.height).toBe('auto');
  });
});
