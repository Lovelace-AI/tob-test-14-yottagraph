# Build My App

Read the project brief and start building the described application.

## Overview

This command reads `PROJECT_BRIEF.md` (written by the project creator during setup) and implements the described application using Aether's feature module system, existing components, and available infrastructure (KV storage, Supabase if connected, AI agents).

**This is meant to be the first thing a user runs after opening their project in Cursor.**

---

## Step 1: Read the Brief

Read `DESIGN.md` from the project root.

```bash
cat DESIGN.md
```

Look for a `## Vision` section — this contains the project creator's description of what they want to build.

**If the file doesn't exist or has no Vision section:**

> No project brief found. That's fine — tell me what you'd like to build and I'll help you get started!

Stop here and wait for the user to describe what they want.

---

## Step 2: Understand the Environment

Before building, read these files to understand what's available:

1. `DESIGN.md` — current project design and modules (if it exists)
2. `broadchurch.yaml` — project config (name, gateway URL, etc.)
3. `.cursor/rules/` — scan rule names to know what patterns are available

Key capabilities to keep in mind:

- **Feature modules** in `features/` — the standard way to add functionality
- **KV storage** — always available for preferences and lightweight data (see `pref.mdc` rule)
- **Supabase** — check if `NUXT_PUBLIC_SUPABASE_URL` is in `.env` for database access
- **AI agent chat** — `pages/chat.vue` already exists for agent interactions
- **Components** — Vuetify 3 component library is available

---

## Step 3: Plan the Implementation

Based on the brief, create a plan:

1. What feature modules to create
2. What pages and components are needed
3. What data needs to be persisted (and whether KV or Supabase is appropriate)
4. Whether a custom AI agent would be useful

Present the plan to the user and ask for approval before proceeding.

---

## Step 4: Build

Implement the plan:

1. Create feature modules using the pattern in `features/` (see `architecture.mdc`)
2. Register modules in `plugins/01.module-registry.client.ts`
3. Use `Pref<T>` for any persisted settings (see `pref.mdc`)
4. Use Vuetify components and the project's dark theme
5. Update `DESIGN.md` with what you built

**Follow the project's coding conventions:**

- `<script setup lang="ts">` for all Vue components
- TypeScript required
- Feature logic lives in feature modules, not in `pages/` or root `components/`

---

## Step 5: Verify

After building:

```bash
npm run build
```

Fix any build errors.

Then suggest the user run `npm run dev` to preview their app locally.

---

## Step 6: Next Steps

> Your app is taking shape! Here's what you can do next:
>
> - **Preview locally** with `npm run dev`
> - **Push to deploy** — Vercel auto-deploys on push to main
> - **Deploy an AI agent** — run `/deploy_agent` when you have an agent ready
> - **Add more features** — create new modules in `features/`
