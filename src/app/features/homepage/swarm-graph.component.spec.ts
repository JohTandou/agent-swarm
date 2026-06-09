import { ComponentFixture, TestBed } from '@angular/core/testing';
import { SwarmGraphComponent } from './swarm-graph.component';

describe('SwarmGraphComponent', () => {
  let component: SwarmGraphComponent;
  let fixture: ComponentFixture<SwarmGraphComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SwarmGraphComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(SwarmGraphComponent);
    component = fixture.componentInstance;
  });

  /* ── Création et état initial ── */

  it('devrait créer le composant', () => {
    expect(component).toBeTruthy();
  });

  it('devrait être en état de chargement au démarrage', () => {
    expect(component.loading()).toBeTrue();
    expect(component.error()).toBeNull();
    expect(component.nodePositions()).toEqual([]);
    expect(component.tooltip()).toBeNull();
  });

  it('devrait afficher le skeleton de chargement initialement', () => {
    fixture.detectChanges();
    const skeleton: HTMLElement = fixture.nativeElement.querySelector('.swarm-graph__skeleton');
    expect(skeleton).toBeTruthy();
    const skeletonText: HTMLElement = fixture.nativeElement.querySelector('.swarm-graph__skeleton-text');
    expect(skeletonText.textContent?.trim()).toBe("Chargement du graphe d'agents…");
  });

  /* ── État d'erreur ── */

  it('devrait afficher un message quand error() est défini', () => {
    component.loading.set(false);
    component.error.set('Impossible de charger le graphe.');
    fixture.detectChanges();

    const errorEl: HTMLElement = fixture.nativeElement.querySelector('.swarm-graph__error');
    expect(errorEl).toBeTruthy();
    expect(errorEl.getAttribute('role')).toBe('alert');
    const errorMsg: HTMLElement = fixture.nativeElement.querySelector('.swarm-graph__error-message');
    expect(errorMsg.textContent?.trim()).toBe('Impossible de charger le graphe.');
  });

  it('ne devrait pas afficher le skeleton en état d\'erreur', () => {
    component.loading.set(false);
    component.error.set('Erreur');
    fixture.detectChanges();

    const skeleton = fixture.nativeElement.querySelector('.swarm-graph__skeleton');
    expect(skeleton).toBeFalsy();
  });

  /* ── État succès : structure du graphe ── */

  it('devrait afficher le SVG après le chargement réussi', () => {
    component.loading.set(false);
    component.error.set(null);
    component.nodePositions.set([
      { id: 'orchestrateur', x: 0, y: 0 },
      { id: 'search', x: 100, y: 50 },
    ]);
    component.linkPositions.set([
      { id: 'link-0', sourceId: 'orchestrateur', targetId: 'search' },
    ]);
    component.linkPositionsMap.set({
      orchestrateur: { id: 'orchestrateur', x: 0, y: 0 },
      search: { id: 'search', x: 100, y: 50 },
    });

    fixture.detectChanges();

    const svg: SVGElement = fixture.nativeElement.querySelector('.swarm-graph__svg');
    expect(svg).toBeTruthy();
    expect(svg.getAttribute('aria-label')).toBe('Graphe interactif des 9 agents spécialisés du Swarm');

    const nodeGroups = fixture.nativeElement.querySelectorAll('.swarm-graph__node-group');
    expect(nodeGroups.length).toBe(2);

    const labels = fixture.nativeElement.querySelectorAll('.swarm-graph__label');
    expect(labels.length).toBe(2);
  });

  it('devrait avoir un lien rendu pour chaque connexion', () => {
    component.loading.set(false);
    component.nodePositions.set([
      { id: 'orchestrateur', x: 0, y: 0 },
      { id: 'search', x: 100, y: 50 },
      { id: 'planner', x: -80, y: 40 },
    ]);
    component.linkPositions.set([
      { id: 'link-0', sourceId: 'orchestrateur', targetId: 'search' },
      { id: 'link-1', sourceId: 'orchestrateur', targetId: 'planner' },
    ]);
    component.linkPositionsMap.set({
      orchestrateur: { id: 'orchestrateur', x: 0, y: 0 },
      search: { id: 'search', x: 100, y: 50 },
      planner: { id: 'planner', x: -80, y: 40 },
    });

    fixture.detectChanges();

    const links = fixture.nativeElement.querySelectorAll('.swarm-graph__link');
    expect(links.length).toBe(2);
  });

  /* ── Helpers de rendu ── */

  it('getNodeRadius devrait retourner le rayon correct', () => {
    expect(component.getNodeRadius('orchestrateur')).toBe(20);
    expect(component.getNodeRadius('search')).toBe(14);
    expect(component.getNodeRadius('tester')).toBe(14);
  });

  it('getNodeRadius devrait retourner 14 pour un id inconnu', () => {
    expect(component.getNodeRadius('inconnu')).toBe(14);
    expect(component.getNodeRadius('')).toBe(14);
  });

  it('getNodeColor devrait retourner la couleur correcte', () => {
    expect(component.getNodeColor('orchestrateur')).toBe('#C4780D');
    expect(component.getNodeColor('search')).toBe('#B8A878');
    expect(component.getNodeColor('front')).toBe('#9A9590');
  });

  it('getNodeColor devrait retourner un fallback pour un id inconnu', () => {
    expect(component.getNodeColor('inconnu')).toBe('#7A8899');
  });

  it('getNodeLabel devrait retourner le label correct', () => {
    expect(component.getNodeLabel('orchestrateur')).toBe('Orchestrateur');
    expect(component.getNodeLabel('search')).toBe('Search');
    expect(component.getNodeLabel('writer')).toBe('Writer');
  });

  it('getNodeLabel devrait retourner l\'id en fallback si inconnu', () => {
    expect(component.getNodeLabel('inconnu')).toBe('inconnu');
  });

  /* ── Tooltip ── */

  it('onNodeHover devrait définir les données du tooltip', () => {
    const containerDiv: HTMLElement = fixture.nativeElement.querySelector('.swarm-graph')!;
    spyOn(containerDiv, 'getBoundingClientRect').and.returnValue({
      top: 200, left: 100, right: 900, bottom: 800,
      width: 800, height: 600, x: 100, y: 200, toJSON: () => ({}),
    } as DOMRect);

    const fakeEvent = new MouseEvent('mouseenter', { clientX: 400, clientY: 350 });
    component.onNodeHover(fakeEvent, 'search');

    const tip = component.tooltip();
    expect(tip).not.toBeNull();
    expect(tip!.label).toBe('Search');
    expect(tip!.role).toBe('Cartographie et analyse du codebase');
    expect(tip!.x).toBe(300);
    expect(tip!.y).toBe(150);
  });

  it('onNodeHover ne devrait rien faire pour un id inconnu', () => {
    const fakeEvent = new MouseEvent('mouseenter', { clientX: 400, clientY: 350 });
    component.onNodeHover(fakeEvent, 'inconnu');
    expect(component.tooltip()).toBeNull();
  });

  it('onNodeLeave devrait effacer le tooltip', () => {
    const containerDiv: HTMLElement = fixture.nativeElement.querySelector('.swarm-graph')!;
    spyOn(containerDiv, 'getBoundingClientRect').and.returnValue({
      top: 200, left: 100, right: 900, bottom: 800,
      width: 800, height: 600, x: 100, y: 200, toJSON: () => ({}),
    } as DOMRect);

    component.onNodeHover(new MouseEvent('mouseenter', { clientX: 400, clientY: 350 }), 'planner');
    expect(component.tooltip()).not.toBeNull();

    component.onNodeLeave();
    expect(component.tooltip()).toBeNull();
  });

  it('devrait afficher le tooltip dans le DOM', () => {
    component.loading.set(false);
    component.tooltip.set({ label: 'Search', role: 'Analyse du codebase', x: 300, y: 150 });
    fixture.detectChanges();

    const tooltipEl: HTMLElement = fixture.nativeElement.querySelector('.swarm-graph__tooltip');
    expect(tooltipEl).toBeTruthy();
    expect(tooltipEl.getAttribute('role')).toBe('tooltip');

    const nameEl: HTMLElement = fixture.nativeElement.querySelector('.swarm-graph__tooltip-name');
    expect(nameEl.textContent?.trim()).toBe('Search');

    const roleEl: HTMLElement = fixture.nativeElement.querySelector('.swarm-graph__tooltip-role');
    expect(roleEl.textContent?.trim()).toBe('Analyse du codebase');
  });

  /* ── Intégrité des données ── */

  it('devrait avoir 9 agents avec des labels distincts', () => {
    const expectedIds = [
      'orchestrateur', 'search', 'planner', 'contract',
      'front', 'back', 'tester', 'reviewer', 'writer',
    ];
    expectedIds.forEach((id) => {
      expect(component.getNodeLabel(id)).not.toBe(id);
    });
  });

  it('devrait avoir l\'orchestrateur comme nœud central', () => {
    expect(component.getNodeRadius('orchestrateur')).toBe(20);
    expect(component.getNodeColor('orchestrateur')).toBe('#C4780D');
  });

  /* ── Nettoyage ── */

  it('ngOnDestroy ne devrait pas lever d\'exception', () => {
    expect(() => component.ngOnDestroy()).not.toThrow();
  });

  /* ── Attributs SVG dynamiques ── */

  it('les cercles des nœuds devraient avoir les bons attributs', () => {
    component.loading.set(false);
    component.nodePositions.set([
      { id: 'orchestrateur', x: 50, y: -30 },
    ]);
    component.linkPositions.set([]);
    component.linkPositionsMap.set({
      orchestrateur: { id: 'orchestrateur', x: 50, y: -30 },
    });

    fixture.detectChanges();

    const mainCircle = fixture.nativeElement.querySelector('.swarm-graph__node');
    expect(mainCircle.getAttribute('cx')).toBe('50');
    expect(mainCircle.getAttribute('cy')).toBe('-30');
    expect(mainCircle.getAttribute('r')).toBe('20');
    expect(mainCircle.getAttribute('fill')).toBe('#C4780D');
  });

  it('le nœud orchestrateur devrait avoir la classe pulse', () => {
    component.loading.set(false);
    component.nodePositions.set([
      { id: 'orchestrateur', x: 0, y: 0 },
    ]);
    component.linkPositions.set([]);
    component.linkPositionsMap.set({
      orchestrateur: { id: 'orchestrateur', x: 0, y: 0 },
    });

    fixture.detectChanges();

    const nodeGroup = fixture.nativeElement.querySelector('.swarm-graph__node-group');
    expect(nodeGroup.classList.contains('swarm-graph__node-group--pulse')).toBeTrue();
  });

  it('un nœud non-orchestrateur ne devrait pas avoir la classe pulse', () => {
    component.loading.set(false);
    component.nodePositions.set([
      { id: 'search', x: 0, y: 0 },
    ]);
    component.linkPositions.set([]);
    component.linkPositionsMap.set({
      search: { id: 'search', x: 0, y: 0 },
    });

    fixture.detectChanges();

    const nodeGroup = fixture.nativeElement.querySelector('.swarm-graph__node-group');
    expect(nodeGroup.classList.contains('swarm-graph__node-group--pulse')).toBeFalse();
  });

  /* ── États mutuellement exclusifs ── */

  it('ne devrait pas afficher le SVG en état de chargement', () => {
    fixture.detectChanges();
    const svg = fixture.nativeElement.querySelector('.swarm-graph__svg');
    expect(svg).toBeFalsy();
  });

  it('ne devrait pas afficher le SVG en état d\'erreur', () => {
    component.loading.set(false);
    component.error.set('Erreur');
    fixture.detectChanges();
    const svg = fixture.nativeElement.querySelector('.swarm-graph__svg');
    expect(svg).toBeFalsy();
  });

  it('ne devrait afficher ni skeleton ni erreur en état succès', () => {
    component.loading.set(false);
    component.nodePositions.set([{ id: 'orchestrateur', x: 0, y: 0 }]);
    component.linkPositions.set([]);
    component.linkPositionsMap.set({ orchestrateur: { id: 'orchestrateur', x: 0, y: 0 } });
    fixture.detectChanges();

    expect(fixture.nativeElement.querySelector('.swarm-graph__skeleton')).toBeFalsy();
    expect(fixture.nativeElement.querySelector('.swarm-graph__error')).toBeFalsy();
    expect(fixture.nativeElement.querySelector('.swarm-graph__svg')).toBeTruthy();
  });
});
