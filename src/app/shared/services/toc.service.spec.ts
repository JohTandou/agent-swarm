import { TestBed } from '@angular/core/testing';
import { TocService } from './toc.service';
import type { TocEntry } from '@shared/models';

describe('TocService', () => {
  let service: TocService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [TocService],
    });
    service = TestBed.inject(TocService);
  });

  it('devrait être créé', () => {
    expect(service).toBeTruthy();
  });

  it('devrait initialiser avec un tableau vide d\'entrées', () => {
    expect(service.entries()).toEqual([]);
  });

  it('devrait initialiser avec un activeId vide', () => {
    expect(service.activeId()).toBe('');
  });

  describe('setEntries()', () => {
    it('devrait remplacer les entrées de la TOC', () => {
      const entries: TocEntry[] = [
        { id: 'intro', label: 'Introduction', level: 1 },
        { id: 'archi', label: 'Architecture', level: 1 },
      ];
      service.setEntries(entries);
      expect(service.entries()).toEqual(entries);
      expect(service.entries().length).toBe(2);
    });

    it('devrait accepter un tableau vide', () => {
      service.setEntries([{ id: 'test', label: 'Test', level: 1 }]);
      service.setEntries([]);
      expect(service.entries()).toEqual([]);
    });

    it('devrait remplacer les entrées existantes, pas les fusionner', () => {
      service.setEntries([{ id: 'a', label: 'A', level: 1 }]);
      service.setEntries([{ id: 'b', label: 'B', level: 1 }]);
      expect(service.entries().length).toBe(1);
      expect(service.entries()[0].id).toBe('b');
    });
  });

  describe('setActiveId()', () => {
    it('devrait définir l\'ID actif', () => {
      service.setActiveId('intro');
      expect(service.activeId()).toBe('intro');
    });

    it('devrait remplacer l\'ID actif précédent', () => {
      service.setActiveId('intro');
      service.setActiveId('archi');
      expect(service.activeId()).toBe('archi');
    });

    it('devrait accepter une chaîne vide', () => {
      service.setActiveId('intro');
      service.setActiveId('');
      expect(service.activeId()).toBe('');
    });
  });

  describe('clear()', () => {
    it('devrait réinitialiser les entrées et l\'ID actif', () => {
      service.setEntries([{ id: 'intro', label: 'Introduction', level: 1 }]);
      service.setActiveId('intro');
      service.clear();
      expect(service.entries()).toEqual([]);
      expect(service.activeId()).toBe('');
    });

    it('devrait être idempotent (appelé plusieurs fois)', () => {
      service.clear();
      service.clear();
      expect(service.entries()).toEqual([]);
      expect(service.activeId()).toBe('');
    });
  });
});
