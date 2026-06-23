Explique le pipeline Agent Swarm a l'utilisateur :

**5 routes disponibles :**
- DIRECT : tu reponds directement (questions, explications)
- SIMPLE : 1-2 fichiers, pas de contrat (crons, scripts, fix isole)
- ADAPT : copier/adapter depuis un autre projet
- MEDIUM : feature mono-domaine (front only ou back only)
- FULL : feature complete front + back + DB

**Agents disponibles :**
- search : analyse codebase + doc frameworks (Context7)
- planner : planification + choix architecturaux
- contract : types TypeScript + spec OpenAPI + migrations SQL
- front : implementation UI (21st.dev Magic + ui-ux-pro-max)
- back : implementation backend + scripts/crons
- tester : execution tests + categorisation erreurs
- reviewer : gate securite + qualite avant commit
- writer : documentation (CHANGELOG, API.md, ARCHITECTURE.md)
- build : orchestration des agents

**Commandes disponibles :**
/status — metriques des derniers runs
/docs — mise a jour documentation maintenant
/help — cette aide