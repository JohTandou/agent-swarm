import { TestBed } from '@angular/core/testing';
import { Title, Meta } from '@angular/platform-browser';
import { SeoService } from './seo.service';

describe('SeoService', () => {
  let service: SeoService;
  let titleSpy: jasmine.Spy;
  let metaSpy: jasmine.Spy;

  beforeEach(() => {
    titleSpy = jasmine.createSpy('setTitle');
    metaSpy = jasmine.createSpy('updateTag');

    TestBed.configureTestingModule({
      providers: [
        { provide: Title, useValue: { setTitle: titleSpy } },
        { provide: Meta, useValue: { updateTag: metaSpy } },
        SeoService,
      ],
    });
    service = TestBed.inject(SeoService);
  });

  it('devrait mettre à jour le titre avec le suffixe Swarm Wiki', () => {
    service.updatePageMeta({ title: 'Accueil', description: 'Test desc' });
    expect(titleSpy).toHaveBeenCalledWith('Accueil — Swarm Wiki');
  });

  it('ne devrait pas dupliquer le suffixe Swarm Wiki dans le titre', () => {
    service.updatePageMeta({ title: 'Accueil — Swarm Wiki', description: 'Test desc' });
    expect(titleSpy).toHaveBeenCalledWith('Accueil — Swarm Wiki');
  });

  it('devrait mettre à jour la meta description', () => {
    service.updatePageMeta({ title: 'Test', description: 'Une description' });
    expect(metaSpy).toHaveBeenCalledWith({ name: 'description', content: 'Une description' });
  });

  it('devrait mettre à jour les OG tags', () => {
    service.updatePageMeta({ title: 'Test', description: 'Desc', image: 'https://example.com/img.jpg', type: 'article' });
    expect(metaSpy).toHaveBeenCalledWith({ property: 'og:title', content: 'Test — Swarm Wiki' });
    expect(metaSpy).toHaveBeenCalledWith({ property: 'og:type', content: 'article' });
  });

  it('ne devrait pas définir de meta author si absent', () => {
    service.updatePageMeta({ title: 'Test', description: 'Desc' });
    const authorCalls = metaSpy.calls.allArgs().filter((args: unknown[]) => {
      const arg = args[0] as { name?: string };
      return arg?.name === 'author';
    });
    expect(authorCalls.length).toBe(0);
  });

  it('devrait définir twitter:card summary_large_image si image présente', () => {
    service.updatePageMeta({ title: 'Test', description: 'Desc', image: 'img.jpg' });
    expect(metaSpy).toHaveBeenCalledWith({ name: 'twitter:card', content: 'summary_large_image' });
  });
});
