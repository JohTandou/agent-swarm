import { ComponentFixture, TestBed } from '@angular/core/testing';
import { Component } from '@angular/core';
import { UiButtonComponent } from './ui-button.component';

/**
 * Composant hôte pour tester la projection de contenu (ng-content).
 */
@Component({
  standalone: true,
  imports: [UiButtonComponent],
  template: `<app-ui-button>Cliquez ici</app-ui-button>`,
})
class HostComponent {}

describe('UiButtonComponent', () => {
  let component: UiButtonComponent;
  let fixture: ComponentFixture<UiButtonComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [UiButtonComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(UiButtonComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it("devrait créer le composant", () => {
    expect(component).toBeTruthy();
  });

  it("devrait appliquer le variant par défaut (primary)", () => {
    const button: HTMLButtonElement = fixture.nativeElement.querySelector('.ui-button');
    expect(button.classList).toContain('ui-button--primary');
  });

  it("devrait appliquer la taille par défaut (md)", () => {
    const button: HTMLButtonElement = fixture.nativeElement.querySelector('.ui-button');
    expect(button.classList).toContain('ui-button--md');
  });

  describe('Variants CSS', () => {
    const variants = ['primary', 'secondary', 'outline', 'ghost', 'destructive', 'icon'] as const;

    for (const variant of variants) {
      it(`devrait appliquer la classe CSS pour le variant ${variant}`, () => {
        component.variant = variant;
        fixture.detectChanges();
        const button: HTMLButtonElement = fixture.nativeElement.querySelector('.ui-button');
        expect(button.classList).toContain(`ui-button--${variant}`);
      });
    }
  });

  describe('Tailles CSS', () => {
    const sizes = ['sm', 'md', 'lg'] as const;

    for (const size of sizes) {
      it(`devrait appliquer la classe CSS pour la taille ${size}`, () => {
        component.size = size;
        fixture.detectChanges();
        const button: HTMLButtonElement = fixture.nativeElement.querySelector('.ui-button');
        expect(button.classList).toContain(`ui-button--${size}`);
      });
    }
  });

  describe('État disabled', () => {
    it("devrait désactiver le bouton quand disabled est true", () => {
      component.disabled = true;
      fixture.detectChanges();
      const button: HTMLButtonElement = fixture.nativeElement.querySelector('.ui-button');
      expect(button.disabled).toBeTrue();
    });

    it("ne devrait pas être désactivé quand disabled est false", () => {
      component.disabled = false;
      fixture.detectChanges();
      const button: HTMLButtonElement = fixture.nativeElement.querySelector('.ui-button');
      expect(button.disabled).toBeFalse();
    });
  });

  describe('État loading', () => {
    it("devrait afficher les dots de chargement quand loading est true", () => {
      component.loading = true;
      fixture.detectChanges();
      const dotsContainer = fixture.nativeElement.querySelector('.ui-button__dots');
      expect(dotsContainer).toBeTruthy();
      const dots = fixture.nativeElement.querySelectorAll('.ui-button__dot');
      expect(dots.length).toBe(3);
    });

    it("ne devrait pas afficher les dots quand loading est false", () => {
      component.loading = false;
      fixture.detectChanges();
      const dotsContainer = fixture.nativeElement.querySelector('.ui-button__dots');
      expect(dotsContainer).toBeFalsy();
    });

    it("devrait désactiver le bouton quand loading est true", () => {
      component.loading = true;
      fixture.detectChanges();
      const button: HTMLButtonElement = fixture.nativeElement.querySelector('.ui-button');
      expect(button.disabled).toBeTrue();
    });

    it("devrait avoir la classe ui-button--loading quand loading est true", () => {
      component.loading = true;
      fixture.detectChanges();
      const button: HTMLButtonElement = fixture.nativeElement.querySelector('.ui-button');
      expect(button.classList).toContain('ui-button--loading');
    });

    it("devrait avoir aria-busy=true quand loading est true", () => {
      component.loading = true;
      fixture.detectChanges();
      const button: HTMLButtonElement = fixture.nativeElement.querySelector('.ui-button');
      expect(button.getAttribute('aria-busy')).toBe('true');
    });

    it("ne devrait pas avoir aria-busy quand loading est false", () => {
      component.loading = false;
      fixture.detectChanges();
      const button: HTMLButtonElement = fixture.nativeElement.querySelector('.ui-button');
      expect(button.getAttribute('aria-busy')).toBeNull();
    });

    it("devrait désactiver le bouton même si disabled=false quand loading=true", () => {
      component.disabled = false;
      component.loading = true;
      fixture.detectChanges();
      const button: HTMLButtonElement = fixture.nativeElement.querySelector('.ui-button');
      expect(button.disabled).toBeTrue();
    });
  });

  describe('Type HTML', () => {
    it("devrait avoir type=button par défaut", () => {
      const button: HTMLButtonElement = fixture.nativeElement.querySelector('.ui-button');
      expect(button.type).toBe('button');
    });

    it("devrait appliquer type=submit quand spécifié", () => {
      component.type = 'submit';
      fixture.detectChanges();
      const button: HTMLButtonElement = fixture.nativeElement.querySelector('.ui-button');
      expect(button.type).toBe('submit');
    });
  });

  describe('Projection de contenu (ng-content)', () => {
    it("devrait projeter le contenu texte dans le bouton", () => {
      const hostFixture = TestBed.createComponent(HostComponent);
      hostFixture.detectChanges();
      const button: HTMLButtonElement = hostFixture.nativeElement.querySelector('.ui-button');
      expect(button.textContent?.trim()).toBe('Cliquez ici');
    });

    it("ne devrait pas projeter le contenu quand loading est true", () => {
      // Créer un host avec loading=true
      const hostFixture = TestBed.createComponent(UiButtonComponent);
      hostFixture.componentInstance.loading = true;
      hostFixture.detectChanges();
      const button: HTMLButtonElement = hostFixture.nativeElement.querySelector('.ui-button');
      // Le contenu projeté est remplacé par les dots
      const dotsContainer = button.querySelector('.ui-button__dots');
      expect(dotsContainer).toBeTruthy();
    });
  });

  describe('Classe icon', () => {
    it("devrait ajouter ui-button--icon quand variant est icon", () => {
      component.variant = 'icon';
      fixture.detectChanges();
      const button: HTMLButtonElement = fixture.nativeElement.querySelector('.ui-button');
      expect(button.classList).toContain('ui-button--icon');
    });

    it("ne devrait pas avoir ui-button--icon quand variant est primary", () => {
      component.variant = 'primary';
      fixture.detectChanges();
      const button: HTMLButtonElement = fixture.nativeElement.querySelector('.ui-button');
      expect(button.classList).not.toContain('ui-button--icon');
    });
  });
});
