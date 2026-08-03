# Fruit Wine Compliance Suite

Full-stack MERN application for fruit-wine (carrot wine and beyond) analytical
calculation and FSSAI / IS:3752 / OIV compliance tracking.

```
project/
├── frontend/   Vite + React + Tailwind client
└── backend/    Express + MongoDB (Mongoose) REST API
```

## Quick start

Open two terminals.

**1. Backend** (needs MongoDB running locally, or set an Atlas URI in `backend/.env`)

```bash
cd backend
npm install
npm run seed     # optional: sample carrot wine batch
npm run dev      # http://localhost:5000
```

**2. Frontend**

```bash
cd frontend
npm install
npm run dev      # http://localhost:5173
```

Open the frontend URL. The top bar shows **Cloud connected** once the API is up; you
can then save batches, load them back, and log daily fermentation readings. Without the
backend, the app still works fully offline (localStorage).

## Environment files

Dummy dev values are already included:

- `backend/.env` — PORT, MONGO_URI, CLIENT_URL
- `frontend/.env` — VITE_API_URL

Replace `MONGO_URI` with your MongoDB Atlas connection string for production.

## What it does

Calculators: Brix↔SG, hydrometer temperature correction, ABV (OG/FG),
stoichiometric ΔBrix-vs-ABV cross-check (flags >10% variance), sugar & residual
extract, total/volatile acidity, total SO₂, generic acid titration.

Data management: per-batch compliance matrix (16 FSSAI parameters) with editable
limits, Pass/Fail/At-Risk verdicts, confidence tiers, CSV export, and daily
fermentation logs with a Brix trend chart — all persisted to MongoDB.

## ⚠ Compliance note

Default statutory limits are starter values only. Verify and lock every threshold
against the current FSSAI (Alcoholic Beverages) Regulations gazette and IS:3752
before using any Pass/Fail result for a legal decision. Predicted values must be
confirmed by accredited reference methods.
