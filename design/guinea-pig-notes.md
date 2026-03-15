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

_Will continue adding notes as I build the watchlist app._
