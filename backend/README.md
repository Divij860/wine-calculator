# Fruit Wine Compliance — Backend API

Express + MongoDB (Mongoose) REST API that persists wine batches, their compliance
matrix, editable limits, and daily fermentation logs.

## Setup

Requires Node.js 18+ and a running MongoDB (local or Atlas).

```bash
npm install
cp .env.example .env      # already includes dummy dev values
npm run seed              # optional: insert a sample carrot wine batch
npm run dev               # start with nodemon on PORT (default 5000)
```

## Environment (`.env`)

| Key         | Example                                             |
|-------------|-----------------------------------------------------|
| PORT        | 5000                                                |
| NODE_ENV    | development                                          |
| MONGO_URI   | mongodb://127.0.0.1:27017/fruit_wine_compliance     |
| CLIENT_URL  | http://localhost:5173                               |

## Structure

```
backend/
├── server.js                 # entry: connect DB, start server
└── src/
    ├── app.js                # express app, middleware, route mounting
    ├── config/db.js          # mongoose connection
    ├── models/               # Batch, FermentationLog schemas
    ├── controllers/          # request handlers (business logic)
    ├── routes/               # batchRoutes + nested logRoutes
    ├── middlewares/          # asyncHandler, error + 404, id validation
    └── utils/seed.js         # sample data seeder
```

## API

| Method | Endpoint                              | Description                     |
|--------|---------------------------------------|---------------------------------|
| GET    | `/api/health`                         | Service health check            |
| GET    | `/api/batches`                        | List batches (summary)          |
| POST   | `/api/batches`                        | Create a batch                  |
| GET    | `/api/batches/:id`                    | Get one batch (full)            |
| PUT    | `/api/batches/:id`                    | Update a batch                  |
| DELETE | `/api/batches/:id`                    | Delete batch + its logs         |
| GET    | `/api/batches/:batchId/logs`          | List fermentation logs          |
| POST   | `/api/batches/:batchId/logs`          | Add a daily reading             |
| DELETE | `/api/batches/:batchId/logs/:logId`   | Delete a reading                |

### Batch body shape

```json
{
  "product": "Carrot Wine — Batch CW-001",
  "fruit": "Carrot (Daucus carota)",
  "lot": "CW-2026-001",
  "startDate": "2026-07-01",
  "day": "9",
  "analyst": "QC Lab",
  "notes": "…",
  "matrix": {
    "ethylAlcohol": { "value": "8.50", "dataStatus": "Measured", "confidence": 100, "source": "…" }
  },
  "limits": {
    "volatileAcid": { "min": null, "max": 1.5 }
  }
}
```
