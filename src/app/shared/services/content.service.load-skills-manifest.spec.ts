import { TestBed } from '@angular/core/testing';
import { provideHttpClient } from '@angular/common/http';
import { HttpTestingController, provideHttpClientTesting } from '@angular/common/http/testing';
import { ContentService } from './content.service';
import type { Skill } from '@shared/models';

/** Génère un contenu Markdown avec frontmatter YAML valide */
function skillYaml(title: string, category: string, order: number, desc = '', emoji = ''): string {
  const emojiLine = emoji ? `emoji: ${emoji}\n` : '';
  return `---\ntitle: ${title}\ndescription: ${desc}\ncategory: ${category}\norder: ${order}\n${emojiLine}---\n# ${title}\n\nContenu du skill.`;
}

/** Nombre total de skills dans CONTENT_REGISTRY */
const TOTAL_SKILLS = 3;

describe('ContentService — loadSkillsManifest()', () => {
  let service: ContentService;
  let httpMock: HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [provideHttpClient(), provideHttpClientTesting(), ContentService],
    });
    service = TestBed.inject(ContentService);
    httpMock = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpMock.verify();
  });

  function flushAllSkills(withResponses?: Map<string, string | { status: number; statusText: string }>): void {
    // Utiliser match() car toutes les 3 requêtes sont déjà en attente
    const requests = httpMock.match((r) => r.url.startsWith('/content/skills/'));
    expect(requests.length).toBe(TOTAL_SKILLS);
    for (const req of requests) {
      const key = req.request.url.replace('/content/', '');

      if (withResponses?.has(key)) {
        const response = withResponses.get(key)!;
        if (typeof response === 'string') {
          req.flush(response);
        } else {
          req.flush('Not Found', response);
        }
      } else {
        // Default: valid but minimal YAML
        const id = key.replace('skills/', '').replace('.md', '');
        req.flush(skillYaml(id, 'creation', 99, ''));
      }
    }
  }

  it('devrait charger et parser le frontmatter YAML correctement', (done) => {
    service.loadSkillsManifest().subscribe((skills: Skill[]) => {
      // Trouver ui-ux-pro-max qui devrait être en premier (order: 1)
      const ux = skills.find((s) => s.id === 'ui-ux-pro-max');
      expect(ux).toBeDefined();
      if (ux) {
        expect(ux.name).toBe('UI/UX Pro Max');
        expect(ux.category).toBe('creation');
        expect(ux.order).toBe(1);
      }
      done();
    });

    const responses = new Map<string, string>();
    responses.set(
      'skills/ui-ux-pro-max.md',
      skillYaml('UI/UX Pro Max', 'creation', 1, 'Intelligence de design UI/UX avec 67 styles.', '🎨'),
    );
    responses.set(
      'skills/tests-create.md',
      skillYaml('Tests Create', 'creation', 2, 'Génération de tests unitaires, E2E.', '🧪'),
    );
    flushAllSkills(responses);
  });

  it('devrait trier les skills par ordre croissant', (done) => {
    service.loadSkillsManifest().subscribe((skills: Skill[]) => {
      expect(skills.length).toBe(TOTAL_SKILLS);
      for (let i = 1; i < skills.length; i++) {
        expect(skills[i].order).toBeGreaterThanOrEqual(skills[i - 1].order);
      }
      done();
    });

    flushAllSkills();
  });

  it('devrait gérer un YAML invalide avec les valeurs par défaut', (done) => {
    const badYaml = `---\ntitle: "Titre cassé\ndescription: incomplet\n---\n# Contenu`;

    service.loadSkillsManifest().subscribe((skills: Skill[]) => {
      // Le skill avec YAML invalide devrait avoir les fallbacks
      const badSkill = skills.find((s) => s.sourcePath === 'skills/ui-ux-pro-max.md');
      expect(badSkill).toBeDefined();
      if (badSkill) {
        // Le fallback name c'est l'id extrait du chemin
        expect(badSkill.id).toBe('ui-ux-pro-max');
        // La catégorie par défaut est 'creation'
        expect(badSkill.category).toBe('creation');
      }
      done();
    });

    const responses = new Map<string, string>();
    responses.set('skills/ui-ux-pro-max.md', badYaml);
    flushAllSkills(responses);
  });

  it("devrait gérer une erreur HTTP avec un fallback minimal", (done) => {
    service.loadSkillsManifest().subscribe((skills: Skill[]) => {
      expect(skills.length).toBe(TOTAL_SKILLS);
      const fallback = skills.find((s) => s.sourcePath === 'skills/ui-ux-pro-max.md');
      expect(fallback).toBeDefined();
      if (fallback) {
        expect(fallback.id).toBe('ui-ux-pro-max');
        expect(fallback.emoji).toBe('📦');
        expect(fallback.category).toBe('creation');
        expect(fallback.order).toBe(99);
      }
      done();
    });

    const responses = new Map<string, string | { status: number; statusText: string }>();
    responses.set('skills/ui-ux-pro-max.md', { status: 404, statusText: 'Not Found' });
    flushAllSkills(responses);
  });

  it("devrait utiliser l'emoji du YAML s'il est présent", (done) => {
    service.loadSkillsManifest().subscribe((skills: Skill[]) => {
      const skill = skills.find((s) => s.sourcePath === 'skills/ui-ux-pro-max.md');
      expect(skill?.emoji).toBe('🎨');
      done();
    });

    const responses = new Map<string, string>();
    responses.set(
      'skills/ui-ux-pro-max.md',
      skillYaml('UI/UX Pro Max', 'creation', 1, 'Design intelligence', '🎨'),
    );
    flushAllSkills(responses);
  });

  it("devrait appliquer le fallback emoji par catégorie si l'emoji est absent du YAML", (done) => {
    service.loadSkillsManifest().subscribe((skills: Skill[]) => {
      const auditSkill = skills.find((s) => s.id === 'audit-global');
      expect(auditSkill).toBeDefined();
      if (auditSkill) {
        // Pas d'emoji dans le YAML — le fallback pour 'audit' est '🔍'
        expect(auditSkill.emoji).toBe('🔍');
      }
      done();
    });

    const responses = new Map<string, string>();
    // audit-global without emoji — category 'audit' fallback should be 🔍
    responses.set(
      'skills/audit-global.md',
      skillYaml('Audit Global', 'audit', 5, 'Audit complet du projet.'),
    );
    flushAllSkills(responses);
  });

  it("devrait retourner uniquement les entrées de la section Skills", (done) => {
    service.loadSkillsManifest().subscribe((skills: Skill[]) => {
      // Tous les skills devraient venir de src/content/skills/
      skills.forEach((s) => {
        expect(s.sourcePath).toMatch(/^skills\//);
      });
      done();
    });

    flushAllSkills();
  });
});
