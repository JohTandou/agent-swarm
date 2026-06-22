import { ComponentFixture, TestBed, fakeAsync, tick } from '@angular/core/testing';
import { signal } from '@angular/core';
import { WorkflowComponent } from './workflow.component';
import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { provideHttpClient } from '@angular/common/http';
import { provideHttpClientTesting } from '@angular/common/http/testing';
import { provideMarkdown, MERMAID_OPTIONS } from 'ngx-markdown';
import { ContentService } from '../../shared/services/content.service';
import { LanguageService } from '../../shared/services/language.service';

describe('WorkflowComponent', () => {
  let component: WorkflowComponent;
  let fixture: ComponentFixture<WorkflowComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [WorkflowComponent],
      providers: [
        provideHttpClient(),
        provideHttpClientTesting(),
        provideMarkdown({
          mermaidOptions: {
            provide: MERMAID_OPTIONS,
            useValue: {
              darkMode: true,
              themeVariables: {
                primaryColor: '#1C1812',
                primaryTextColor: '#F5F0EB',
                primaryBorderColor: 'rgba(122,136,153,0.3)',
                lineColor: '#7A8899',
                secondaryColor: '#28231C',
                tertiaryColor: '#0E0C09',
              },
            },
          },
        }),
        ContentService,
        { provide: LanguageService, useValue: { currentLang: signal('fr' as const), langPrefix: '' } },
      ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
    }).compileComponents();

    fixture = TestBed.createComponent(WorkflowComponent);
    component = fixture.componentInstance;
    // Ne pas appeler detectChanges ici — ngOnInit sera déclenché dans chaque test
  });

  it('devrait créer le composant', () => {
    expect(component).toBeTruthy();
  });

  it('devrait afficher le contenu après le chargement', fakeAsync(() => {
    fixture.detectChanges(); // déclenche ngOnInit
    tick(500);              // avance le temps
    fixture.detectChanges(); // met à jour la vue

    const main: HTMLElement | null = fixture.nativeElement.querySelector('.page');
    expect(main).toBeTruthy();
  }));

  it('devrait afficher le titre hero après chargement', fakeAsync(() => {
    fixture.detectChanges();
    tick(500);
    fixture.detectChanges();

    const title: HTMLElement | null = fixture.nativeElement.querySelector('#hero-title');
    expect(title).toBeTruthy();
    expect(title!.textContent?.trim().replace(/\u00A0/g, ' ')).toBe("De l'analyse au merge, chaque étape automatisée");
  }));

  it('devrait afficher les 5 nœuds de décision', fakeAsync(() => {
    fixture.detectChanges();
    tick(500);
    fixture.detectChanges();

    const nodes: NodeListOf<Element> = fixture.nativeElement.querySelectorAll('.node-card');
    expect(nodes.length).toBe(5);
  }));

  it('devrait afficher les routes dans les nœuds', fakeAsync(() => {
    fixture.detectChanges();
    tick(500);
    fixture.detectChanges();

    const routeBadges: NodeListOf<Element> = fixture.nativeElement.querySelectorAll('.node-card__header app-ui-badge');
    expect(routeBadges.length).toBe(5);
    expect(routeBadges[0].textContent?.trim()).toBe('DIRECT');
    expect(routeBadges[4].textContent?.trim()).toBe('FULL');
  }));

  it('devrait afficher le tableau des seuils de pre-search', fakeAsync(() => {
    fixture.detectChanges();
    tick(500);
    fixture.detectChanges();

    const table: HTMLElement | null = fixture.nativeElement.querySelector('.pre-search__table');
    expect(table).toBeTruthy();
  }));

  it('devrait afficher les 2 gates qualité', fakeAsync(() => {
    fixture.detectChanges();
    tick(500);
    fixture.detectChanges();

    const gateCards: NodeListOf<Element> = fixture.nativeElement.querySelectorAll('.gate-card');
    expect(gateCards.length).toBe(2);
  }));

  it('devrait afficher les 5 étapes Git', fakeAsync(() => {
    fixture.detectChanges();
    tick(500);
    fixture.detectChanges();

    const gitSteps: NodeListOf<Element> = fixture.nativeElement.querySelectorAll('.git-step');
    expect(gitSteps.length).toBe(5);
  }));

  it('devrait afficher les 2 fichiers swarm', fakeAsync(() => {
    fixture.detectChanges();
    tick(500);
    fixture.detectChanges();

    const fileCards: NodeListOf<Element> = fixture.nativeElement.querySelectorAll('.file-card');
    expect(fileCards.length).toBe(2);
  }));

  it('devrait avoir la structure du hero complète', fakeAsync(() => {
    fixture.detectChanges();
    tick(500);
    fixture.detectChanges();

    expect(fixture.nativeElement.querySelector('.hero__kicker')).toBeTruthy();
    expect(fixture.nativeElement.querySelector('.hero__title')).toBeTruthy();
    expect(fixture.nativeElement.querySelector('.hero__subtitle')).toBeTruthy();
  }));

  it('devrait gérer l\'état d\'erreur via retry()', fakeAsync(() => {
    // D'abord, initialiser normalement
    fixture.detectChanges();
    tick(500);
    fixture.detectChanges();

    // Puis déclencher une erreur
    component['error'].set('Test error message');
    fixture.detectChanges();

    const errorState: HTMLElement | null = fixture.nativeElement.querySelector('.error-state');
    expect(errorState).toBeTruthy();
    expect(errorState!.textContent).toContain('Test error message');

    // Retry
    const retryBtn: HTMLElement | null = fixture.nativeElement.querySelector('.error-state app-ui-button');
    expect(retryBtn).toBeTruthy();
    retryBtn!.click();
    fixture.detectChanges();

    const main: HTMLElement | null = fixture.nativeElement.querySelector('.page');
    expect(main).toBeTruthy();
  }));
});
