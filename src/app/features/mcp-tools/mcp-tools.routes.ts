import { Routes } from '@angular/router';
import { McpToolsComponent } from './mcp-tools.component';

/**
 * Routes pour la section Outils MCP.
 * Route avec paramètre :category pour les 6 catégories :
 * supabase, vercel, render, playwright.
 * Redirection de la racine vers supabase.
 */
export const mcpToolsRoutes: Routes = [
  { path: '', redirectTo: 'supabase', pathMatch: 'full' },
  { path: ':category', component: McpToolsComponent },
];
