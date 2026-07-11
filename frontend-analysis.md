# Frontend Analysis — KAVACH Mining Helmet Monitor

## Phase 1 + 2 + 3 Implementation Status: COMPLETE

---

## Tech Stack

| Layer | Technology | Version |
|-------|-----------|---------|
| Framework | React | 19.2.7 |
| Bundler | Vite | 8.1.1 |
| Language | JavaScript (JSX) | — |
| Styling | Vanilla CSS (CSS Custom Properties) | — |
| Routing | React Router DOM | 7.18.1 |
| HTTP Client | Axios | 1.18.1 |
| Real-Time | Socket.IO Client | 4.8.3 |
| Maps | React Leaflet + Leaflet | 5.0+ / 1.9.4 |
| Charts | Recharts | ^2.x |
| Linting | oxlint | 1.71.0 |

---

## Architecture

**Pattern:** Service → Hook → Page → Component (unidirectional data flow)

```
.env (VITE_API_URL, VITE_SOCKET_URL)
        │
        ▼
  services/ ───── Axios instance + 6 domain service modules
  services/socket.js ── Socket.IO singleton
        │
        ├────────────────────────────────────┐
        ▼                                    ▼
  context/SocketContext                 constants/
  (socket lifecycle)                    (socketEvents, routes, deviceStatus)
        │                                    │
        ▼                                    ▼
  hooks/ (6 hooks) ─────────── utils/
  useSocket, useDashboard,      formatDate, formatBattery,
  useAlerts, useEmergencies,    formatStatus
  useHelmet, useAnalytics
        │
        ▼
  pages/ (5 lazy-loaded pages)
        │
        ▼
  components/ (22 presentational components across 8 domains)
        │
        ▼
  styles/ (5 CSS files, dark industrial theme)
```

### Lazy Loading (Phase 3)
All 5 page bundles are code-split via `React.lazy()` + `<Suspense>`:
- Dashboard, Alerts, Emergencies, Analytics, HelmetDetails

Each loads independently, reducing initial bundle size.

### Error Boundary (Phase 3)
`ErrorBoundary` wraps the entire app — catches render errors, displays a recovery UI with "Return to Dashboard" button, prevents white-screen crashes.

---

## Folder Structure

```
frontend/
├── .env
├── index.html
├── package.json
├── vite.config.js
├── src/
│   ├── main.jsx                        # ReactDOM entry, 5 CSS imports
│   ├── App.jsx                         # ErrorBoundary → SocketProvider → Suspense → AppRouter
│   │
│   ├── constants/                      # Phase 2
│   │   ├── socketEvents.js
│   │   ├── deviceStatus.js
│   │   └── routes.js
│   │
│   ├── utils/                          # Phase 2
│   │   ├── formatDate.js
│   │   ├── formatBattery.js
│   │   └── formatStatus.js
│   │
│   ├── router/
│   │   └── AppRouter.jsx               # Updated P3 — 5 active routes, all lazy-loaded
│   │
│   ├── context/
│   │   └── SocketContext.jsx
│   │
│   ├── hooks/                          # 6 hooks total
│   │   ├── useSocket.js
│   │   ├── useDashboard.js
│   │   ├── useAlerts.js
│   │   ├── useEmergencies.js
│   │   ├── useHelmet.js
│   │   └── useAnalytics.js             # NEW P3 — fetches all 4 analytics endpoints
│   │
│   ├── services/                       # 7 modules total
│   │   ├── api.js
│   │   ├── dashboardService.js
│   │   ├── alertService.js
│   │   ├── emergencyService.js
│   │   ├── helmetService.js
│   │   ├── telemetryService.js
│   │   └── analyticsService.js         # NEW P3 — overview, telemetry, alerts, emergencies
│   │
│   ├── pages/                          # 5 pages, all lazy-loaded
│   │   ├── Dashboard/
│   │   ├── Alerts/
│   │   ├── Emergencies/
│   │   ├── HelmetDetails/
│   │   └── Analytics/                  # NEW P3
│   │
│   ├── components/
│   │   ├── layout/ (4)
│   │   ├── dashboard/ (3)
│   │   ├── alerts/ (2)
│   │   ├── emergency/ (2)
│   │   ├── helmet/ (2)
│   │   ├── map/ (1)
│   │   ├── analytics/ (6)              # NEW P3 — 5 charts + DateRangeFilter
│   │   └── common/ (4)                 # +Phase 3: ErrorBoundary
│   │
│   └── styles/
│       ├── variables.css
│       ├── global.css
│       ├── layout.css
│       ├── dashboard.css
│       ├── phase2.css
│       └── phase3.css                  # NEW P3 — analytics, charts, error boundary, focus, transitions
```

---

## Routing (5 active routes)

| Path | Page | Lazy-Loaded |
|------|------|-------------|
| `/` | Dashboard | ✅ |
| `/alerts` | Alerts | ✅ |
| `/emergencies` | Emergencies | ✅ |
| `/analytics` | Analytics | ✅ |
| `/helmet/:helmetId` | Helmet Details | ✅ |
| `*` | Redirect to `/` | — |

---

## Services Layer (7 modules)

| Service | Methods | Phase |
|---------|---------|-------|
| `api.js` | Axios instance (baseURL, timeout, JSON headers, error interceptor) | P1 |
| `dashboardService.js` | getDashboardSummary, getDashboardLive, getDashboardAlerts, getDashboardEmergencies | P1→P2 |
| `alertService.js` | getAlerts(params) | P2 |
| `emergencyService.js` | getEmergencies(params) | P2 |
| `helmetService.js` | getAllHelmets, getHelmetById, registerHelmet, updateHelmet | P2 |
| `telemetryService.js` | getLatestTelemetry, getTelemetryHistory | P2 |
| `analyticsService.js` | getOverview, getTelemetryAnalytics, getAlertAnalytics, getEmergencyAnalytics | P3 |

---

## Hooks (6 hooks)

| Hook | Socket Events | Description |
|------|---------------|-------------|
| `useSocket` | — | Access `{ socket, isConnected }` |
| `useDashboard` | telemetry:update, alert:new, alert:resolved, emergency:new, emergency:resolved | Live data + health + derived lists |
| `useAlerts(params)` | alert:new, alert:resolved | Paginated alerts with live inserts |
| `useEmergencies(params)` | emergency:new, emergency:resolved | Paginated emergencies with live inserts |
| `useHelmet(helmetId)` | telemetry:update (filtered) | Helmet detail + telemetry + history |
| `useAnalytics(filters)` | — | 4 analytics endpoints in parallel, filter-aware |

---

## Pages (5 pages)

### Dashboard (P1→P2→P3)
- Refactored to use `useDashboard` hook
- Clickable helmet rows → `/helmet/:id`
- Live alert + emergency preview panels
- Leaflet map with GPS markers
- Loading / error / empty states via `<Loading>`, `<ErrorState>`, `<EmptyState>`

### Alerts (P2)
- Paginated alerts via `useAlerts`
- Socket live inserts for new/resolved

### Emergencies (P2)
- Paginated emergencies via `useEmergencies`
- Socket live inserts for new/resolved

### HelmetDetails (P2)
- Full helmet info, SensorGrid, GPS map, active alerts/emergencies, telemetry history
- Socket live updates filtered by `helmetId`

### Analytics (NEW P3)
- Fetches all 4 analytics endpoints via `useAnalytics(filters)`
- Date range filter for telemetry analytics
- Overview cards (9 count metrics + 5 averages)
- TelemetryTrendChart: LineChart (min/avg/max) via Recharts ResponsiveContainer
- HelmetUsageChart: PieChart (online vs offline)
- AlertTrendChart: 3 PieCharts (by type, severity, status)
- EmergencyTrendChart: AreaChart (by type) + PieChart (by status)
- Loading / error states

---

## Components (22 components across 8 domains)

### Layout (4)
`AppLayout`, `Sidebar` (memo'd), `Navbar` (memo'd), `PageHeader` (memo'd)

### Dashboard (3)
`StatusCards` (memo'd), `HelmetTable` (memo'd, clickable rows), `LiveTelemetry` (memo'd)

### Alerts (2)
`AlertCard` (memo'd, severity-colored borders), `AlertList`

### Emergency (2)
`EmergencyCard` (memo'd, red glow when active), `EmergencyList`

### Helmet (2)
`HelmetInfo` (memo'd), `SensorGrid` (memo'd, 7 sensors)

### Map (1)
`HelmetMap` (memo'd, Leaflet with live markers, CDN icon fix)

### Analytics (6, NEW P3)
`AnalyticsOverview` (memo'd — 14 metric cards), `TelemetryTrendChart` (memo'd — LineChart), `AlertTrendChart` (memo'd — 3 PieCharts), `EmergencyTrendChart` (memo'd — AreaChart + PieChart), `HelmetUsageChart` (memo'd — PieChart), `DateRangeFilter` (memo'd — date inputs + apply/clear)

### Common (4)
`Loading` (spinner), `ErrorState` (retry button), `EmptyState` (icon + message), `ErrorBoundary` (class component, P3)

---

## Performance Optimizations (Phase 3)

| Technique | Applied To |
|-----------|-----------|
| `React.memo()` | StatusCards, HelmetTable, HelmetMap, SensorGrid, AlertCard, EmergencyCard, LiveTelemetry, Navbar, Sidebar, PageHeader, HelmetInfo, AnalyticsOverview, TelemetryTrendChart, AlertTrendChart, EmergencyTrendChart, HelmetUsageChart, DateRangeFilter |
| `useMemo()` | Chart data transformations (TelemetryTrendChart, AlertTrendChart, EmergencyTrendChart, HelmetUsageChart) |
| `useCallback()` | fetch/refetch functions, filter handlers, pagination handlers |
| `React.lazy()` + `Suspense` | All 5 pages (Dashboard, Alerts, Emergencies, Analytics, HelmetDetails) |
| `ErrorBoundary` | Entire app wrapped — prevents white-screen crashes |
| Tree-shaking | Clean imports, no duplicate dependencies |

---

## Accessibility (Phase 3)

- `*:focus-visible` outlines on all interactive elements
- ARIA labels on date inputs
- `aria-disabled` on disabled sidebar links
- Keyboard navigation on table rows (Enter key)
- Semantic HTML (`<aside>`, `<nav>`, `<main>`, `<header>`, `<table>`, `<form>`)
- `prefers-reduced-motion` media query (disables all animations)
- `scrollbar-width: thin` for scrollable containers

---

## Styling (5 CSS files)

| File | Purpose | Phase |
|------|---------|-------|
| `variables.css` | 17 CSS custom properties (dark industrial) | P1 |
| `global.css` | Reset, element defaults, scrollbar | P1 |
| `layout.css` | AppLayout, Sidebar, Navbar, PageHeader, responsive | P1 |
| `dashboard.css` | StatusCards, HelmetTable, LiveTelemetry, badges, grid | P1→P2 |
| `phase2.css` | AlertCard, EmergencyCard, HelmetInfo, SensorGrid, HelmetMap, common, toolbar, pagination, clickable rows | P2 |
| `phase3.css` | Analytics overview, chart cards, date filter, error boundary, focus indicators, transitions, Recharts overrides, reduced motion, scrollbar polish | P3 |

### UI Polish (Phase 3)
- Consistent box-shadow on all cards
- Smooth transitions on all interactive elements
- Sticky table headers
- Touch scrolling on tables
- Refined focus-visible outlines (blue, 2px offset)
- Recharts tooltip/legend styling matches dark theme
- Loading spinner animation refinement

---

## Dependencies

| Package | Version | Purpose | Phase |
|---------|---------|---------|-------|
| `react` | ^19.2.7 | UI framework | P1 |
| `react-dom` | ^19.2.7 | DOM rendering | P1 |
| `react-router-dom` | ^7.18.1 | Client-side routing | P1 |
| `axios` | ^1.18.1 | HTTP client | P1 |
| `socket.io-client` | ^4.8.3 | Real-time WebSocket | P1 |
| `react-leaflet` | ^5.0+ | React Leaflet bindings | P2 |
| `leaflet` | ^1.9.4 | Map rendering | P2 |
| `recharts` | ^2.x | Charts (Line, Bar, Area, Pie) | P3 |

---

## Backend Integration Points

### REST Endpoints Consumed

| Endpoint | Service Method | Page | Phase |
|----------|---------------|------|-------|
| `GET /health` | `api.get('/health')` | Dashboard | P1 |
| `GET /api/dashboard/live` | `dashboardService.getDashboardLive()` | Dashboard | P1 |
| `GET /api/dashboard/alerts` | `alertService.getAlerts(params)` | Alerts | P2 |
| `GET /api/dashboard/emergencies` | `emergencyService.getEmergencies(params)` | Emergencies | P2 |
| `GET /api/helmets/:helmetId` | `helmetService.getHelmetById(id)` | HelmetDetails | P2 |
| `GET /api/telemetry/latest/:helmetId` | `telemetryService.getLatestTelemetry(id)` | HelmetDetails | P2 |
| `GET /api/telemetry/history/:helmetId` | `telemetryService.getTelemetryHistory(id)` | HelmetDetails | P2 |
| `GET /api/analytics/overview` | `analyticsService.getOverview()` | Analytics | P3 |
| `GET /api/analytics/telemetry` | `analyticsService.getTelemetryAnalytics(params)` | Analytics | P3 |
| `GET /api/analytics/alerts` | `analyticsService.getAlertAnalytics()` | Analytics | P3 |
| `GET /api/analytics/emergencies` | `analyticsService.getEmergencyAnalytics()` | Analytics | P3 |

### Socket Events Consumed (5 total)

| Event | Consumed In | Phase |
|-------|-------------|-------|
| `telemetry:update` | `useDashboard`, `useHelmet` | P1→P2 |
| `alert:new` | `useDashboard`, `useAlerts` | P2 |
| `alert:resolved` | `useDashboard`, `useAlerts` | P2 |
| `emergency:new` | `useDashboard`, `useEmergencies` | P2 |
| `emergency:resolved` | `useDashboard`, `useEmergencies` | P2 |

---

## Production Readiness (Phase 3)

### Vite Config
- Default Vite config — outputs to `dist/` with code-splitting
- Environment variables via `VITE_` prefix
- Asset optimization handled by Vite (CSS/JS minification, chunk hashing)

### Bundle Split (lazy-loaded)
| Route | Chunk Size (gzip) |
|-------|-------------------|
| Dashboard | 8.7 KB (2.4 KB gzip) |
| Alerts | 1.6 KB (0.8 KB gzip) |
| Emergencies | 1.7 KB (0.8 KB gzip) |
| HelmetDetails | 7.7 KB (1.9 KB gzip) |
| Analytics | 401 KB (113 KB gzip) |
| HelmetMap (shared) | 155 KB (46 KB gzip) |

### Deployment Checklist
- ✅ `npm run build` passes with 0 errors, 0 warnings
- ✅ Environment variables separated from code (`.env`)
- ✅ Production API URL configurable via Vercel dashboard
- ✅ All chunks code-split via `React.lazy()`
- ✅ CSS/JS minified via Vite production build
- ✅ No `console.log` left in production code
- ✅ No unused imports or dead components
- ✅ Error boundary prevents white-screen crashes
- ✅ Tree-shaking compatible imports

---

## Backend Endpoints NOT Yet Connected

| Endpoint | Method | Use Case |
|----------|--------|----------|
| `GET /api/dashboard/summary` | GET | Alternate dashboard view (nice-to-have) |
| `GET /api/helmets` | GET | Full helmet management list |
| `POST /api/helmets` | POST | Register new helmet form |
| `PUT /api/helmets/:helmetId` | PUT | Edit helmet details |

---

## Code Quality

- **No class components** (except `ErrorBoundary`)
- **No TypeScript**, **no Tailwind**, **no Redux**
- **No Axios/Socket.IO in UI components** — all in hooks/services
- **Single socket instance** — shared via Context
- **React.memo** on 17 components
- **useMemo** on chart data transformations
- **useCallback** on all event handlers and refetch functions
- **Lazy loading** for all 5 route pages
- **Error boundary** wrapping the entire app
- **CSS BEM-like naming** across all 5 stylesheets
- **Accessibility**: focus-visible, ARIA labels, keyboard nav, semantic HTML, reduced-motion

---

## File Summary (23 new/changed in Phase 3)

| File | Lines | Role |
|------|-------|------|
| `src/services/analyticsService.js` | 12 | 4 analytics API methods |
| `src/hooks/useAnalytics.js` | 45 | Fetch all 4 analytics, filter-aware |
| `src/components/analytics/AnalyticsOverview.jsx` | 60 | 14 metric cards with memo |
| `src/components/analytics/TelemetryTrendChart.jsx` | 70 | Recharts LineChart (min/avg/max) with memo |
| `src/components/analytics/AlertTrendChart.jsx` | 90 | 3 Recharts PieCharts with memo |
| `src/components/analytics/EmergencyTrendChart.jsx` | 85 | AreaChart + PieChart with memo |
| `src/components/analytics/HelmetUsageChart.jsx` | 55 | PieChart (online/offline) with memo |
| `src/components/analytics/DateRangeFilter.jsx` | 45 | Date inputs + apply/clear with memo |
| `src/components/common/ErrorBoundary.jsx` | 35 | Class component, error recovery UI |
| `src/pages/Analytics/Analytics.jsx` | 50 | Full analytics page layout |
| `src/styles/phase3.css` | ~180 | Analytics, charts, error boundary, focus, transitions |
| `src/router/AppRouter.jsx` | UPDATED | Lazy imports, 5 active routes |
| `src/App.jsx` | UPDATED | ErrorBoundary + Suspense wrapping |
| `src/main.jsx` | UPDATED | imports phase3.css |
| `src/components/layout/Sidebar/Sidebar.jsx` | UPDATED | Analytics enabled, memo'd |
| `src/components/dashboard/StatusCards/StatusCards.jsx` | memo'd |
| `src/components/dashboard/HelmetTable/HelmetTable.jsx` | memo'd |
| `src/components/dashboard/LiveTelemetry/LiveTelemetry.jsx` | memo'd |
| `src/components/alerts/AlertCard.jsx` | memo'd |
| `src/components/emergency/EmergencyCard.jsx` | memo'd |
| `src/components/helmet/HelmetInfo.jsx` | memo'd |
| `src/components/helmet/SensorGrid.jsx` | memo'd, fixed React import |
| `src/components/layout/Navbar/Navbar.jsx` | memo'd |
| `src/components/layout/PageHeader/PageHeader.jsx` | memo'd |
| `src/components/map/HelmetMap.jsx` | memo'd |

---

## Remaining Improvements (Future)

| Item | Priority | Notes |
|------|----------|-------|
| Helmet management (register/edit) | Medium | Needs POST/PUT helmet endpoints |
| Telemetry history pagination controls | Medium | Backend supports page/limit |
| Dashboard summary widget | Low | `GET /api/dashboard/summary` exists |
| Skeleton loaders | Low | Nice-to-have for perceived performance |
| Dark/light theme toggle | Low | Would require CSS variable swap |
| PWA support | Low | Service worker + manifest |
| End-to-end tests | Low | Cypress or Playwright |
