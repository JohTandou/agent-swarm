import { TestBed } from '@angular/core/testing';
import { TranslationService } from './translation.service';
import { LanguageService } from './language.service';

describe('TranslationService', () => {
  let translationService: TranslationService;
  let languageService: LanguageService;

  function setPathname(pathname: string): void {
    Object.defineProperty(window, 'location', {
      value: { ...window.location, pathname },
      writable: true,
    });
  }

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [TranslationService],
    });
    languageService = TestBed.inject(LanguageService);
    translationService = TestBed.inject(TranslationService);
  });

  it('devrait traduire en français', () => {
    setPathname('/');
    languageService.setLang('fr');
    expect(translationService.translate('nav.home')).toBe('Accueil');
    expect(translationService.translate('nav.agents')).toBe('Agents');
    expect(translationService.translate('footer.credit')).toBe('Conçu et orchestré par');
  });

  it('devrait traduire en anglais', () => {
    setPathname('/en/');
    languageService.setLang('en');
    expect(translationService.translate('nav.home')).toBe('Home');
    expect(translationService.translate('nav.agents')).toBe('Agents');
    expect(translationService.translate('footer.credit')).toBe('Designed and orchestrated by');
  });

  it('devrait retourner la clé si la traduction n\'existe pas', () => {
    languageService.setLang('fr');
    expect(translationService.translate('cle.inexistante')).toBe('cle.inexistante');

    languageService.setLang('en');
    expect(translationService.translate('missing.key')).toBe('missing.key');
  });

  it('devrait changer de langue dynamiquement', () => {
    languageService.setLang('fr');
    expect(translationService.translate('notfound.home')).toBe('Retour à la ruche');

    languageService.setLang('en');
    expect(translationService.translate('notfound.home')).toBe('Back to the hive');
  });

  it('devrait gérer les clés de recherche', () => {
    languageService.setLang('fr');
    expect(translationService.translate('search.placeholder')).toBe('Rechercher un agent, un skill…');
    expect(translationService.translate('search.noResults')).toBe('Aucun résultat');

    languageService.setLang('en');
    expect(translationService.translate('search.placeholder')).toBe('Search agents, skills…');
    expect(translationService.translate('search.noResults')).toBe('No results');
  });
});
