import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideRouter } from '@angular/router';
import { SkillsListComponent } from './skills-list.component';

describe('SkillsListComponent', () => {
  let component: SkillsListComponent;
  let fixture: ComponentFixture<SkillsListComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SkillsListComponent],
      providers: [provideRouter([])],
    }).compileComponents();

    fixture = TestBed.createComponent(SkillsListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  // TEST 1: devrait créer le composant
  it('devrait créer le composant', () => {
    expect(component).toBeTruthy();
  });

  // TEST 2: devrait afficher les 3 skills dans la grille
  it('devrait afficher les 3 skills dans la grille', () => {
    const cards = fixture.nativeElement.querySelectorAll('.skills__card');
    expect(cards.length).toBe(3);
  });

  // TEST 3: devrait afficher le titre de la page
  it('devrait afficher le titre "Skills"', () => {
    const title = fixture.nativeElement.querySelector('.skills__title');
    expect(title).toBeTruthy();
    expect(title.textContent?.trim()).toBe('Skills');
  });

  // TEST 4: devrait afficher le sous-titre
  it('devrait afficher le sous-titre', () => {
    const subtitle = fixture.nativeElement.querySelector('.skills__subtitle');
    expect(subtitle).toBeTruthy();
    expect(subtitle.textContent).toContain('Chaque skill est une capacité spécialisée');
  });

  // TEST 5: devrait avoir des boutons de filtre pour chaque catégorie + "Tous"
  it('devrait avoir des boutons de filtre (Tous + 4 catégories)', () => {
    const filterButtons = fixture.nativeElement.querySelectorAll('.skills__filter');
    expect(filterButtons.length).toBe(5); // Tous + audit + création + workflow + documentation
  });

  // TEST 6: devrait filtrer par catégorie quand on clique sur un bouton
  it('devrait filtrer les skills quand on clique sur une catégorie', () => {
    const filterButtons: HTMLElement[] = Array.from(
      fixture.nativeElement.querySelectorAll('.skills__filter')
    );
    // Cliquer sur "Création" (3ème bouton, après "Tous" et "Audit")
    const creationButton = filterButtons[2] as HTMLButtonElement;
    creationButton.click();
    fixture.detectChanges();

    // Après filtrage, les cartes devraient avoir data-category="creation"
    const cards = fixture.nativeElement.querySelectorAll('.skills__card[data-category="creation"]');
    // Il y a 2 skills dans la catégorie "creation" : ui-ux-pro-max et tests-create
    expect(cards.length).toBe(2);
  });

  // TEST 7: devrait désactiver le filtre si on clique deux fois sur la même catégorie
  it('devrait désactiver le filtre si on re-clique sur la même catégorie', () => {
    const filterButtons: HTMLElement[] = Array.from(
      fixture.nativeElement.querySelectorAll('.skills__filter')
    );
    const creationButton = filterButtons[2] as HTMLButtonElement;
    
    // Premier clic : active le filtre
    creationButton.click();
    fixture.detectChanges();
    expect(component.activeCategory()).toBe('creation');
    
    // Deuxième clic : désactive le filtre
    creationButton.click();
    fixture.detectChanges();
    expect(component.activeCategory()).toBeNull();
  });

  // TEST 8: devrait afficher l'état vide quand aucun skill ne correspond au filtre
  it('devrait avoir le bloc empty state dans le template', () => {
    const emptyEl = fixture.nativeElement.querySelector('.skills__empty');
    // Par défaut, aucun filtre n'est actif donc pas d'empty state
    expect(emptyEl).toBeFalsy();
    
    // On définit une catégorie qui a des skills
    component.activeCategory.set('creation');
    fixture.detectChanges();
    const emptyAfterFilter = fixture.nativeElement.querySelector('.skills__empty');
    // La catégorie création a des skills, donc pas d'empty state
    expect(emptyAfterFilter).toBeFalsy();
  });

  // TEST 9: getCategoryLabel devrait retourner les bons labels
  it('getCategoryLabel devrait retourner les labels français', () => {
    expect(component.getCategoryLabel('audit')).toBe('Audit');
    expect(component.getCategoryLabel('creation')).toBe('Création');
    expect(component.getCategoryLabel('workflow')).toBe('Workflow');
    expect(component.getCategoryLabel('documentation')).toBe('Documentation');
  });

  // TEST 10: isFeatured devrait retourner true pour ui-ux-pro-max
  it('isFeatured devrait identifier le skill "ui-ux-pro-max"', () => {
    const featured = component.skills.find(s => s.id === 'ui-ux-pro-max')!;
    const testsCreate = component.skills.find(s => s.id === 'tests-create')!;
    
    expect(component.isFeatured(featured)).toBeTrue();
    expect(component.isFeatured(testsCreate)).toBeFalse();
  });

  // TEST 11: isWide devrait retourner true pour graphify
  it('isWide devrait identifier le skill "graphify"', () => {
    const graphify = component.skills.find(s => s.id === 'graphify')!;
    const uiux = component.skills.find(s => s.id === 'ui-ux-pro-max')!;
    
    expect(component.isWide(graphify)).toBeTrue();
    expect(component.isWide(uiux)).toBeFalse();
  });

  // TEST 12: getCategoryCount devrait retourner le bon compte
  it('getCategoryCount devrait compter les skills par catégorie', () => {
    expect(component.getCategoryCount('creation')).toBe(2);
    expect(component.getCategoryCount('workflow')).toBe(1);
    expect(component.getCategoryCount('audit')).toBe(0);
    expect(component.getCategoryCount('documentation')).toBe(0);
  });

  // TEST 13: isFiltered devrait refléter l'état du filtre
  it('isFiltered devrait être false sans filtre et true avec', () => {
    expect(component.isFiltered()).toBeFalse();
    component.activeCategory.set('creation');
    expect(component.isFiltered()).toBeTrue();
    component.activeCategory.set(null);
    expect(component.isFiltered()).toBeFalse();
  });

  // TEST 14: chaque carte devrait être un lien routerLink vers /skills/:id
  it('chaque carte devrait avoir un attribut href vers /skills/:id', () => {
    const firstCard = fixture.nativeElement.querySelector('.skills__card');
    expect(firstCard).toBeTruthy();
    expect(firstCard.getAttribute('href')).toBe('/skills/ui-ux-pro-max');
  });

  // TEST 15: devrait afficher le badge de catégorie sur chaque carte
  it('devrait afficher le badge de catégorie', () => {
    const badges = fixture.nativeElement.querySelectorAll('.skills__card-badge');
    expect(badges.length).toBe(3); // 3 skills
    // Le premier skill (ui-ux-pro-max) est "Création"
    expect(badges[0].textContent?.trim()).toBe('Création');
  });

  // TEST 16: devrait afficher l'emoji de chaque skill
  it('devrait afficher l\'emoji de chaque skill dans la carte', () => {
    const firstEmoji = fixture.nativeElement.querySelector('.skills__card-emoji');
    expect(firstEmoji).toBeTruthy();
    expect(firstEmoji.textContent?.trim()).toBe('🎨'); // ui-ux-pro-max
  });

  // TEST 17: devrait afficher la description de chaque skill
  it('devrait afficher la description du skill dans la carte', () => {
    const firstDesc = fixture.nativeElement.querySelector('.skills__card-desc');
    expect(firstDesc).toBeTruthy();
    expect(firstDesc.textContent).toContain('Intelligence de design');
  });

  // TEST 18: categories devrait contenir les 4 catégories
  it('devrait exposer les 4 catégories', () => {
    expect(component.categories.length).toBe(4);
    expect(component.categories).toEqual(['audit', 'creation', 'workflow', 'documentation']);
  });

  // TEST 19: la grille devrait avoir un attribut role="list"
  it('la grille devrait avoir role="list"', () => {
    const grid = fixture.nativeElement.querySelector('.skills__grid');
    expect(grid).toBeTruthy();
    expect(grid.getAttribute('role')).toBe('list');
  });

  // TEST 20: chaque carte devrait avoir role="listitem"
  it('chaque carte devrait avoir role="listitem"', () => {
    const firstCard = fixture.nativeElement.querySelector('.skills__card');
    expect(firstCard.getAttribute('role')).toBe('listitem');
  });

  // TEST 21: la carte featured devrait avoir la classe skills__card--featured
  it('la carte ui-ux-pro-max devrait être featured', () => {
    const featuredCards = fixture.nativeElement.querySelectorAll('.skills__card--featured');
    expect(featuredCards.length).toBe(1);
  });

  // TEST 22: la carte graphify devrait avoir la classe skills__card--wide
  it('la carte graphify devrait être wide', () => {
    const wideCards = fixture.nativeElement.querySelectorAll('.skills__card--wide');
    expect(wideCards.length).toBe(1);
  });

  // TEST 23: devrait avoir le bouton reset dans l'empty state
  it('le empty state devrait avoir un bouton réinitialiser', () => {
    // Force l'empty state avec une catégorie vide
    component.activeCategory.set('documentation');
    fixture.detectChanges();
    
    const emptyEl = fixture.nativeElement.querySelector('.skills__empty');
    expect(emptyEl).toBeTruthy();
    const resetBtn = fixture.nativeElement.querySelector('.skills__empty-reset');
    expect(resetBtn).toBeTruthy();
    expect(resetBtn.textContent?.trim()).toBe('Réinitialiser le filtre');
  });

  // TEST 24: le bouton Tous devrait avoir le compteur total
  it('le bouton Tous devrait afficher le nombre total de skills', () => {
    const tousButton = fixture.nativeElement.querySelector('.skills__filter');
    expect(tousButton).toBeTruthy();
    const count = tousButton.querySelector('.skills__filter-count');
    expect(count).toBeTruthy();
    expect(count.textContent?.trim()).toBe('3');
  });
});
