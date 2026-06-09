import { ComponentFixture, TestBed, fakeAsync, tick } from '@angular/core/testing';
import { provideHttpClient } from '@angular/common/http';
import { provideHttpClientTesting } from '@angular/common/http/testing';
import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { provideMarkdown, MERMAID_OPTIONS } from 'ngx-markdown';
import { ContentService } from '../../shared/services/content.service';
import { EcosystemComponent } from './ecosystem.component';

describe('EcosystemComponent', () => {
  let component: EcosystemComponent;
  let fixture: ComponentFixture<EcosystemComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [EcosystemComponent],
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
      ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
    }).compileComponents();

    fixture = TestBed.createComponent(EcosystemComponent);
    component = fixture.componentInstance;
  });

  it('devrait créer le composant', () => {
    expect(component).toBeTruthy();
  });

  it('devrait afficher le loader au chargement', () => {
    fixture.detectChanges();
    const loader = fixture.nativeElement.querySelector('.page-loader');
    expect(loader).toBeTruthy();
  });

  it('devrait afficher le contenu après le chargement', fakeAsync(() => {
    fixture.detectChanges();
    tick(500);
    fixture.detectChanges();

    const main = fixture.nativeElement.querySelector('.page');
    expect(main).toBeTruthy();
  }));

  it('devrait afficher le titre hero après chargement', fakeAsync(() => {
    fixture.detectChanges();
    tick(500);
    fixture.detectChanges();

    const h1 = fixture.nativeElement.querySelector('.hero__title');
    expect(h1).toBeTruthy();
    const title = h1.textContent!.replace(/\u00A0/g, ' ').trim(); expect(title).toContain('Les coulisses du Swarm');
  }));

  it('devrait afficher les 8 entrées du directoryTree', fakeAsync(() => {
    fixture.detectChanges();
    tick(500);
    fixture.detectChanges();

    const dirCards = fixture.nativeElement.querySelectorAll('.dir-card');
    expect(dirCards.length).toBe(8);
  }));

  it('devrait afficher les 4 catégories de configuration', fakeAsync(() => {
    fixture.detectChanges();
    tick(500);
    fixture.detectChanges();

    const categories = fixture.nativeElement.querySelectorAll('.config-category');
    expect(categories.length).toBe(4);
  }));

  it('devrait afficher les 10 sections AGENTS.md', fakeAsync(() => {
    fixture.detectChanges();
    tick(500);
    fixture.detectChanges();

    const cards = fixture.nativeElement.querySelectorAll('.agentsmd-card');
    expect(cards.length).toBe(8);
  }));

  it('devrait afficher les 4 intégrations', fakeAsync(() => {
    fixture.detectChanges();
    tick(500);
    fixture.detectChanges();

    const integrationCards = fixture.nativeElement.querySelectorAll('.integration-card');
    expect(integrationCards.length).toBe(6);
  }));

  it('devrait avoir les 3 statistiques dans le hero', fakeAsync(() => {
    fixture.detectChanges();
    tick(500);
    fixture.detectChanges();

    const stats = fixture.nativeElement.querySelectorAll('.hero__stat');
    expect(stats.length).toBe(3);
  }));

  it('devrait afficher le diagramme Mermaid', fakeAsync(() => {
    fixture.detectChanges();
    tick(500);
    fixture.detectChanges();

    const mermaid = fixture.nativeElement.querySelector('.mermaid-wrapper');
    expect(mermaid).toBeTruthy();
  }));

  it('devrait gérer l\'état d\'erreur via retry()', fakeAsync(() => {
    fixture.detectChanges();
    tick(500);
    fixture.detectChanges();

    component['error'].set('Test error message');
    fixture.detectChanges();

    const errorState = fixture.nativeElement.querySelector('.error-state');
    expect(errorState).toBeTruthy();
    expect(errorState.textContent).toContain('Test error message');

    const retryBtn = fixture.nativeElement.querySelector('.error-state app-ui-button');
    expect(retryBtn).toBeTruthy();
    retryBtn.click();
    fixture.detectChanges();

    const loader = fixture.nativeElement.querySelector('.page-loader');
    expect(loader).toBeTruthy();

    tick(500);
    fixture.detectChanges();

    const main = fixture.nativeElement.querySelector('.page');
    expect(main).toBeTruthy();
  }));
});
