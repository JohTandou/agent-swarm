import { Routes } from '@angular/router';
import { SkillsListComponent } from './skills-list.component';
import { SkillDetailComponent } from './skill-detail.component';

/**
 * Routes de la section Skills.
 * Lazy loading par feature — chaque skill documenté en Markdown.
 */
export const skillsRoutes: Routes = [
  { path: '', component: SkillsListComponent },
  { path: ':id', component: SkillDetailComponent },
];
