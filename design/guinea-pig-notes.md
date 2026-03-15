# Guinea Pig Notes: Agent Experience Building from /build_my_app

Running log of things that were confusing, unclear, or could be improved in the Aether template docs and setup experience.

## Observations So Far

### 1. `patterns/` directory referenced but doesn't exist

- `architecture.mdc` references `patterns/module-definition.ts` for "the full annotated template"
- `ui.mdc` references `patterns/feature-page.vue` for "the full template"
- Neither exists. The actual template is in `templates/feature-template/` but the cursor rules don't mention it.
- **Suggestion**: Either create the `patterns/` directory with these files, or update the cursor rules to point to `templates/feature-template/`.

### 2. Sidebar nav has hardcoded "Core Pages" that don't match the app

- `ModularSideNavPanel.vue` hardcodes links to Home, Agent Chat, Entity Lookup, and MCP Explorer.
- When building a new app from a brief, the sidebar should be driven by the app's actual modules, not template placeholders.
- The architecture rule says "the default UI is placeholder content... feel free to replace" but there's no guidance on _how_ to restructure the sidebar for a custom app.
- **Suggestion**: Either make the sidebar fully dynamic (driven by registered modules), or document the expected customization pattern.

### 3. Module `navigation` vs hardcoded sidebar entries is confusing

- `entity-lookup` has no `navigation` property in its module definition, yet it appears in the sidebar via a hardcoded `<v-list-item>` in `ModularSideNavPanel.vue`.
- Other modules with `navigation` appear in a separate "Modules" section below a divider.
- This creates two parallel systems for sidebar nav. It's unclear which one a new module should use.
- **Suggestion**: Pick one approach. If modules should drive the sidebar, have `entity-lookup` use `navigation` too.

### 4. `Pref<T>` class is exported from the composable file but not actually exported

- `usePrefsStore.ts` defines `class Pref<T>` but doesn't add it to the module exports. It's usable within the file but not importable by feature modules.
- The `pref.mdc` rule shows `new Pref<T>(...)` usage but doesn't clarify the import path.
- **Suggestion**: Export `Pref` from `usePrefsStore.ts`, or document how modules should import it.

### 5. No clear guidance on adding server API routes for a feature module

- The architecture rule mentions `server/` for Nitro API routes but gives no example of a feature module that needs server-side API proxying.
- For my app (EDGAR filings), I need to proxy external API calls through Nitro to avoid CORS. There's no pattern for "feature needs a server route."
- **Suggestion**: Add a sentence or example in the architecture rule about when/how to add `server/api/` routes alongside a feature module.

### 6. Example modules have broken imports

- `example-card-module` imports `EntityStatusPage`, `EntityAlertCard`, `EntityMapCard` that don't exist.
- These modules aren't registered in the plugin anyway, but they're confusing as "reference implementations."
- **Suggestion**: Either make the examples complete and working, or remove them and keep only one clean example (`entity-lookup`).

### 7. The `/build_my_app` command says to read `PROJECT_BRIEF.md` but the brief is in `DESIGN.md`

- Step 1 of the command says `cat PROJECT_BRIEF.md` but then says "Look for a `## Vision` section" which is in `DESIGN.md`.
- Minor inconsistency but could confuse an agent that follows instructions literally.

### 8. No guidance on what to do with `pages/mcp.vue` and `pages/chat.vue`

- The design rule says "feel free to remove example feature modules" but doesn't mention whether `mcp.vue` and `chat.vue` should stay.
- For an app that doesn't use agents or MCP, these pages (and their sidebar links) are noise.
- The architecture rule says "Keep `pages/chat.vue` if the app uses agent chat" but the `/build_my_app` command doesn't prompt you to decide.

---

### 9. `Pref<T>` with localStorage fallback isn't documented

- The `pref.mdc` rule explains that KV "works with default values but won't persist across refreshes" when credentials aren't set. But there's no suggestion for what to do instead in local dev.
- For my watchlist, I used raw `localStorage` since KV credentials aren't configured. The `Pref<T>` class could easily support a localStorage fallback for local dev, but it doesn't -- and the docs don't mention this gap.
- **Suggestion**: Either add a localStorage fallback to `Pref<T>` or document "for local dev without KV, use localStorage directly" as a pattern.

### 10. `npm run build` fails if you haven't run `npm install` first, with unhelpful error

- Running `npm run build` before `npm install` gives `sh: nuxt: command not found`. This is obvious in hindsight, but the `/build_my_app` command's Step 5 says to run `npm run build` without first checking if deps are installed.
- AGENTS.md says "the environment is already set up for you" in Cursor Cloud, but this wasn't the case -- `node_modules` was empty.
- **Suggestion**: Have the `/build_my_app` command check for `node_modules` and run `npm install` if needed before attempting the build.

### 11. No clear pattern for how module routes work with the catch-all `[...module].vue`

- The catch-all page `pages/[...module].vue` resolves module routes, but there's no documentation on how it matches. Does `/watchlist` match because the module ID is `company-watchlist` or because the route path is `/watchlist`?
- I had to read the catch-all page code to understand that routes are matched by their `path` property, not by module ID.
- **Suggestion**: Add a brief explanation in the architecture rule about how module routing works with the catch-all page.

### 12. Module ID must match the URL path -- not documented, caused a routing bug

- I named my module `company-watchlist` with route path `/watchlist`. The catch-all `[...module].vue` extracts the first URL segment (`watchlist`) and looks up a module by that ID. Since the ID was `company-watchlist`, the lookup failed silently and the page appeared blank.
- The entity-lookup example happens to have matching ID and path, so this works by coincidence -- but there's no rule or documentation explaining the constraint.
- **Suggestion**: Document that the module ID must match the first segment of its route path (or change the catch-all to search by route path instead of module ID).

### 13. Port 3000 collision is silent and confusing

- The Broadchurch Portal was already running on port 3000 (IPv6). Our dev server bound to port 3000 (IPv4) without error. The browser connected to the Portal via IPv6 `[::1]:3000`.
- There was no warning from Nuxt or Nitro about the port being partially in use. This was very confusing to debug.
- **Suggestion**: Add a note in AGENTS.md about potential port conflicts when running multiple projects.

_Will continue adding notes as work progresses._
