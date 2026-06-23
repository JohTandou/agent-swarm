# Architecture Multi-Agents

Ce document définit l'architecture des agents du pipeline et les outils qu'ils sont autorisés à utiliser.

---

## Agents du Pipeline

| Agent | Responsabilité | Contraintes |
|---|---|---|
| **build** | Orchestrateur : classification, routage, gates, commit final | Édition restreinte (`.agent-memory.json` uniquement) |
| **search** | Analyse du codebase, cartographie des dépendances, doc frameworks (Context7) | Lecture seule absolue |
| **planner** | Planification, choix architecturaux, soumission des décisions à l'utilisateur | Lecture seule, ne code jamais |
| **contract** | Types TypeScript, spec OpenAPI, migrations Supabase | Route FULL uniquement |
| **front** | Implémentation UI (Magic/21st.dev), composants React, intégration MCP | Utilise les MCP magic_* et context7_* |
| **back** | Implémentation backend, API, base de données (Supabase) | Utilise les MCP supabase_* et context7_* |
| **tester** | Génère tests manquants, exécute tests ciblés, mesure couverture (≥80%) | Additif uniquement, ne modifie jamais le code de production |
| **reviewer** | Gate sécurité, qualité, audit des tests avant commit | Routes MEDIUM/FULL uniquement, après tester PASS |
| **writer** | Mise à jour CHANGELOG, API.md, ARCHITECTURE.md, README | Déclenché sur MEDIUM (endpoint public), FULL, /docs |

---

## Outils Disponibles

> **À SAVOIR** : Les outils MCP (21st.dev, Supabase, Vercel, Render, Playwright, Context7) sont l'interface **primaire et native** pour les agents. Le seul wrapper bash restant est `mcp-playwright.sh` pour l'exécution de tests E2E (`npx playwright test`), qui n'a pas d'équivalent MCP. Les commandes CLI brutes (`supabase db push`, `vercel deploy`, `npx playwright test`) restent interdites.

### Wrapper Playwright

| Script | Service | Usage |
|---|---|---|
| `mcp-playwright.sh` | Playwright | Tests E2E (`--run`), mode UI (`--ui`), debug (`--debug`), rapport (`--report`) |

Les autres services (Supabase, Vercel, Render, 21st.dev) sont exclusivement accessibles via leurs outils MCP natifs.

---

## Référence des Scripts

### `mcp-playwright.sh`

Tests end-to-end via `npx playwright`.

```bash
# Lancer tous les tests
~/.opencode/scripts/mcp-playwright.sh --run

# Lancer un fichier de test spécifique
~/.opencode/scripts/mcp-playwright.sh --run "tests/login.spec.ts"

# Ouvrir le mode UI
~/.opencode/scripts/mcp-playwright.sh --ui

# Mode debug
~/.opencode/scripts/mcp-playwright.sh --debug

# Afficher le dernier rapport HTML
~/.opencode/scripts/mcp-playwright.sh --report
```

**Prérequis** : `npx` disponible, `@playwright/test` installé dans le projet.
**Retour** : JSON (mode `--run`), ou message structuré (modes interactifs).

---

## Logging

Le wrapper Playwright écrit ses logs dans `/tmp/mcp-playwright.log`.

---

## Conventions

1. **MCP natif pour tout** : Supabase, Vercel, Render, 21st.dev, Context7 sont accessibles via leurs outils MCP natifs. Ne jamais utiliser de commandes CLI directes.
2. **Wrapper Playwright uniquement** : `mcp-playwright.sh` pour `npx playwright test` (pas d'équivalent MCP).
3. **Vérifier le JSON de retour** : Chaque script retourne du JSON structuré. Vérifier le champ `status`.
4. **Répertoire de travail** : Exécuter les scripts depuis la racine du projet.

---

## Diagramme d'Architecture

```
┌─────────┐   ┌─────────┐   ┌─────────┐   ┌─────────┐
│  front  │   │  back   │   │ tester  │   │reviewer │
└────┬────┘   └────┬────┘   └────┬────┘   └────┬────┘
     │             │             │             │
     └─────────────┴─────────────┴─────────────┘
                               │
                    ┌──────────┴──────────┐
                    │   Outils MCP natifs  │
                    │ + mcp-playwright.sh  │
                    └──────────┬──────────┘
                               │
          ┌──────────┬─────────┼──────────┬──────────┐
          │          │         │          │          │
     ┌────▼────┐ ┌───▼───┐ ┌──▼──┐  ┌────▼────┐ ┌───▼───┐
     │ 21st.dev│ │Supabase│ │Vercel│  │ Render  │ │Playwright│
     │  (MCP)  │ │ (MCP)  │ │(MCP) │  │ (MCP)   │ │(wrapper)│
     └─────────┘ └───────┘ └─────┘  └─────────┘ └─────────┘
```
