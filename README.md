# 🐝 Swarm — AI Agent Pipeline for OpenCode

[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)
[![Wiki](https://img.shields.io/badge/wiki-swarm--wiki.vercel.app-C4780D)](https://swarm-wiki.vercel.app/en)

**Swarm** is an AI agent pipeline that automates the entire software development lifecycle — from issue to merged PR. Nine specialized agents collaborate in parallel: they classify tasks, plan architecture, implement frontend and backend, generate tests, review code, and write documentation. All orchestrated by a single prompt in [OpenCode](https://opencode.ai).

> Built by **Joh Tandou** — [github.com/JohTandou](https://github.com/JohTandou)

---

## 🚀 Quick Start: Install Swarm in 3 Minutes

### Prerequisites

- **[OpenCode](https://opencode.ai)** installed
- **Node.js** ≥ 18
- **Git**

### 1. Clone the repository

```bash
git clone https://github.com/JohTandou/agent-swarm.git
```

### 2. Copy Swarm configuration to your OpenCode directory

```bash
# Copy agents, skills, commands, and workflow config
cp -r agent-swarm/.opencode/* ~/.opencode/

# Copy OpenCode configuration (model, MCP servers, permissions)
cp agent-swarm/opencode.json ~/.config/opencode/opencode.json
```

### 3. Configure API keys

```bash
# Copy the environment template
cp agent-swarm/.env.example ~/.config/opencode/.env

# Edit the file and replace each placeholder with your actual API key
# You need at minimum:
#   - DEEPSEEK_API_KEY (for agent LLM)
#   - OPENCODE_API_KEY (for OpenCode provider)
# Optional MCP integrations:
#   - SUPABASE_ACCESS_TOKEN + SUPABASE_PROJECT_REF
#   - MAGIC_21ST_API_KEY
#   - CONTEXT7_API_KEY
#   - VERCEL_TOKEN
#   - RENDER_API_KEY
```

### 4. Install tool dependencies

```bash
cd ~/.opencode/tools/github-orchestrator
npm install
```

### 5. Restart OpenCode

That's it. On your next prompt, the Orchestrator agent will classify your request and route it through the pipeline automatically.

---

## 🧠 How It Works

Swarm transforms a natural language request into a complete development cycle:

```
Your prompt → Orchestrator → Search (map codebase) → Planner (design plan)
    → Front + Back (parallel implementation) → Tester (generate & run tests)
    → Reviewer (quality gate) → Writer (update docs) → Merged PR ✅
```

The pipeline adapts automatically to task complexity through 5 routes:

| Route | Trigger | Agents | Gates |
|-------|---------|--------|-------|
| **DIRECT** | Simple question, /slash command | Orchestrator only | None |
| **SIMPLE** | 1–2 files, single domain | Orchestrator + Front or Back | Tester |
| **ADAPT** | 2–4 files, single domain | Search + Front/Back | Tester |
| **MEDIUM** | 4+ files, single domain | Search + Planner + Front/Back | Tester + Reviewer |
| **FULL** | Multi-domain, contracts, migrations | Search + Planner + Contract + Front + Back | Tester + Reviewer + Writer |

---

## 👥 The 9 Agents

| Agent | Role | Route Trigger |
|-------|------|---------------|
| 🧠 **Orchestrator** | Classifies, routes, and supervises. Your single interface. | All routes |
| 🔎 **Search** | Maps codebase, identifies impacted files (read-only). | ADAPT+ |
| 🧩 **Planner** | Designs the implementation plan. | MEDIUM+ |
| 📋 **Contract** | Writes TypeScript types, OpenAPI specs, DB migrations. | FULL |
| 🎨 **Front** | Apple-grade UI components, animations, accessibility. | SIMPLE+ |
| ⚙️ **Back** | Scripts, APIs, crons, configurations. | SIMPLE+ |
| 🧪 **Tester** | Generates tests, enforces 80% coverage, categorizes failures. | SIMPLE+ |
| 👁️ **Reviewer** | Security and quality gate (≥ 0.85 score required). | MEDIUM+ |
| ✍️ **Writer** | Updates CHANGELOG, README, and architecture docs. | MEDIUM+ |

---

## 🔌 MCP Integrations (6 native connectors)

| Integration | Purpose |
|-------------|---------|
| 🗄️ **Supabase** | Postgres database, auth, Edge Functions, migrations |
| ▲ **Vercel** | Continuous deployment, global CDN, analytics |
| ⚡ **Render** | Web services, cron jobs, managed Postgres |
| 🎭 **Playwright** | Cross-browser E2E testing (Chromium + iPhone 14) |
| 📚 **Context7** | Real-time framework documentation lookup |
| 🪄 **21st.dev** | AI-powered UI component generation |

See [MCP_SETUP.md](MCP_SETUP.md) for detailed configuration instructions.

---

## ⌨️ Slash Commands

| Command | Description |
|---------|-------------|
| `/status` | Display pipeline metrics from the last 5 runs |
| `/docs` | Trigger immediate documentation update |
| `/help` | Display Swarm pipeline help |

---

## 📖 Documentation

- **[swarm-wiki.vercel.app](https://swarm-wiki.vercel.app/en)** — Full technical wiki with every agent, skill, and workflow detail
- **[AGENTS.md](AGENTS.md)** — Project conventions: tech stack, color palette, typography, behavioral protocol
- **[.opencode/AGENTS.md](.opencode/AGENTS.md)** — Agent pipeline architecture and routing rules
- **[swarm-workflow.json](.opencode/swarm-workflow.json)** — Pipeline configuration reference

---

## 🛠️ Development (Wiki Site)

The repository also contains the Swarm Wiki website (Angular 19, Apple-grade design):

```bash
git clone https://github.com/JohTandou/agent-swarm.git
cd agent-swarm
npm install
npm start        # → http://localhost:3000
npm test         # 690+ unit tests
```

**Stack:** Angular 19 (standalone) · Tailwind v4 · GSAP · ngx-markdown · Fuse.js · Playwright

---

## 📄 License

MIT © Joh Tandou — See [LICENSE](LICENSE) for details.
