import { ComponentFixture, TestBed } from '@angular/core/testing';
import { signal } from '@angular/core';
import { provideRouter } from '@angular/router';
import { NO_ERRORS_SCHEMA } from '@angular/core';
import { HomepageComponent } from './homepage.component';
import { LanguageService } from '../../shared/services/language.service';

describe('HomepageComponent', () => {
  let component: HomepageComponent;
  let fixture: ComponentFixture<HomepageComponent>;

  beforeEach(async () => {
    sessionStorage.clear();
    await TestBed.configureTestingModule({
      imports: [HomepageComponent],
      providers: [
        provideRouter([]),
        LanguageService,
      ],
      /* SwarmGraphComponent charge D3 dynamiquement — ignoré en test unitaire */
      schemas: [NO_ERRORS_SCHEMA],
    }).compileComponents();

    fixture = TestBed.createComponent(HomepageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('devrait créer le composant', () => {
    expect(component).toBeTruthy();
  });

  it('devrait avoir un conteneur principal avec la classe homepage', () => {
    const mainEl: HTMLElement = fixture.nativeElement.querySelector('.homepage');
    expect(mainEl).toBeTruthy();
  });

  /* ── Hero ── */

  it('ne devrait pas afficher le badge statut (supprimé intentionnellement)', () => {
    const badge: HTMLElement = fixture.nativeElement.querySelector('.homepage__badge');
    expect(badge).toBeNull();
  });
  it('devrait afficher la tagline', () => {
    const tagline: HTMLElement = fixture.nativeElement.querySelector('.homepage__tagline');
    expect(tagline).toBeTruthy();
    expect((tagline.textContent ?? '').replace(/\u00A0/g, ' ')).toContain('code, teste, review et déploie');
  });

  it('devrait afficher le résumé exécutif en 2 phrases', () => {
    const paragraphs = fixture.nativeElement.querySelectorAll('.homepage__summary-text');
    expect(paragraphs.length).toBe(2);
  });

  it('devrait avoir un indicateur de scroll', () => {
    const scrollHint: HTMLElement = fixture.nativeElement.querySelector('.homepage__scroll-hint');
    expect(scrollHint).toBeTruthy();
    const scrollText: HTMLElement = fixture.nativeElement.querySelector('.homepage__scroll-text');
    expect(scrollText.textContent?.trim()).toBe('Explorer');
  });

  /* ── Navigation ── */

  it('devrait avoir 4 cartes de navigation', () => {
    const navCards = fixture.nativeElement.querySelectorAll('.homepage__nav-card');
    expect(navCards.length).toBe(4);
  });

  it('chaque carte de navigation devrait pointer vers une route', () => {
    const navCards: NodeListOf<HTMLAnchorElement> =
      fixture.nativeElement.querySelectorAll('.homepage__nav-card');
    const routes = Array.from(navCards).map((a) => a.getAttribute('href'));
    expect(routes).toContain('/agents');
    expect(routes).toContain('/workflow');
    expect(routes).toContain('/skills');
    expect(routes).toContain('/outils-mcp');
  });

  it('devrait afficher les titres des cartes de navigation', () => {
    const titles: NodeListOf<Element> = fixture.nativeElement.querySelectorAll('.homepage__nav-title');
    const titleTexts = Array.from(titles).map((t: Element) => (t.textContent ?? '').trim());
    expect(titleTexts).toContain('Agents');
    expect(titleTexts).toContain('Workflow');
    expect(titleTexts).toContain('Skills');
    expect(titleTexts).toContain('Outils MCP');
  });

  /* ── Footer ── */

  it('devrait avoir un footer', () => {
    const footer: HTMLElement = fixture.nativeElement.querySelector('.homepage__footer');
    expect(footer).toBeTruthy();
    expect(footer.textContent).toContain('pipeline d\'agents IA');
  });

});