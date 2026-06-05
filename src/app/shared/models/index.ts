/**
 * Barrel export — modèles partagés du shell applicatif et du système de contenu.
 * Centralise tous les exports pour un import unique depuis '@shared/models'.
 * Utilise `export type` pour la compatibilité `isolatedModules` TypeScript.
 */

// Shell applicatif (T1)
export type { NavItem } from './navigation.model';
export type { Breadcrumb } from './breadcrumb.model';
export type { TocEntry } from './toc-entry.model';
export type { ShellConfig } from './shell-config.model';

// Système de contenu (T2)
export type { CalloutType } from './callout-type.model';
export type { MarkdownFrontmatter } from './markdown-frontmatter.model';
export type { HeadingNode } from './heading-node.model';
export type { MarkdownDocument } from './markdown-document.model';
export type { MarkdownConfig } from './markdown-config.model';
