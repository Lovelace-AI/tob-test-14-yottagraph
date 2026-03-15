# Company Watchlist

Track companies and browse their SEC EDGAR filings.

## Features

- Search for companies by name, ticker symbol, or CIK number
- Add/remove companies from a personal watchlist
- View all EDGAR filings for any watched company
- Filter filings by form type (10-K, 10-Q, 8-K, etc.)
- Direct links to filing documents on SEC.gov

## Structure

```
company-watchlist/
├── index.ts                          # Module definition
├── pages/index.vue                   # Main watchlist + filings page
├── components/
│   ├── AddCompanyDialog.vue          # Company search & add dialog
│   └── FilingsTable.vue              # Filings data table with filters
└── composables/
    ├── useWatchlist.ts               # Watchlist state (localStorage)
    └── useEdgarApi.ts                # EDGAR API client
```

## Server Routes

- `GET /api/edgar/search?q=` — Search companies via SEC EDGAR
- `GET /api/edgar/filings?cik=&formType=` — Get filings for a company by CIK
