import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ScrollProgressComponent } from './scroll-progress.component';

describe('ScrollProgressComponent', () => {
  let component: ScrollProgressComponent;
  let fixture: ComponentFixture<ScrollProgressComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ScrollProgressComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(ScrollProgressComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('devrait créer le composant', () => {
    expect(component).toBeTruthy();
  });

  it('devrait initialiser la progression à 0', () => {
    const bar = fixture.nativeElement.querySelector('.scroll-progress');
    expect(bar).toBeTruthy();
    expect(bar.style.transform).toBe('scaleX(0)');
  });

  it('devrait avoir le rôle progressbar avec les bons attributs aria', () => {
    const bar: HTMLElement = fixture.nativeElement.querySelector('.scroll-progress');
    expect(bar.getAttribute('role')).toBe('progressbar');
    expect(bar.getAttribute('aria-valuenow')).toBe('0');
    expect(bar.getAttribute('aria-valuemin')).toBe('0');
    expect(bar.getAttribute('aria-valuemax')).toBe('100');
    expect(bar.getAttribute('aria-label')).toBe('Progression de lecture');
  });

  it('devrait avoir le gradient ambré en fond', () => {
    const bar: HTMLElement = fixture.nativeElement.querySelector('.scroll-progress');
    const bg = window.getComputedStyle(bar).backgroundImage || bar.style.background;
    expect(bg).toContain('gradient');
  });

  it('devrait avoir transform-origin: left', () => {
    const bar: HTMLElement = fixture.nativeElement.querySelector('.scroll-progress');
    const to = window.getComputedStyle(bar).transformOrigin;
    expect(to).toContain('0px');
  });

  it('devrait avoir pointer-events: none', () => {
    const bar: HTMLElement = fixture.nativeElement.querySelector('.scroll-progress');
    const pe = window.getComputedStyle(bar).pointerEvents;
    expect(pe).toBe('none');
  });
});
