# KAVACH Backend

Backend for the KAVACH Mining Helmet Monitoring System — an IoT-based mining safety platform.

## Architecture

```
Client (ESP32 / Dashboard)
        │
        ▼
   Express.js ─── Socket.IO ─── Dashboard Clients
        │
        ▼
   Event Bus ─── Alert Engine ─── Emergency Engine
        │
        ▼
   MongoDB (Mongoose)
```

## Folder Structure

```
backend/
├── server.js                    # Entry point
├── src/
│   ├── app.js                   # Express app setup + middleware
│   ├── config/                  # Environment config + thresholds
│   ├── constants/               # Shared enums
│   ├── controllers/             # Request handlers
│   ├── database/                # MongoDB connection
│   ├── docs/                    # Swagger/OpenAPI specs
│   ├── events/                  # Internal event bus
│   ├── middleware/              # Error handler + logger
│   ├── models/                  # Mongoose schemas
│   ├── routes/                  # Route definitions
│   ├── services/                # Business logic
│   ├── sockets/                 # Socket.IO setup + room events
│   ├── utils/                   # ApiError, ApiResponse, asyncHandler
│   └── validators/              # Request validation
├── tests/                       # Jest test suite
├── .env.example                 # Environment template
├── .env.production              # Production config template
├── railway.toml                 # Railway deployment config
└── package.json
```

## Installation

```bash
cd backend
npm install
```

## Environment Variables

Copy `.env.example` to `.env` and configure:

| Variable              | Default                                    | Description                    |
| --------------------- | ------------------------------------------ | ------------------------------ |
| `PORT`                | `5000`                                     | Server port                    |
| `MONGODB_URI`         | `mongodb://localhost:27017/kavach`          | MongoDB connection string      |
| `NODE_ENV`            | `development`                              | Environment mode               |
| `LOG_LEVEL`           | `debug` (dev) / `info` (prod)              | Pino log level                 |
| `SOCKET_CORS_ORIGIN`  | `*`                                        | Socket.IO CORS origin          |
| `OFFLINE_TIMEOUT_MS`  | `30000`                                    | Helmet offline timeout (ms)    |

## Running Locally

Requires a running MongoDB instance.

```bash
# Development (hot reload)
npm run dev

# Production
npm start

# Tests
npm test
```

## Running in Production (Railway)

1. Set up a MongoDB Atlas cluster
2. Copy `.env.production` to `.env` and fill in values
3. Connect your GitHub repo to Railway
4. Railway auto-detects the `railway.toml` config
5. Set environment variables in Railway dashboard
6. Deploy

## API Endpoints

### Health
| Method | Endpoint    | Description                              |
| ------ | ----------- | ---------------------------------------- |
| GET    | `/health`   | Server, DB, Socket.IO, memory, CPU stats |

### Helmets
| Method | Endpoint                 | Description            |
| ------ | ------------------------ | ---------------------- |
| POST   | `/api/helmets`           | Register a helmet      |
| GET    | `/api/helmets`           | List all helmets       |
| GET    | `/api/helmets/:id`       | Get helmet by ID       |
| PUT    | `/api/helmets/:id`       | Update helmet          |

### Telemetry
| Method | Endpoint                             | Description              |
| ------ | ------------------------------------ | ------------------------ |
| POST   | `/api/telemetry`                     | Submit telemetry data    |
| GET    | `/api/telemetry/latest/:helmetId`    | Latest telemetry record  |
| GET    | `/api/telemetry/history/:helmetId`   | Paginated history        |

Query params: `page` (default: 1), `limit` (default: 20)

### Dashboard
| Method | Endpoint                    | Description                          |
| ------ | --------------------------- | ------------------------------------ |
| GET    | `/api/dashboard/summary`    | Per-helmet summary with alert counts |
| GET    | `/api/dashboard/live`       | Live telemetry, alerts, emergencies  |
| GET    | `/api/dashboard/alerts`     | Filtered/paginated alerts            |
| GET    | `/api/dashboard/emergencies`| Paginated emergency history          |

Query params: `status`, `severity`, `helmetId`, `page`, `limit`, `sortBy`, `sortOrder`

### Analytics
| Method | Endpoint                       | Description                          |
| ------ | ------------------------------ | ------------------------------------ |
| GET    | `/api/analytics/overview`      | System-wide statistics               |
| GET    | `/api/analytics/telemetry`     | Min/max/avg sensor analytics         |
| GET    | `/api/analytics/alerts`        | Alert breakdowns by type/severity    |
| GET    | `/api/analytics/emergencies`   | Emergency breakdowns by type/status  |

Query params: `helmetId`, `startDate`, `endDate` (for telemetry analytics)

### API Documentation
| Method | Endpoint      | Description              |
| ------ | ------------- | ------------------------ |
| GET    | `/api/docs`   | Interactive Swagger docs |

## Socket.IO Events

| Event                 | Direction     | Trigger                        |
| --------------------- | ------------- | ------------------------------ |
| `telemetry:update`    | Server → Client | Telemetry received           |
| `alert:new`           | Server → Client | Threshold breach detected    |
| `alert:resolved`      | Server → Client | Value returned to safe range |
| `emergency:new`       | Server → Client | Critical condition detected  |
| `emergency:resolved`  | Server → Client | Emergency resolved           |

### Rooms

| Room             | Purpose                         |
| ---------------- | ------------------------------- |
| `dashboard`      | Global dashboard events         |
| `helmet:<id>`    | Per-helmet event stream         |

Clients join rooms via:
```js
socket.emit('join:room', 'dashboard');
socket.emit('join:room', 'helmet:KAVACH-01');
```

## Response Format

Success:
```json
{
  "success": true,
  "message": "Operation successful",
  "data": {}
}
```

Paginated:
```json
{
  "success": true,
  "message": "Records retrieved",
  "data": {
    "records": [],
    "pagination": {
      "page": 1,
      "limit": 20,
      "total": 100,
      "pages": 5
    }
  }
}
```

Error:
```json
{
  "success": false,
  "message": "Error description",
  "errors": ["detail1", "detail2"]
}
```

## Data Flow

```
ESP32
  │
  ▼  HTTP POST /api/telemetry
Validation
  │
  ▼
Store Telemetry (MongoDB)
  │
  ▼
Update Helmet Status → online
  │
  ▼
Event Bus: telemetry:stored
  ├── Socket.IO Broadcast → Dashboard
  ├── Alert Engine → threshold check → alert:new/alert:resolved
  └── Emergency Engine → critical check → emergency:new/emergency:resolved
```

## Alerts

| Type                 | Trigger                          | Severity          | Auto-Resolve |
| -------------------- | -------------------------------- | ----------------- | ------------ |
| `gas_leak`           | gasLevel ≥ 500 (critical: 800)   | high / critical   | Yes          |
| `high_temperature`   | temp ≥ 38.5°C (critical: 42°C)   | high / critical   | Yes          |
| `abnormal_heart_rate`| HR < 60 or > 100 (crit: 40/140)  | high / critical   | Yes          |
| `low_oxygen`         | SpO2 < 90% (critical: 80%)       | high / critical   | Yes          |
| `low_battery`        | batteryLevel < 10%               | medium            | Yes          |
| `helmet_offline`     | No data for 30s                  | high              | Yes          |

## Testing

```bash
npm test
```

Tests cover: health endpoint, helmet API validation, telemetry API validation, dashboard API response format, analytics module, error handling, validation errors, and Swagger docs availability.

## Deployment

### Railway
1. Push to GitHub
2. Connect repository to Railway
3. Set environment variables:
   - `MONGODB_URI` (MongoDB Atlas connection string)
   - `NODE_ENV=production`
   - `SOCKET_CORS_ORIGIN` (frontend URL)
4. Deploy (Railway auto-detects `railway.toml`)

### MongoDB Atlas
1. Create a free cluster
2. Set up database user
3. Whitelist Railway IPs (0.0.0.0/0)
4. Use the connection string in `MONGODB_URI`

## Troubleshooting

| Issue                    | Solution                                   |
| ------------------------ | ------------------------------------------ |
| MongoDB connection fails | Check MONGODB_URI and network whitelist    |
| Socket.IO not connecting | Verify CORS origin matches frontend URL    |
| Port in use              | Change PORT in .env                        |
| Tests hanging            | Ensure MongoDB is running or use --forceExit|
