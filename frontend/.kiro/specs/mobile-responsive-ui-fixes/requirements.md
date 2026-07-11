# Requirements Document

## Introduction

The Kavanch (KAVACH) frontend is a real-time mining helmet monitoring dashboard built with React, Recharts, and React Leaflet. It displays live telemetry, alerts, emergencies, analytics charts, and per-helmet sensor data across five pages: Dashboard, Alerts, Emergencies, Analytics, and Helmet Details.

Currently the UI has a fixed-width sidebar (260px), a horizontally packed navbar, data-dense tables, multi-column grids, and chart layouts that are designed for desktop viewports. While some partial responsive rules exist (sidebar collapses to icon-only at ≤768px; grids switch to single-column at ≤1200px), several critical issues remain:

- The sidebar has no mobile overlay or close mechanism — it permanently consumes 60px of horizontal space at all times on small screens.
- The navbar contains a search bar and profile name that are hidden on small screens, but there is no mobile menu toggle to access navigation.
- The telemetry item grid collapses to 2 columns at 768px but not below 400px screens.
- Charts rendered by Recharts use fixed or percentage widths that overflow on very narrow viewports.
- The date range filter inputs have a `min-width: 140px` that causes horizontal scroll on 320–375px screens.
- Touch tap targets on sidebar links, navbar icon buttons, and table rows are below the 44×44px recommended minimum.
- The dashboard hero section and page header stack vertically but the font sizes are not scaled for mobile reading.
- The helmet details page two-column grid collapses correctly at 1200px but the left and right panels still have wide internal grids.

This feature addresses all of these gaps to make the KAVACH dashboard fully usable on phones (320px–480px), small tablets (481px–767px), and large tablets (768px–1023px).

## Glossary

- **App_Layout**: The root layout shell composed of the `Sidebar`, `Navbar`, and `app-layout__content` content area.
- **Sidebar**: The left-side navigation panel (`Sidebar.jsx`) containing the KAVACH logo, nav links, and user footer. Desktop width: 260px. Collapsed icon-only width: 60px.
- **Navbar**: The top header bar (`Navbar.jsx`) containing the page title, search input, connection status, theme toggle, notifications button, and profile pill.
- **Mobile_Overlay**: A semi-transparent full-screen overlay rendered on top of page content when the mobile drawer Sidebar is open, allowing the user to dismiss it.
- **Hamburger_Button**: An icon button rendered in the Navbar on mobile viewports that toggles the Sidebar drawer open or closed.
- **Dashboard_Page**: The main overview page (`Dashboard.jsx`) showing metric cards, helmet table, map, live telemetry panel, and activity feed.
- **Metrics_Grid**: The grid of `metric-card` elements showing Workers Online, Helmets Connected, Active Alerts, Emergencies, Avg Air Quality, Avg Heart Rate, and Battery Health.
- **Dashboard_Grid**: The two-column grid layout (`dashboard-grid`) splitting the main content column and the side panel (live telemetry + activity feed).
- **Helmet_Table**: The scrollable data table listing all helmet records on the Dashboard page (`HelmetTable.jsx`).
- **Live_Telemetry_Panel**: The panel (`LiveTelemetry.jsx`) showing a live stream of incoming telemetry entries, each with a 4-column data grid.
- **Telemetry_Item_Grid**: The internal `grid-template-columns: repeat(4, 1fr)` grid inside each telemetry entry showing HR, SpO₂, Temp, and Gas values.
- **Analytics_Page**: The analytics page (`Analytics.jsx`) showing the date range filter, overview stat cards, and four Recharts chart cards.
- **Chart_Card**: A bordered card wrapping a Recharts `ResponsiveContainer` chart (TelemetryTrendChart, AlertTrendChart, EmergencyTrendChart, HelmetUsageChart).
- **Date_Filter**: The date range filter component (`DateRangeFilter.jsx`) on the Analytics page, with From/To date inputs and Apply/Clear buttons.
- **Helmet_Details_Page**: The per-helmet detail page (`HelmetDetails.jsx`) with a two-column grid showing helmet info, sensor grid, map, and telemetry history alongside alerts and emergencies.
- **Sensor_Grid**: The grid of sensor value cards (`SensorGrid.jsx`) showing current readings for HR, SpO₂, temperature, gas level, battery, and location.
- **Alerts_Page**: The page listing all system alerts (`Alerts.jsx`) with a toolbar and paginated alert list.
- **Emergencies_Page**: The page listing all active and historical emergencies (`Emergencies.jsx`) with a toolbar and paginated emergency list.
- **Page_Header**: The `PageHeader.jsx` component rendered at the top of each page with a title, subtitle, and optional meta chips.
- **Touch_Target**: An interactive element whose tappable area must be at least 44×44 CSS pixels per WCAG 2.5.5 and Apple HIG guidelines.
- **Breakpoint_Mobile**: Viewport width ≤ 480px (phones in portrait orientation).
- **Breakpoint_Tablet_Small**: Viewport width 481px–767px (large phones in landscape, small tablets).
- **Breakpoint_Tablet_Large**: Viewport width 768px–1023px (tablets in portrait).
- **Breakpoint_Desktop**: Viewport width ≥ 1024px (laptops and desktop monitors).

---

## Requirements

### Requirement 1: Mobile Sidebar Navigation

**User Story:** As a mine operator using a mobile device, I want to open and close the navigation sidebar with a tap, so that I can access different pages without permanently losing 60px of screen width.

#### Acceptance Criteria

1. WHEN the viewport width is at or below 767px, THE App_Layout SHALL render the Sidebar as a full-height off-canvas drawer with a width of 280px that is hidden off-screen by default (translateX(-280px)) rather than occupying persistent horizontal space.
2. WHEN the viewport width is at or below 767px, THE Navbar SHALL render a Hamburger_Button as the leftmost element in the navbar left region, replacing the current always-visible sidebar toggle.
3. WHEN the viewport width is between 768px and 1023px inclusive, THE App_Layout SHALL render the Sidebar as a collapsed icon-only drawer (60px wide) in its off-canvas default state, with the Hamburger_Button visible in the Navbar.
4. WHEN the Hamburger_Button is tapped, THE App_Layout SHALL transition the Sidebar drawer to translateX(0) using a CSS transform transition of 200ms ease.
5. WHEN the Hamburger_Button is tapped, THE App_Layout SHALL render the Mobile_Overlay (semi-transparent full-screen backdrop) behind the Sidebar drawer.
6. WHEN the Mobile_Overlay is tapped, THE App_Layout SHALL transition the Sidebar drawer back to its hidden off-screen position and remove the Mobile_Overlay.
7. WHEN a Sidebar nav link is tapped on a viewport at or below 1023px, THE App_Layout SHALL automatically close the Sidebar drawer (translateX(-280px)) and remove the Mobile_Overlay, then navigate to the selected route.
8. WHEN the viewport width is at or above 1024px, THE App_Layout SHALL render the Sidebar in its standard fixed position (translateX(0), 260px wide) and SHALL NOT render the Hamburger_Button.
9. THE Hamburger_Button SHALL have a minimum rendered tap target size of 44×44 CSS pixels.
10. WHILE the Sidebar drawer is open on a viewport at or below 1023px, THE App_Layout SHALL set `overflow: hidden` on the `body` element to prevent background page scroll.

---

### Requirement 2: Responsive Navbar

**User Story:** As a mobile user, I want the top navigation bar to remain usable and uncluttered on small screens, so that I can see the page title, connection status, and key actions without horizontal overflow.

#### Acceptance Criteria

1. WHEN the viewport width is at or below 767px, THE Navbar SHALL hide the search input and replace it with a search icon button; WHEN that search icon button is tapped, THE Navbar SHALL expand a full-width inline search bar in place of the navbar title row.
2. WHEN the viewport width is at or below 480px, THE Navbar SHALL hide the profile name text and the vertical divider, showing only the profile avatar.
3. IF the viewport width is between 481px and 767px inclusive, THE Navbar SHALL show the profile name text alongside the profile avatar.
4. WHEN the viewport width is at or below 480px, THE Navbar SHALL hide the connection status pill.
5. THE Navbar SHALL not produce horizontal overflow (overflow-x scroll) on any viewport width of 320px or wider.
6. THE Navbar icon buttons (notifications, theme toggle, profile, search icon) SHALL each have a minimum rendered tap target area of 44×44 CSS pixels at all viewport widths.
7. WHEN the viewport width is at or below 767px, THE Navbar SHALL display the KAVACH logo image (with text fallback "KAVACH") in place of the page title's subtitle segment.
8. WHEN the expanded inline search bar is active and the user taps outside it or taps the search icon button again, THE Navbar SHALL collapse the inline search bar and restore the default navbar title row.

---

### Requirement 3: Responsive Metrics Grid (Dashboard)

**User Story:** As a mobile user viewing the Dashboard, I want the metric cards to be readable and appropriately sized, so that I can quickly scan key status values without squinting at truncated content.

#### Acceptance Criteria

1. WHEN the viewport width is at or above 1024px, THE Metrics_Grid SHALL display metric cards in a row of up to 4 columns, with each card occupying a minimum width of 200px and expanding to fill available space equally.
2. WHEN the viewport width is between 768px and 1023px inclusive, THE Metrics_Grid SHALL display metric cards in exactly 3 columns.
3. WHEN the viewport width is between 481px and 767px inclusive, THE Metrics_Grid SHALL display metric cards in exactly 2 columns.
4. WHEN the viewport width is at or below 480px, THE Metrics_Grid SHALL display metric cards in exactly 1 column.
5. THE metric-card elements SHALL maintain a minimum height of 72px at all viewport widths, and SHALL display the full value and label text without truncation or ellipsis.
6. WHEN the viewport width is at or below 480px, THE metric-card value font size SHALL be at least 20px and the label font size SHALL be at least 12px.

---

### Requirement 4: Responsive Dashboard Layout

**User Story:** As a mobile user on the Dashboard, I want the main content and side panel to stack vertically, so that the helmet table and live telemetry are both fully accessible without horizontal scrolling.

#### Acceptance Criteria

1. WHEN the viewport width is at or below 1199px, THE Dashboard_Grid SHALL switch from a two-column layout (`1fr 360px`) to a single-column layout (`1fr`), with the Helmet_Table rendered above the Live_Telemetry_Panel.
2. WHEN the viewport width is at or below 767px, THE Helmet_Table container SHALL have `overflow-x: auto` applied, allowing all currently visible columns to remain accessible by horizontal swipe.
3. WHEN the viewport width is at or below 480px, THE Helmet_Table SHALL hide the "Location" and "Last Seen" columns so that the remaining columns require no more than 100px of horizontal scroll beyond the viewport width.
4. WHEN the viewport width is at or below 767px, THE Live_Telemetry_Panel SHALL have a `max-height` of 300px with `overflow-y: auto`, preventing it from dominating the page when stacked below the table.
5. THE Helmet_Table rows SHALL have a minimum rendered height of 44px at all viewport widths, with the full row area treated as the touch target.

---

### Requirement 5: Responsive Telemetry Item Grid

**User Story:** As a mobile user reviewing live telemetry entries, I want the sensor values in each telemetry entry to be legible, so that I can read heart rate, SpO₂, temperature, and gas level without the values being squeezed or clipped.

#### Acceptance Criteria

1. WHILE the viewport width is at or above 481px, THE Telemetry_Item_Grid SHALL display all four fields in a `repeat(4, 1fr)` grid.
2. WHILE the viewport width is at or below 480px, THE Telemetry_Item_Grid SHALL display fields in a `repeat(2, 1fr)` grid (2 columns, 2 rows).
3. THE telemetry-item__value elements SHALL have a minimum font size of 13px at all viewport widths.
4. WHILE the viewport width is at or below 480px, THE telemetry-item padding SHALL be 10px vertical and 8px horizontal.
5. WHILE the viewport width is at or below 480px, THE telemetry-item__value elements SHALL wrap their text content rather than clip or truncate it.

---

### Requirement 6: Responsive Analytics Charts

**User Story:** As a mobile user on the Analytics page, I want the trend charts to be fully visible and interactable, so that I can read data points and interact with chart tooltips on a touchscreen.

#### Acceptance Criteria

1. WHEN the viewport width is at or below 1199px, THE analytics-page__charts grid SHALL switch from `1fr 1fr` to `1fr` (single column).
2. THE Chart_Card Recharts `ResponsiveContainer` SHALL have a width of `100%` and a fixed minimum height of 250px at all viewport widths.
3. WHEN the viewport width is at or below 480px, THE Chart_Card SHALL reduce its internal padding from 20px to 12px to maximise chart rendering area.
4. WHEN the viewport width is at or below 480px, THE Recharts axis tick font size SHALL be 10px to prevent label overlap on narrow viewports.
5. THE Chart_Card SHALL not produce horizontal overflow (overflow-x scroll) on any viewport of 320px or wider.

---

### Requirement 7: Responsive Date Range Filter

**User Story:** As a mobile user on the Analytics page, I want the date range filter to fit within the screen width, so that I can select a date range without triggering horizontal page scroll.

#### Acceptance Criteria

1. WHEN the viewport width is at or below 767px, THE Date_Filter SHALL switch from a horizontal row layout to a single-column vertical stack, with the From input, To input, Apply button, and Clear button each occupying a full row.
2. WHILE the viewport width is at or below 767px, THE Date_Filter date inputs SHALL have a computed width of 100% of the Date_Filter container width, with no `min-width` constraint active.
3. WHILE the viewport width is at or below 767px, THE Date_Filter Apply and Clear buttons SHALL each have a rendered height of at least 44px and a width of 100% of the container.
4. THE Date_Filter SHALL not produce horizontal overflow (scrollWidth > clientWidth) on any viewport of 320px or wider.
5. WHILE the viewport width is at or below 480px, THE Date_Filter container padding SHALL be 12px on all sides.

---

### Requirement 8: Responsive Helmet Details Page

**User Story:** As a mobile user viewing a specific helmet's detail page, I want the helmet info, sensor readings, map, and telemetry history to stack in a logical reading order, so that I can review all data without horizontal scrolling.

#### Acceptance Criteria

1. WHEN the viewport width is at or below 1199px, THE Helmet_Details_Page two-column grid SHALL collapse to a single column, with the left panel (HelmetInfo, SensorGrid, Map) appearing above the right panel (Alerts, Emergencies, Telemetry History).
2. WHEN the viewport width is at or below 767px, THE Sensor_Grid SHALL display exactly 2 columns.
3. WHEN the viewport width is at or below 480px, THE Sensor_Grid SHALL display exactly 1 column.
4. WHEN the viewport width is at or below 767px, THE helmet-info__grid SHALL display exactly 2 columns.
5. WHEN the viewport width is at or below 480px, THE helmet-info__grid SHALL display exactly 1 column.
6. WHEN the viewport width is at or below 767px, THE map-container height SHALL be reduced from 300px to 220px to preserve vertical screen space.
7. THE Telemetry_Item_Grid within the telemetry history list SHALL follow the same responsive grid rules defined in Requirement 5.

---

### Requirement 9: Responsive Alerts and Emergencies Pages

**User Story:** As a mobile user on the Alerts or Emergencies page, I want the toolbar and list items to be comfortably tappable and readable, so that I can review and scan incidents efficiently on a small screen.

#### Acceptance Criteria

1. WHEN the viewport width is at or below 767px, THE page-toolbar on the Alerts_Page and Emergencies_Page SHALL stack its left and right sections vertically.
2. WHEN the viewport width is at or below 767px, THE page-toolbar refresh button SHALL have a minimum height of 44px.
3. THE alert-item and emergency-item list entries SHALL have a minimum tap target height of 44px at all viewport widths.
4. WHEN the viewport width is at or below 480px, THE alert-item and emergency-item padding SHALL be 10px 12px to fit content within narrow viewports.
5. WHEN the viewport width is at or below 480px, THE alert-item__footer SHALL wrap its content with `flex-wrap: wrap` rather than keeping it on a single line.

---

### Requirement 10: Touch Target Compliance

**User Story:** As a mobile user, I want all interactive elements to have adequately sized tap targets, so that I can accurately tap buttons and links without accidental mis-taps.

#### Acceptance Criteria

1. WHILE the viewport width is at or below 767px, THE Sidebar nav links SHALL each have a minimum rendered height of 44px, with the full row area (spanning the Sidebar width) acting as the touch target.
2. THE Navbar icon buttons (theme toggle, notifications, profile) SHALL each have a minimum rendered area of 44×44 CSS pixels at all viewport widths.
3. THE Hamburger_Button SHALL have a minimum rendered area of 44×44 CSS pixels at all viewport widths.
4. THE pagination buttons SHALL have a minimum rendered size of 40×40 CSS pixels at all viewport widths.
5. WHILE the viewport width is at or below 767px, THE Date_Filter Apply and Clear buttons SHALL each have a minimum rendered height of 44px.
6. WHILE the viewport width is at or below 767px, THE table rows in Helmet_Table SHALL have a minimum rendered height of 44px, with the full row area acting as the touch target.

---

### Requirement 11: Viewport Meta and Base Layout Integrity

**User Story:** As a user on any mobile browser, I want the page to render at the correct device width without zooming or clipping, so that content fits naturally within the screen.

#### Acceptance Criteria

1. THE index.html SHALL include a `<meta name="viewport" content="width=device-width, initial-scale=1.0">` tag.
2. THE `<html>` and `<body>` elements SHALL not produce horizontal overflow (scrollWidth > clientWidth) on any viewport of 320px or wider.
3. THE global CSS SHALL set `overflow-x: hidden` on the `body` element to prevent accidental horizontal scroll caused by absolutely positioned or overflowing child elements.
4. WHILE the viewport width is between 481px and 767px inclusive, THE app-layout__content padding SHALL be 16px on all sides.
5. WHILE the viewport width is at or below 480px, THE app-layout__content padding SHALL be 12px on all sides.
6. WHILE the viewport width is at or above 768px, THE app-layout__content padding SHALL be 32px on all sides (desktop baseline).

---

### Requirement 12: Responsive Page Headers

**User Story:** As a mobile user, I want page titles and subtitles to scale appropriately, so that headers remain readable without taking up excessive vertical space.

#### Acceptance Criteria

1. WHEN the viewport width is at or below 767px, THE page-header__title font size SHALL be 22px.
2. WHEN the viewport width is at or below 480px, THE page-header__title font size SHALL be 18px.
3. WHEN the viewport width is at or below 767px, THE page-header__subtitle font size SHALL be 13px (down from 16px on desktop).
4. WHEN the viewport width is at or below 480px, THE page-header__subtitle font size SHALL be 12px.
5. WHEN the viewport width is at or below 480px, THE page-header__meta items SHALL stack vertically with a gap of 6px.
6. WHEN the viewport width is at or below 767px, THE dashboard-hero flex container SHALL switch to a column direction, align items to flex-start, and apply a gap of 12px between children.
7. IF the viewport width is 320px or wider, THE Page_Header SHALL display the full page title text without ellipsis or clipping.
