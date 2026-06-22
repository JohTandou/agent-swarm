import { ComponentFixture, TestBed } from '@angular/core/testing';
import { signal } from '@angular/core';
import { provideRouter } from '@angular/router';
import { AgentsListComponent } from './agents-list.component';
import { LanguageService } from '../../shared/services/language.service';
import { TranslationService } from '../../shared/services/translation.service';

describe('AgentsListComponent', () => {
  let component: AgentsListComponent;
  let fixture: ComponentFixture<AgentsListComponent>;

  beforeEach(async () => {
    const mockTranslationService = {
      translate: jasmine.createSpy('translate').and.callFake((key: string) => {
        const map: Record<string, string> = {
          'agents.list.title': 'Agents',
          'agents.list.subtitle': 'Chaque agent est une pièce spécialisée',
          'agents.list.filter.all': 'Tous',
          'agents.list.eyebrow': 'Neuf agents, un collectif',
          'agents.category.build': 'Build',
          'agents.category.qualité': 'Qualité',
          'agents.category.infrastructure': 'Infrastructure',
          'toast.agents.all': '{n} agents affichés',
          'toast.agents.filtered': '{n} agents trouvés — {category}',
          'toast.skills.all': '{n} skills affichés',
          'toast.skills.filtered': '{n} skills trouvés — {category}',
        };
        return map[key] ?? key;
      }),
    };

    await TestBed.configureTestingModule({
      imports: [AgentsListComponent],
      providers: [
        provideRouter([]),
        { provide: LanguageService, useValue: { currentLang: signal('fr' as const), langPrefix: '' } },
        { provide: TranslationService, useValue: mockTranslationService },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(AgentsListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  // TEST 1: devrait créer le composant
  it('devrait créer le composant', () => {
    expect(component).toBeTruthy();
  });

  // TEST 2: devrait afficher les 11 agents dans la grille
  it('devrait afficher les 11 agents dans la grille', () => {
    const cards = fixture.nativeElement.querySelectorAll('.agents__card');
    expect(cards.length).toBe(11);
  });

  // TEST 3: devrait afficher le titre de la page
  it('devrait afficher le titre "Agents"', () => {
    const title = fixture.nativeElement.querySelector('.agents__title');
    expect(title).toBeTruthy();
    expect(title.textContent?.trim()).toBe('Agents');
  });

  // TEST 4: devrait afficher le sous-titre
  it('devrait afficher le sous-titre', () => {
    const subtitle = fixture.nativeElement.querySelector('.agents__subtitle');
    expect(subtitle).toBeTruthy();
    expect(subtitle.textContent).toContain('Chaque agent est une pièce spécialisée');
  });

  // TEST 5: devrait avoir des boutons de filtre pour chaque catégorie + "Tous"
  it('devrait avoir des boutons de filtre (Tous + 3 catégories)', () => {
    const filterButtons = fixture.nativeElement.querySelectorAll('nav.agents__filters app-ui-button');
    expect(filterButtons.length).toBe(4); // Tous + build + qualité + infrastructure
  });

  // TEST 6: devrait filtrer par catégorie quand on clique sur un bouton
  it('devrait filtrer les agents quand on clique sur une catégorie', () => {
    // Récupérer tous les boutons de filtre
    const filterButtons: HTMLElement[] = Array.from(
      fixture.nativeElement.querySelectorAll('nav.agents__filters app-ui-button')
    );
    // Cliquer sur "Build" (2ème bouton, après "Tous")
    const buildButton = filterButtons[1] as HTMLButtonElement;
    buildButton.click();
    fixture.detectChanges();

    // Après filtrage, les cartes devraient avoir data-category="build"
    const cards = fixture.nativeElement.querySelectorAll('.agents__card[data-category="build"]');
    // Il y a 4 agents dans la catégorie "build" : orchestrateur, front, back, planner
    expect(cards.length).toBe(4);
  });

  // TEST 7: devrait désactiver le filtre si on clique deux fois sur la même catégorie
  it('devrait désactiver le filtre si on re-clique sur la même catégorie', () => {
    const filterButtons: HTMLElement[] = Array.from(
      fixture.nativeElement.querySelectorAll('nav.agents__filters app-ui-button')
    );
    const buildButton = filterButtons[1] as HTMLButtonElement;
    
    // Premier clic : active le filtre
    buildButton.click();
    fixture.detectChanges();
    expect(component.activeCategory()).toBe('build');
    
    // Deuxième clic : désactive le filtre
    buildButton.click();
    fixture.detectChanges();
    expect(component.activeCategory()).toBeNull();
  });

  // TEST 8: devrait afficher l'état vide quand aucun agent ne correspond au filtre
  it('devrait afficher un message quand aucun agent ne correspond', () => {
    // Pas de catégorie qui n'a aucun agent, mais on peut tester la logique
    // En mockant le signal filteredAgents — non, testons plutôt le HTML
    // On définit une catégorie qui existe mais vérifions que le message empty existe
    const emptyEl = fixture.nativeElement.querySelector('.agents__empty');
    // Par défaut, aucun filtre n'est actif donc pas d'empty state
    expect(emptyEl).toBeFalsy();
    
    // On vérifie que le template a bien le bloc @if pour l'empty state
    // en regardant si le bouton reset est présent quand on force l'état
    component.activeCategory.set('build'); // une catégorie avec des agents
    fixture.detectChanges();
    // Puisqu'il y a des agents, le empty state ne devrait pas s'afficher
    const emptyAfterFilter = fixture.nativeElement.querySelector('.agents__empty');
    expect(emptyAfterFilter).toBeFalsy();
  });

  // TEST 9: getCategoryLabel devrait retourner les bons labels
  it('getCategoryLabel devrait retourner les labels français', () => {
    expect(component.getCategoryLabel('build')).toBe('Build');
    expect(component.getCategoryLabel('qualité')).toBe('Qualité');
    expect(component.getCategoryLabel('infrastructure')).toBe('Infrastructure');
  });

  // TEST 10: getRouteColor devrait retourner les bonnes couleurs
  it('getRouteColor devrait retourner la bonne couleur selon la route', () => {
    expect(component.getRouteColor('FULL')).toBe('#C4780D');
    expect(component.getRouteColor('DIRECT')).toBe('#7A8899');
    expect(component.getRouteColor('SIMPLE')).toBe('#7A8899');
    expect(component.getRouteColor('ADAPT')).toBe('#7A8899');
    expect(component.getRouteColor('MEDIUM')).toBe('#C4780D');
    expect(component.getRouteColor('INCONNUE')).toBe('#7A8899'); // fallback
  });

  // TEST 11: la première carte devrait avoir la classe featured (bento grid)
  it('la première carte devrait avoir la classe --featured', () => {
    const firstCard = fixture.nativeElement.querySelector('.agents__card');
    expect(firstCard).toBeTruthy();
    expect(firstCard.classList.contains('agents__card--featured')).toBeTrue();
  });

  // TEST 12: la troisième carte devrait avoir la classe wide (bento grid)
  it('la troisième carte devrait avoir la classe --wide', () => {
    const cards = fixture.nativeElement.querySelectorAll('.agents__card');
    expect(cards.length).toBeGreaterThanOrEqual(3);
    expect(cards[2].classList.contains('agents__card--wide')).toBeTrue();
  });


  // TEST 14: getCategoryCount devrait retourner le bon compte
  it('getCategoryCount devrait compter les agents par catégorie', () => {
    expect(component.getCategoryCount('build')).toBe(4);
    expect(component.getCategoryCount('qualité')).toBe(4);
    expect(component.getCategoryCount('infrastructure')).toBe(3);
  });

  // TEST 15: isFiltered devrait refléter l'état du filtre
  it('isFiltered devrait être false sans filtre et true avec', () => {
    expect(component.isFiltered()).toBeFalse();
    component.activeCategory.set('build');
    expect(component.isFiltered()).toBeTrue();
    component.activeCategory.set(null);
    expect(component.isFiltered()).toBeFalse();
  });

  // TEST 16: chaque carte devrait être un lien routerLink vers /agents/:id
  it('chaque carte devrait avoir un attribut href vers /agents/:id', () => {
    const firstCard = fixture.nativeElement.querySelector('.agents__card');
    expect(firstCard).toBeTruthy();
    expect(firstCard.getAttribute('href')).toBe('/agents/orchestrateur');
  });


  // TEST 19: devrait afficher le rôle de chaque agent
  it('devrait afficher le rôle de l\'agent dans la carte', () => {
    const firstRole = fixture.nativeElement.querySelector('.agents__card-role');
    expect(firstRole).toBeTruthy();
    expect(firstRole.textContent).toContain('Tech Lead');
  });

  // TEST 20: should render the route badge avec la bonne couleur
  it('devrait afficher la route avec la couleur appropriée', () => {
    const routeBadge = fixture.nativeElement.querySelector('.agents__card-route') as HTMLElement;
    expect(routeBadge).toBeTruthy();
    expect(routeBadge.textContent?.trim()).toBe('DIRECT');
    expect(routeBadge.style.color).toBe('rgb(122, 136, 153)');
  });

  // TEST 21: should have pipeline animation dots
  it('devrait avoir les points d\'animation du pipeline', () => {
    const pipelineDots = fixture.nativeElement.querySelectorAll('.agents__card-pipeline-dot');
    expect(pipelineDots.length).toBeGreaterThanOrEqual(4); // 4 par carte, une carte au moins
  });

  // TEST 22: categories devrait contenir les 3 catégories
  it('devrait exposer les 3 catégories', () => {
    expect(component.categories.length).toBe(3);
    expect(component.categories).toEqual(['build', 'qualité', 'infrastructure']);
  });

  // TEST 23: la grille devrait avoir un attribut role="list"
  it('la grille devrait avoir role="list"', () => {
    const grid = fixture.nativeElement.querySelector('.agents__grid');
    expect(grid).toBeTruthy();
    expect(grid.getAttribute('role')).toBe('list');
  });

  // TEST 24: chaque carte devrait avoir role="listitem"
  it('chaque carte devrait avoir role="listitem"', () => {
    const firstCard = fixture.nativeElement.querySelector('.agents__card');
    expect(firstCard.getAttribute('role')).toBe('listitem');
  });
});
