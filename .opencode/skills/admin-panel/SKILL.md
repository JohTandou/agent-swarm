---
name: admin-panel
description: Generate a complete, production-ready admin panel for the application in the current working directory. Analyzes the existing codebase (backend, database, API, auth) and scaffolds a full admin dashboard with CRUD, analytics, user management, and role-based access control.
---

# Admin Panel Generator

You are tasked with generating a **complete, production-ready admin panel** for the application in the current working directory.

## Phase 1 — Deep Codebase Analysis

Before writing a single line of code, perform an exhaustive analysis. You MUST understand the entire application before generating anything.

### 1.1 Stack Detection

Identify and document:

- **Backend framework** (FastAPI, Express, Django, Rails, NestJS, Laravel, etc.)
- **Database** (PostgreSQL, MySQL, MongoDB, SQLite, Supabase, Firebase, etc.)
- **ORM / query layer** (SQLAlchemy, Prisma, TypeORM, Drizzle, Eloquent, etc.)
- **Authentication system** (JWT, session, OAuth, Supabase Auth, Firebase Auth, Clerk, etc.)
- **API style** (REST, GraphQL, tRPC, etc.)
- **Frontend framework** if any (React, Vue, Svelte, Next.js, Nuxt, Flutter, etc.)
- **Existing admin or dashboard** (check if something partial already exists)
- **Package manager** (npm, yarn, pnpm, bun, pip, poetry, cargo, etc.)
- **Deployment target** (Vercel, Render, Railway, Docker, etc.)

### 1.2 Database Schema Mapping

For every table/collection in the database:

- List all columns/fields with types, constraints, defaults
- Map all relationships (foreign keys, junction tables, polymorphic associations)
- Identify which tables are user-facing vs internal vs config
- Identify soft-delete patterns, timestamps, audit columns
- Detect JSONB/JSON fields and their expected structures
- Note any RLS (Row Level Security) policies, triggers, or computed columns

### 1.3 Existing Auth & Permissions Audit

- How are users authenticated today?
- Is there already a role/permission system? (roles table, role column, RBAC, etc.)
- What middleware/guards exist for protected routes?
- Are there existing admin-related functions or utilities (even if unused)?

### 1.4 API Inventory

- List every existing API endpoint (method, path, purpose, auth requirement)
- Identify which endpoints already support admin operations
- Note any rate limiting, validation, or middleware patterns

### 1.5 Business Domain Understanding

- Read CLAUDE.md, README.md, PROPOSITION_VALEUR.md, or any project documentation
- Understand what the application does, who the users are, what the core entities are
- Identify which entities are most critical to manage (users, content, orders, subscriptions, etc.)

## Phase 2 — Architecture Design

Based on Phase 1 findings, design the admin panel architecture. Present the plan to the user BEFORE implementing.

### 2.1 Technology Choice

Choose the admin panel approach that best fits the existing stack:

**Option A — Integrated web admin** (preferred when a web frontend exists)
- Add admin routes to the existing web app
- Reuse the existing component library and design system
- Share authentication infrastructure

**Option B — Standalone admin app** (preferred when frontend is mobile-only or doesn't exist)
- Create a lightweight web admin (React + Vite, Next.js, or similar)
- Minimal dependencies, fast to load
- Connects to the existing backend API

**Option C — Backend-rendered admin** (preferred for simple CRUD-heavy apps)
- Server-rendered pages using the backend framework's templating
- Minimal JavaScript, works everywhere

Always prefer the approach that:
1. Minimizes new dependencies
2. Reuses existing infrastructure
3. Is easiest to maintain long-term
4. Matches the team's existing tech competence

### 2.2 Required Admin Features

Every admin panel MUST include:

#### Core Infrastructure
- [ ] **Authentication** — Admin login with role verification
- [ ] **Role-Based Access Control (RBAC)** — At minimum: `super_admin`, `admin`, `moderator` roles
- [ ] **Protected routes** — Every admin route checks role permissions
- [ ] **Audit logging** — Track who did what, when (admin action log)
- [ ] **Session management** — Secure admin sessions, separate from user sessions if needed

#### Dashboard & Analytics
- [ ] **Overview dashboard** — Key metrics at a glance (total users, active users, growth, revenue if applicable)
- [ ] **Time-series charts** — User signups over time, activity trends, key KPIs
- [ ] **Real-time indicators** — Current active users, recent actions, system health
- [ ] **Quick actions** — Most common admin tasks accessible from dashboard

#### User Management
- [ ] **User list** — Paginated, searchable, sortable, filterable
- [ ] **User detail** — Full profile view with all related data
- [ ] **User actions** — Activate, deactivate, ban, reset password, impersonate, change role
- [ ] **User creation** — Manual user creation for admins
- [ ] **Bulk actions** — Select multiple users for batch operations
- [ ] **Export** — CSV/JSON export of user data

#### Content/Entity Management (CRUD for each major entity)
For each significant database table, generate:
- [ ] **List view** — Paginated table with search, sort, filters
- [ ] **Detail view** — Full entity display with related data
- [ ] **Create form** — Validated form with appropriate field types
- [ ] **Edit form** — Pre-filled form with change tracking
- [ ] **Delete** — Soft delete preferred, with confirmation dialog
- [ ] **Bulk operations** — Multi-select for batch actions
- [ ] **Relationship navigation** — Click-through to related entities

#### System & Configuration
- [ ] **App settings** — Key-value configuration management
- [ ] **Feature flags** — Enable/disable features without deployment
- [ ] **Notification management** — Send announcements, manage notification templates
- [ ] **Media/file management** — If the app handles uploads/media

#### Monitoring & Operations
- [ ] **Admin activity log** — Full audit trail of admin actions
- [ ] **Error log viewer** — Recent errors, stack traces, affected users
- [ ] **API usage stats** — Endpoint hit counts, response times, error rates (if available)
- [ ] **Database stats** — Table sizes, row counts, growth trends

### 2.3 Entity-Specific Intelligence

For each entity managed in the admin, determine:
- **Which fields are editable** vs read-only vs computed
- **Which fields need special input widgets** (rich text, date picker, file upload, color picker, JSON editor, relationship selector)
- **What validations apply** (required, unique, format, range, business rules)
- **What related data to show** inline vs as links
- **What the most useful filters are** for the list view
- **What metrics/stats are relevant** to display per entity

## Phase 3 — Database Migrations

### 3.1 Required Schema Changes

Create migrations for:

```
admin_roles table (if no RBAC exists):
  - id, name (super_admin, admin, moderator), permissions (JSONB), created_at

user role assignment:
  - Add role field to existing user/profile table, OR
  - Create user_roles junction table for flexible multi-role

admin_audit_log table:
  - id, admin_user_id, action (enum), target_type, target_id,
    details (JSONB), ip_address, user_agent, created_at

admin_settings table (optional):
  - id, key (unique), value (JSONB), description, updated_by, updated_at

feature_flags table (optional):
  - id, key (unique), enabled (boolean), description, conditions (JSONB),
    updated_by, updated_at
```

### 3.2 RLS & Security Policies

- Ensure admin tables have proper RLS if using Supabase/PostgreSQL RLS
- Admin audit log should be append-only (no UPDATE/DELETE for non-super-admins)
- Admin settings should be writable only by admins

## Phase 4 — Backend Implementation

### 4.1 Admin API Endpoints

Create a dedicated admin router/module with these endpoint groups:

```
# Dashboard
GET    /admin/dashboard/stats          — Key metrics
GET    /admin/dashboard/charts         — Time-series data

# Users
GET    /admin/users                    — List (paginated, filterable)
GET    /admin/users/:id                — Detail
POST   /admin/users                    — Create
PATCH  /admin/users/:id                — Update
DELETE /admin/users/:id                — Deactivate/ban
POST   /admin/users/:id/impersonate   — Impersonate user
POST   /admin/users/bulk-action        — Bulk operations
GET    /admin/users/export             — CSV/JSON export

# Per entity (repeat pattern)
GET    /admin/{entity}                 — List
GET    /admin/{entity}/:id             — Detail
POST   /admin/{entity}                 — Create
PATCH  /admin/{entity}/:id             — Update
DELETE /admin/{entity}/:id             — Delete

# System
GET    /admin/audit-log                — Admin action history
GET    /admin/settings                 — App settings
PATCH  /admin/settings                 — Update settings
GET    /admin/feature-flags            — Feature flags
PATCH  /admin/feature-flags/:key       — Toggle flag
```

### 4.2 Middleware & Guards

- Admin authentication middleware that verifies admin role on EVERY request
- Permission checking per endpoint (some actions require super_admin)
- Automatic audit logging on every write operation
- Rate limiting on admin endpoints
- Input validation on all admin inputs

### 4.3 Query Patterns

For list endpoints, implement:
- **Pagination** — Offset-based or cursor-based
- **Search** — Full-text search across relevant fields
- **Sort** — Multi-column sort support
- **Filter** — Per-field filtering with operators (eq, neq, gt, lt, contains, in)
- **Include** — Related data eager loading to avoid N+1

## Phase 5 — Frontend Implementation

### 5.1 Admin Layout

```
┌─────────────────────────────────────────────┐
│  Logo    Search...          [User] [Logout] │
├──────────┬──────────────────────────────────┤
│          │                                  │
│ Dashboard│   Main Content Area              │
│ Users    │                                  │
│ [Entity] │   - List views                   │
│ [Entity] │   - Detail views                 │
│ ...      │   - Forms                        │
│          │   - Charts                       │
│ Settings │                                  │
│ Logs     │                                  │
│          │                                  │
├──────────┴──────────────────────────────────┤
│  Footer: version, environment               │
└─────────────────────────────────────────────┘
```

### 5.2 UI Components Required

- **Data table** — Sortable, filterable, paginated, with row selection
- **Forms** — Auto-generated from entity schema with proper validation
- **Charts** — Line charts (time series), bar charts (comparisons), stat cards
- **Modals** — Confirmation dialogs, quick edit forms
- **Toast notifications** — Success/error feedback
- **Breadcrumbs** — Navigation context
- **Search** — Global search across all entities
- **Loading states** — Skeletons for tables, shimmer for cards

### 5.3 Design Guidelines for Admin

Admin panels prioritize **function over form**, but must still be:
- **Clean and readable** — Clear typography hierarchy, adequate spacing
- **Information-dense** — Show useful data without overwhelming
- **Fast** — Minimal bundle size, instant navigation, optimistic updates
- **Accessible** — Keyboard navigable, proper ARIA labels, screen reader compatible
- **Responsive** — Usable on tablet, functional on mobile (sidebar collapses)

Use a proven admin UI library if it fits the stack (shadcn/ui, Ant Design, Mantine, etc.) — admin panels are one place where using component libraries as-is is perfectly acceptable. Focus effort on functionality, not visual novelty.

## Phase 6 — Security Hardening

### Non-negotiable security requirements:

1. **Admin routes on a separate path prefix** (`/admin/*`) — easy to add WAF rules, logging
2. **All admin endpoints require authentication + role check** — no exceptions
3. **CSRF protection** on all state-changing operations
4. **Input sanitization** — Prevent XSS, SQL injection even from admin inputs
5. **Audit trail** — Every admin action is logged with: who, what, when, from where
6. **Rate limiting** — Prevent brute-force on admin login
7. **IP allowlisting** (optional but recommended) — Restrict admin access by IP
8. **Two-factor authentication** (if feasible) — Extra layer for admin accounts
9. **No mass-delete without confirmation** — Destructive actions require explicit confirmation
10. **Secrets never exposed** — API keys, passwords, tokens are never shown in admin UI

## Phase 7 — Implementation Execution

### Execution order:

1. **Database migrations** — Create admin tables, add role fields
2. **Backend auth & middleware** — Admin role verification, audit logging
3. **Backend CRUD endpoints** — One entity at a time, starting with users
4. **Frontend setup** — Admin app scaffold, routing, layout
5. **Frontend dashboard** — Stats and charts
6. **Frontend CRUD pages** — One entity at a time, matching backend
7. **Settings & system pages** — Feature flags, audit log viewer
8. **Testing** — Verify all endpoints, permissions, edge cases
9. **First admin user** — Create or promote the first admin account

### For each entity, implement in this order:
1. Backend: list endpoint with pagination/search/filter
2. Backend: detail, create, update, delete endpoints
3. Frontend: list page with data table
4. Frontend: detail page
5. Frontend: create/edit forms
6. Frontend: delete confirmation
7. Wire up audit logging

## Phase 8 — Delivery Checklist

Before considering the admin panel complete, verify:

- [ ] Every database table with user-facing data has CRUD in the admin
- [ ] User management works end-to-end (list, view, edit, deactivate)
- [ ] Role-based access prevents unauthorized actions
- [ ] Dashboard shows meaningful, real-time metrics
- [ ] Audit log captures all admin write operations
- [ ] All forms have proper validation (client + server)
- [ ] Pagination works on all list views
- [ ] Search works on all list views
- [ ] At least one admin user can be created/promoted
- [ ] Admin panel is not accessible to regular users
- [ ] No sensitive data (passwords, tokens) is exposed in the UI
- [ ] The admin panel works on tablet/mobile viewport
- [ ] Error states are handled gracefully (API down, 404, 403)

## Important Rules

- **Always present the architecture plan to the user before implementing**
- **Reuse existing code** — Don't duplicate auth logic, DB connections, validation utils
- **Follow existing code conventions** — Match the style, patterns, and structure of the existing codebase
- **Match the existing language** — If the backend is Python, write Python. If the frontend is React, write React. Do not introduce a new language/framework unless absolutely necessary
- **Incremental delivery** — Implement entity by entity, not all at once. Validate each entity works before moving to the next
- **Read before writing** — Always read existing files before modifying them
- **Respect CLAUDE.md** — If the project has a CLAUDE.md, follow its conventions for naming, comments language, UI language, design system, etc.

$ARGUMENTS
