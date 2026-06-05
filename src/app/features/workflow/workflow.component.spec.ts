import { ComponentFixture, TestBed, fakeAsync, tick } from '@angular/core/testing';
import { WorkflowComponent } from './workflow.component';
import { NO_ERRORS_SCHEMA } from '@angular/core';
import { provideHttpClient } from '@angular/common/http';
import { provideMarkdown } from 'ngx-markdown';

describe('WorkflowComponent', () => {
  let component: WorkflowComponent;
  let fixture: ComponentFixture<WorkflowComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [WorkflowComponent],
      providers: [provideHttpClient(), provideMarkdown()],
      schemas: [NO_ERRORS_SCHEMA],
    }).compileComponents();

    fixture = TestBed.createComponent(WorkflowComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('devrait créer le composant', () => {
    expect(component).toBeTruthy();
  });

  it('devrait afficher le loader au début (loading = true)', () => {
    const loader: HTMLElement | null = fixture.nativeElement.querySelector('.page-loader');
    expect(loader).toBeTruthy();
  });

  it('devrait afficher le contenu après le chargement', fakeAsync(() => {
    tick(500);
    fixture.detectChanges();

    const main: HTMLElement | null = fixture.nativeElement.querySelector('.page');
    expect(main).toBeTruthy();
  }));

  it('devrait afficher le titre hero après chargement', fakeAsync(() => {
    tick(500);
    fixture.detectChanges();

    const title: HTMLElement | null = fixture.nativeElement.querySelector('#hero-title');
    expect(title).toBeTruthy();
    expect(title!.textContent?.trim()).toBe('Le Pipeline Swarm');
  }));

  it('devrait afficher les 5 nœuds de décision', fakeAsync(() => {
    tick(500);
    fixture.detectChanges();

    const nodes: NodeListOf<Element> = fixture.nativeElement.querySelectorAll('.node-card');
    expect(nodes.length).toBe(5);
  }));

  it('devrait afficher les routes dans les nœuds', fakeAsync(() => {
    tick(500);
    fixture.detectChanges();

    const routeBadges: NodeListOf<Element> = fixture.nativeElement.querySelectorAll('.node-card__route');
    expect(routeBadges.length).toBe(5);
    expect(routeBadges[0].textContent?.trim()).toBe('DIRECT');
    expect(routeBadges[4].textContent?.trim()).toBe('FULL');
  }));

  it('devrait afficher le tableau des seuils de pre-search', fakeAsync(() => {
    tick(500);
    fixture.detectChanges();

    const table: HTMLElement | null = fixture.nativeElement.querySelector('.pre-search__table');
    expect(table).toBeTruthy();
  }));

  it('devrait afficher les 2 gates qualité', fakeAsync(() => {
    tick(500);
    fixture.detectChanges();

    const gateCards: NodeListOf<Element> = fixture.nativeElement.querySelectorAll('.gate-card');
    expect(gateCards.length).toBe(2);
  }));

  it('devrait afficher les 5 étapes Git', fakeAsync(() => {
    tick(500);
    fixture.detectChanges();

    const gitSteps: NodeListOf<Element> = fixture.nativeElement.querySelectorAll('.git-step');
    expect(gitSteps.length).toBe(5);
  }));

  it('devrait afficher les 2 fichiers swarm', fakeAsync(() => {
    tick(500);
    fixture.detectChanges();

    const fileCards: NodeListOf<Element> = fixture.nativeElement.querySelectorAll('.file-card');
    expect(fileCards.length).toBe(2);
  }));

  it('devrait avoir les 3 statistiques dans le hero', fakeAsync(() => {
    tick(500);
    fixture.detectChanges();

    const stats: NodeListOf<Element> = fixture.nativeElement.querySelectorAll('.hero__stat');
    expect(stats.length).toBe(3);
  }));

  it('devrait contenir un élément app-markdown-renderer pour le diagramme', fakeAsync(() => {
    tick(500);
    fixture.detectChanges();

    const mermaidEl: HTMLElement | null = fixture.nativeElement.querySelector('app-markdown-renderer');
    expect(mermaidEl).toBeTruthy();
  }));

  it('devrait gérer l\'état d\'erreur via retry()', fakeAsync(() => {
    component['error'].set('Test error message');
    fixture.detectChanges();

    const errorState: HTMLElement | null = fixture.nativeElement.querySelector('.error-state');
    expect(errorState).toBeTruthy();
    expect(errorState!.textContent).toContain('Test error message');

    const retryBtn: HTMLElement | null = fixture.nativeElement.querySelector('.error-state__retry');
    expect(retryBtn).toBeTruthy();
    retryBtn!.click();
    fixture.detectChanges();

    const loader: HTMLElement | null = fixture.nativeElement.querySelector('.page-loader');
    expect(loader).toBeTruthy();

    tick(500);
    fixture.detectChanges();

    const main: HTMLElement | null = fixture.nativeElement.querySelector('.page');
    expect(main).toBeTruthy();
  }));
});
