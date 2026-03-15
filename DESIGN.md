# EDGAR Watchlist

## Vision

An app that's able to show a user-curated set of "watchlist" companies with a table of their Edgar filings.

## Status

Initial implementation complete. Core watchlist and filings browsing functionality is working.

## Architecture

- **Framework**: Aether (Nuxt 3 + Vue 3 + Vuetify 3 + TypeScript)
- **Data source**: SEC EDGAR public APIs (proxied through Nitro server routes)
- **Storage**: localStorage for watchlist persistence (upgradeable to KV when credentials are configured)

## Modules

### company-watchlist

The primary feature module. Provides:

- **Watchlist management** — Add/remove companies by searching name, ticker, or CIK
- **Filings browser** — View all EDGAR filings for a watched company with form-type filtering
- **Direct links** — One-click access to filing documents on SEC.gov

Location: `features/company-watchlist/`

### Server Routes

- `GET /api/edgar/search?q=` — Proxies company search to SEC EDGAR's company_tickers.json
- `GET /api/edgar/filings?cik=&formType=` — Fetches filing submissions for a CIK from EDGAR

## Pages

| Route        | Description                                                         |
| ------------ | ------------------------------------------------------------------- |
| `/`          | Home page with watchlist summary and feature overview               |
| `/watchlist` | Main watchlist page — company table, add dialog, filings drill-down |
