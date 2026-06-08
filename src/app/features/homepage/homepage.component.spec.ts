import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideRouter } from '@angular/router';
import { NO_ERRORS_SCHEMA } from '@angular/core';
import { HomepageComponent } from './homepage.component';

describe('HomepageComponent', () => {
  let component: HomepageComponent;
  let fixture: ComponentFixture<HomepageComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [HomepageComponent],
      providers: [provideRouter([])],
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

  it('devrait afficher le badge statut', () => {
    const badge: HTMLElement = fixture.nativeElement.querySelector('.homepage__badge');
    expect(badge).toBeTruthy();
    expect(badge.textContent).toContain('Pipeline d\'agents IA');
    expect(badge.textContent).toContain('Open Source');
  });

  it('devrait afficher la tagline', () => {
    const tagline: HTMLElement = fixture.nativeElement.querySelector('.homepage__tagline');
    expect(tagline).toBeTruthy();
    expect((tagline.textContent ?? '').replace(/\u00A0/g, ' ')).toContain('code, teste, review et déploie');
  });

  it('devrait afficher le résumé exécutif en 3 phrases', () => {
    const paragraphs = fixture.nativeElement.querySelectorAll('.homepage__summary-text');
    expect(paragraphs.length).toBe(3);
  });

  it('devrait avoir un indicateur de scroll', () => {
    const scrollHint: HTMLElement = fixture.nativeElement.querySelector('.homepage__scroll-hint');
    expect(scrollHint).toBeTruthy();
    const scrollText: HTMLElement = fixture.nativeElement.querySelector('.homepage__scroll-text');
    expect(scrollText.textContent?.trim()).toBe('Explorer');
  });

  /* ── Graphe ── */

  it('devrait avoir une section graphe', () => {
    const graphSection: HTMLElement = fixture.nativeElement.querySelector('.homepage__graph');
    expect(graphSection).toBeTruthy();
  });

  it('devrait afficher le titre de la section graphe', () => {
    const graphTitle: HTMLElement = fixture.nativeElement.querySelector('.homepage__graph-header .homepage__section-title');
    expect(graphTitle).toBeTruthy();
    expect(graphTitle.textContent?.trim()).toBe('La ruche en action');
  });

  /* ── Statistiques ── */

  it('devrait avoir 4 cartes statistiques', () => {
    const statCards = fixture.nativeElement.querySelectorAll('.homepage__stat-card');
    expect(statCards.length).toBe(4);
  });

  it('devrait afficher les labels des statistiques', () => {
    const labels: NodeListOf<Element> = fixture.nativeElement.querySelectorAll('.homepage__stat-label');
    const labelTexts = Array.from(labels).map((l: Element) => (l.textContent ?? '').trim());
    expect(labelTexts).toContain('Agents spécialisés');
    expect(labelTexts).toContain('Skills disponibles');
    expect(labelTexts).toContain('Catégories MCP');
    expect(labelTexts).toContain('par session MEDIUM');
  });

  it('devrait initialiser les compteurs à 0', () => {
    expect(component.animatedValues()).toEqual([0, 0, 0, 0]);
    expect(component.countersDone()).toBeFalse();
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
    expect(footer.textContent).toContain('Pipeline d\'agents IA');
  });

  /* ── États du composant ── */

  it('les données des stats devraient être cohérentes', () => {
    expect(component.stats.length).toBe(4);
    expect(component.stats[0].value).toBe(9);
    expect(component.stats[1].value).toBe(26);
    expect(component.stats[2].value).toBe(4);
    expect(component.stats[3].value).toBe(125);
  });

  it('formatStat devrait formater le prix correctement', () => {
    component.animatedValues.set([9, 26, 4, 25]);
    fixture.detectChanges();
    expect(component.formatStat(3)).toBe('1.25 $');
  });

  it('formatStat devrait formater les entiers', () => {
    component.animatedValues.set([9, 26, 4, 0]);
    fixture.detectChanges();
    expect(component.formatStat(0)).toBe('9');
    expect(component.formatStat(1)).toBe('26');
    expect(component.formatStat(2)).toBe('4');
  });
});
