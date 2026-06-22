import { skillsRoutes } from './skills.routes';
import { SkillsListComponent } from './skills-list.component';
import { SkillDetailComponent } from './skill-detail.component';

describe('SkillsRoutes', () => {
  it('devrait avoir exactement 2 routes', () => {
    expect(skillsRoutes.length).toBe(2);
  });

  it('la première route (path: "") devrait charger SkillsListComponent', () => {
    const listRoute = skillsRoutes[0];
    expect(listRoute.path).toBe('');
    expect(listRoute.component).toBe(SkillsListComponent);
  });

  it('la deuxième route (path: ":id") devrait charger SkillDetailComponent', () => {
    const detailRoute = skillsRoutes[1];
    expect(detailRoute.path).toBe(':id');
    expect(detailRoute.component).toBe(SkillDetailComponent);
  });

  it('aucune route ne devrait avoir de routes enfants', () => {
    skillsRoutes.forEach((route) => {
      expect(route.children).toBeUndefined();
    });
  });
});
