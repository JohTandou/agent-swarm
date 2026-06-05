import { Routes } from '@angular/router';
import { SkillsListComponent } from './skills-list.component';
import { SkillDetailComponent } from './skill-detail.component';

/**
 * Routes de la section Skills.
 * Lazy loading par feature — chargé à la demande.
 * Route avec paramètre :id pour les pages de détail.
 */
export const skillsRoutes: Routes = [
  { path: '', component: SkillsListComponent },
  { path: ':id', component: SkillDetailComponent },
];
