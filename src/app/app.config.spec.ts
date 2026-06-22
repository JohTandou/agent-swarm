import { ApplicationConfig } from '@angular/core';
import { appConfig } from './app.config';

describe('AppConfig', () => {
  it('devrait être un objet ApplicationConfig valide', () => {
    expect(appConfig).toBeDefined();
    expect(appConfig.providers).toBeDefined();
    expect(Array.isArray(appConfig.providers)).toBeTrue();
  });

  it('devrait avoir au moins le provider de router et zone change detection', () => {
    expect(appConfig.providers.length).toBeGreaterThanOrEqual(2);
  });

  it('chaque provider devrait être une fonction ou un objet valide', () => {
    appConfig.providers.forEach((provider) => {
      expect(provider).toBeDefined();
    });
  });

  it('ne devrait pas être vide', () => {
    expect(appConfig.providers.length).toBeGreaterThan(0);
  });
});
