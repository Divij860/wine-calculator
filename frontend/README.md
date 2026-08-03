# Fruit Wine Compliance Analyzer — Frontend

Vite + React + Tailwind client. Runs standalone (localStorage) and syncs to the
Express/MongoDB backend when it's running.

## Setup

Requires Node.js 18+.

```bash
npm install
cp .env.example .env       # points at http://localhost:5000/api by default
npm run dev                # Vite dev server on http://localhost:5173
npm run build              # production build -> /dist
```

## Tabs

- **Batch Info** — identity, timeline, notes
- **Fermentation Log** — daily Brix/pH/temp/ABV readings stored on the backend, with
  auto-computed SG and a Brix trend chart (requires a saved cloud batch)
- **Gravity & Alcohol** — Brix<->SG, temp correction, ABV, stoichiometric cross-check,
  sugar & residual extract
- **Titration Lab** — total/volatile acidity, total SO2, generic acid
- **Instrument Values** — manual entry for AAS/ICP/GC/HPLC parameters
- **Compliance Matrix** — 16 parameters vs editable limits, Pass/Fail/At Risk, CSV export

## Cloud sync

The top bar shows connection status and lets you Save to cloud, Update, load a saved
batch, or start a New batch. If the backend is offline the app still works fully
offline via localStorage.

Set the API URL in `.env`:

```
VITE_API_URL=http://localhost:5000/api
```

## Extending

Formulas: `src/lib/calculations.js` · Parameters & default limits: `src/lib/limits.js`
· API calls: `src/lib/api.js`
