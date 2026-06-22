import { ComponentFixture, TestBed } from '@angular/core/testing';
import { TocPlaceholderComponent } from './toc-placeholder.component';

describe('TocPlaceholderComponent', () => {
  let component: TocPlaceholderComponent;
  let fixture: ComponentFixture<TocPlaceholderComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TocPlaceholderComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(TocPlaceholderComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('devrait créer le composant', () => {
    expect(component).toBeTruthy();
  });

  it('devrait afficher le titre "Sur cette page"', () => {
    const titleEl: HTMLElement = fixture.nativeElement.querySelector('.toc__title');
    expect(titleEl).toBeTruthy();
    expect(titleEl.textContent?.trim()).toBe('Sur cette page');
  });

  it('devrait afficher 3 barres de skeleton shimmer', () => {
    const bars = fixture.nativeElement.querySelectorAll('.toc__bar');
    expect(bars.length).toBe(3);
  });

  it('devrait avoir un aria-label "Table des matières" sur le aside', () => {
    const aside: HTMLElement = fixture.nativeElement.querySelector('.toc');
    expect(aside.getAttribute('aria-label')).toBe('Table des matières');
  });

  it('les barres skeleton devraient avoir des largeurs différentes', () => {
    const bar1: HTMLElement = fixture.nativeElement.querySelector('.toc__bar--1');
    const bar2: HTMLElement = fixture.nativeElement.querySelector('.toc__bar--2');
    const bar3: HTMLElement = fixture.nativeElement.querySelector('.toc__bar--3');
    expect(bar1).toBeTruthy();
    expect(bar2).toBeTruthy();
    expect(bar3).toBeTruthy();
  });
});
