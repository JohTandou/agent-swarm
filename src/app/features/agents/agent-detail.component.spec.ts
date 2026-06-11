import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideRouter } from '@angular/router';
import { provideHttpClient } from '@angular/common/http';
import { provideHttpClientTesting } from '@angular/common/http/testing';
import { ActivatedRoute, convertToParamMap } from '@angular/router';
import { of } from 'rxjs';
import { AgentDetailComponent } from './agent-detail.component';
import { TocService } from '../../shared/services/toc.service';
import { ContentService } from '../../shared/services/content.service';
import { provideMarkdown } from 'ngx-markdown';

describe('AgentDetailComponent', () => {
  let component: AgentDetailComponent;
  let fixture: ComponentFixture<AgentDetailComponent>;
  let tocService: TocService;

  /**
   * Helper pour créer le composant avec un ID d'agent spécifique dans la route.
   */
  async function setupComponent(agentId: string): Promise<void> {
    await TestBed.configureTestingModule({
      imports: [AgentDetailComponent],
      providers: [
        provideRouter([]),
        provideHttpClient(),
        provideHttpClientTesting(),
        provideMarkdown(),
        ContentService,
        TocService,
        {
          provide: ActivatedRoute,
          useValue: {
            paramMap: of(convertToParamMap({ id: agentId })),
          },
        },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(AgentDetailComponent);
    component = fixture.componentInstance;
    tocService = TestBed.inject(TocService);
    fixture.detectChanges();
  }

  // === TESTS AVEC AGENT VALIDE ===
  describe('avec un agent valide (orchestrateur)', () => {
    beforeEach(async () => {
      await setupComponent('orchestrateur');
    });

    it('devrait créer le composant', () => {
      expect(component).toBeTruthy();
    });

    it('devrait avoir le bon agentId', () => {
      expect(component.agentId()).toBe('orchestrateur');
    });

    it('devrait trouver l\'agent dans la map', () => {
      expect(component.agent()).toBeDefined();
      expect(component.agent()?.name).toBe('Orchestrateur');
      expect(component.agent()?.emoji).toBe('🎯');
    });

    it('ne devrait pas être en état notFound', () => {
      expect(component.notFound()).toBeFalse();
    });

    it('devrait avoir un sourcePath valide', () => {
      expect(component.sourcePath()).toBe('agents/orchestrateur.md');
    });

    it('should have hasContent = true', () => {
      expect(component.hasContent()).toBeTrue();
    });

    it('devrait afficher le nom de l\'agent dans le header', () => {
      const nameEl = fixture.nativeElement.querySelector('.agent-detail__name');
      expect(nameEl).toBeTruthy();
      expect(nameEl.textContent?.trim()).toBe('Orchestrateur');
    });

    it('devrait afficher l\'emoji de l\'agent', () => {
      const emojiEl = fixture.nativeElement.querySelector('.agent-detail__emoji');
      expect(emojiEl).toBeTruthy();
      expect(emojiEl.textContent?.trim()).toBe('🎯');
    });

    it('devrait afficher le rôle de l\'agent', () => {
      const roleEl = fixture.nativeElement.querySelector('.agent-detail__role');
      expect(roleEl).toBeTruthy();
      expect(roleEl.textContent).toContain("Chef d'orchestre");
    });

    it('devrait afficher la route dans les métadonnées', () => {
      const routeEl = fixture.nativeElement.querySelector('.agent-detail__meta .agent-detail__route-badge');
      expect(routeEl).toBeTruthy();
      expect(routeEl.textContent?.trim()).toContain('DIRECT');
    });

    it('devrait afficher la catégorie', () => {
      const catEl = fixture.nativeElement.querySelector('.agent-detail__meta app-ui-badge[variant="default"]');
      expect(catEl).toBeTruthy();
      expect(catEl.textContent?.trim()).toBe('Build');
    });

    it('devrait avoir un fil d\'ariane avec lien retour vers /agents', () => {
      const breadcrumbLink = fixture.nativeElement.querySelector('.agent-detail__breadcrumb-link');
      expect(breadcrumbLink).toBeTruthy();
      expect(breadcrumbLink.getAttribute('href')).toBe('/agents');
    });

    it('devrait avoir le composant markdown-renderer', () => {
      const renderer = fixture.nativeElement.querySelector('app-markdown-renderer');
      expect(renderer).toBeTruthy();
    });

    it('devrait avoir un lien de retour au listing dans le footer', () => {
      const backLink = fixture.nativeElement.querySelector('.agent-detail__back');
      expect(backLink).toBeTruthy();
      expect(backLink.getAttribute('href')).toBe('/agents');
      expect(backLink.textContent?.trim()).toContain('Retour au listing');
    });

    it('devrait appeler tocService.clear() à l\'initialisation', () => {
      // Vérifie que le service TOC est vide après initialisation
      expect(tocService.entries()).toEqual([]);
    });

    it('devrait mettre à jour les entrées TOC via onTocEntries', () => {
      const entries = [
        { id: 'intro', label: 'Introduction', level: 1 as const },
        { id: 'archi', label: 'Architecture', level: 2 as const },
      ];
      component.onTocEntries(entries);
      expect(tocService.entries()).toEqual(entries);
      expect(tocService.entries().length).toBe(2);
    });
  });

  // === TESTS AVEC AGENT INVALIDE (404) ===
  describe('avec un agent invalide', () => {
    beforeEach(async () => {
      await setupComponent('agent-inexistant');
    });

    it('devrait être en état notFound', () => {
      expect(component.notFound()).toBeTrue();
    });

    it('devrait avoir agent = undefined', () => {
      expect(component.agent()).toBeUndefined();
    });

    it('devrait avoir sourcePath vide', () => {
      expect(component.sourcePath()).toBe('');
    });

    it('should have hasContent = false', () => {
      expect(component.hasContent()).toBeFalse();
    });

    it('devrait afficher le message "Agent introuvable"', () => {
      const errorEl = fixture.nativeElement.querySelector('.agent-detail__error');
      expect(errorEl).toBeTruthy();
      const title = fixture.nativeElement.querySelector('.agent-detail__error-title');
      expect(title).toBeTruthy();
      expect(title.textContent?.trim()).toBe('Agent introuvable');
    });

    it('devrait afficher l\'ID invalide dans le message d\'erreur', () => {
      const errorText = fixture.nativeElement.querySelector('.agent-detail__error-text');
      expect(errorText).toBeTruthy();
      expect(errorText.textContent).toContain('agent-inexistant');
    });

    it('devrait proposer un lien retour vers le listing', () => {
      const link = fixture.nativeElement.querySelector('.agent-detail__error-link');
      expect(link).toBeTruthy();
      expect(link.getAttribute('href')).toBe('/agents');
    });

    it('ne devrait pas afficher le header agent', () => {
      const header = fixture.nativeElement.querySelector('.agent-detail__header');
      expect(header).toBeFalsy();
    });

    it('ne devrait pas afficher le markdown renderer', () => {
      const renderer = fixture.nativeElement.querySelector('app-markdown-renderer');
      expect(renderer).toBeFalsy();
    });
  });

  // === TESTS SANS ID (route vide) ===
  describe('sans paramètre id (route vide)', () => {
    beforeEach(async () => {
      await TestBed.configureTestingModule({
        imports: [AgentDetailComponent],
        providers: [
          provideRouter([]),
          provideHttpClient(),
          provideHttpClientTesting(),
          provideMarkdown(),
          ContentService,
          TocService,
          {
            provide: ActivatedRoute,
            useValue: {
              paramMap: of(convertToParamMap({})),
            },
          },
        ],
      }).compileComponents();

      fixture = TestBed.createComponent(AgentDetailComponent);
      component = fixture.componentInstance;
      tocService = TestBed.inject(TocService);
      fixture.detectChanges();
    });

    it('devrait avoir agentId vide', () => {
      expect(component.agentId()).toBe('');
    });

    it('ne devrait pas être en notFound (pas encore)', () => {
      // notFound nécessite que agentId ne soit pas vide ET agent undefined
      expect(component.notFound()).toBeFalse();
    });

    it('devrait avoir agent = undefined', () => {
      expect(component.agent()).toBeUndefined();
    });
  });

  // === TESTS DES MÉTHODES UTILITAIRES ===
  describe('getCategoryLabel', () => {
    beforeEach(async () => {
      await setupComponent('orchestrateur');
    });

    it('devrait retourner le label français', () => {
      expect(component.getCategoryLabel('build')).toBe('Build');
      expect(component.getCategoryLabel('qualité')).toBe('Qualité');
      expect(component.getCategoryLabel('infrastructure')).toBe('Infrastructure');
    });
  });

  // === TEST DE L'AGENT FRONT ===
  describe('avec l\'agent front', () => {
    beforeEach(async () => {
      await setupComponent('front');
    });

    it('devrait charger les données du front', () => {
      expect(component.agent()?.name).toBe('Front');
      expect(component.agent()?.emoji).toBe('🎨');
      expect(component.sourcePath()).toBe('agents/front.md');
    });
  });

  // === TEST DE L'AGENT GENERAL ===
  describe('avec l\'agent general', () => {
    beforeEach(async () => {
      await setupComponent('general');
    });

    it('devrait charger les données du general', () => {
      expect(component.agent()?.name).toBe('General');
      expect(component.agent()?.category).toBe('infrastructure');
      expect(component.agent()?.route).toBe('ADAPT');
    });
  });
});
