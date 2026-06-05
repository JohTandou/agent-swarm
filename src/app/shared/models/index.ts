/**
 * Barrel export — modèles partagés du shell applicatif.
 * Centralise tous les exports pour un import unique depuis '@shared/models'.
 * Utilise `export type` pour la compatibilité `isolatedModules` TypeScript.
 */

export type { NavItem } from './navigation.model';
export type { Breadcrumb } from './breadcrumb.model';
export type { TocEntry } from './toc-entry.model';
export type { ShellConfig } from './shell-config.model';
