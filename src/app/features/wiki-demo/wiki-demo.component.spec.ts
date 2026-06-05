import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideHttpClient } from '@angular/common/http';
import { provideHttpClientTesting } from '@angular/common/http/testing';
import { provideMarkdown } from 'ngx-markdown';
import { WikiDemoComponent } from './wiki-demo.component';
import { TocService } from '../../shared/services/toc.service';
import type { TocEntry } from '@shared/models';

describe('WikiDemoComponent', () => {
  let component: WikiDemoComponent;
  let fixture: ComponentFixture<WikiDemoComponent>;
  let tocService: TocService;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [WikiDemoComponent],
      providers: [provideHttpClient(), provideHttpClientTesting(), provideMarkdown(), TocService],
    }).compileComponents();

    fixture = TestBed.createComponent(WikiDemoComponent);
    component = fixture.componentInstance;
    tocService = TestBed.inject(TocService);
    fixture.detectChanges();
  });

  it('devrait créer le composant', () => {
    expect(component).toBeTruthy();
  });

  it('devrait afficher le titre "Système de contenu statique"', () => {
    const titleEl: HTMLElement = fixture.nativeElement.querySelector('.wiki-demo__title');
    expect(titleEl).toBeTruthy();
    expect(titleEl.textContent?.trim()).toBe('Système de contenu statique');
  });

  it('devrait afficher l\'eyebrow "Démonstration"', () => {
    const eyebrow: HTMLElement = fixture.nativeElement.querySelector('.wiki-demo__eyebrow');
    expect(eyebrow).toBeTruthy();
    expect(eyebrow.textContent?.trim()).toBe('Démonstration');
  });

  it('devrait afficher le sous-titre', () => {
    const subtitle: HTMLElement = fixture.nativeElement.querySelector('.wiki-demo__subtitle');
    expect(subtitle).toBeTruthy();
    expect(subtitle.textContent).toContain('Markdown riche');
  });

  it('devrait rendre le composant app-markdown-renderer', () => {
    const renderer = fixture.nativeElement.querySelector('app-markdown-renderer');
    expect(renderer).toBeTruthy();
    expect(renderer.getAttribute('ng-reflect-source-path')).toBe('demo.md');
    expect(renderer.getAttribute('ng-reflect-enable-mermaid')).toBe('true');
    expect(renderer.getAttribute('ng-reflect-enable-prism')).toBe('true');
  });

  describe('onTocEntries()', () => {
    it('devrait transmettre les entrées au TocService', () => {
      const entries: TocEntry[] = [
        { id: 'intro', label: 'Introduction', level: 1 },
        { id: 'details', label: 'Détails', level: 2 },
      ];
      component.onTocEntries(entries);
      expect(tocService.entries()).toEqual(entries);
    });
  });
});
