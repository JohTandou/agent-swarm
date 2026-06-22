import { Component, Input, OnChanges, SimpleChanges } from '@angular/core';

@Component({
  selector: 'app-sparkle-effect',
  standalone: true,
  templateUrl: './sparkle-effect.component.html',
  styleUrls: ['./sparkle-effect.component.scss'],
})
export class SparkleEffectComponent implements OnChanges {
  @Input() active = false;

  particles: { x: number; y: number; delay: number; color: string }[] = [];

  private readonly colors = ['#C4780D', '#F5F0EB', '#7A8899'];
  private readonly count = 16;

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['active']?.currentValue === true) {
      this.generateParticles();
    }
  }

  private generateParticles(): void {
    this.particles = Array.from({ length: this.count }, () => ({
      x: Math.random() * 100,
      y: Math.random() * 100,
      delay: Math.random() * 600,
      color: this.colors[Math.floor(Math.random() * this.colors.length)],
    }));
  }
}
