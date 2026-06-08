import { ComponentFixture, TestBed } from '@angular/core/testing';
import { SparkleEffectComponent } from './sparkle-effect.component';
import { By } from '@angular/platform-browser';

describe('SparkleEffectComponent', () => {
  let component: SparkleEffectComponent;
  let fixture: ComponentFixture<SparkleEffectComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SparkleEffectComponent],
    }).compileComponents();
    fixture = TestBed.createComponent(SparkleEffectComponent);
    component = fixture.componentInstance;
  });

  it('devrait créer le composant', () => {
    expect(component).toBeTruthy();
  });

  it('ne devrait pas afficher les particules quand active est false', () => {
    component.active = false;
    fixture.detectChanges();
    const container = fixture.debugElement.query(By.css('.sparkle-container'));
    expect(container).toBeNull();
  });

  it('devrait afficher 16 particules quand active est true', () => {
    component.active = true;
    component.ngOnChanges({ active: { currentValue: true, previousValue: false, firstChange: true, isFirstChange: () => true } } as any);
    fixture.detectChanges();
    const particles = fixture.debugElement.queryAll(By.css('.sparkle'));
    expect(particles.length).toBe(16);
  });
});
