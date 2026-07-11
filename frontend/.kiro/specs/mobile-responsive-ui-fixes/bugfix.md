# Bugfix Requirements Document

## Introduction

The KAVACH Mining Helmet Monitor frontend has multiple mobile responsive UI glitches
affecting usability and accessibility on viewports ≤768px and ≤480px. The issues fall
into two categories: (1) broken interactive controls — buttons that are invisible,
inaccessible, below minimum touch-target size, or orphaned — and (2) layout gaps —
overflow, misalignment, and missing navigation patterns that make sidebar content
completely inaccessible on mobile. This document captures the defective behaviors,
the correct behaviors, and the existing behaviors that must not regress.

---

## Bug Analysis

### Current Behavior (Defect)

**Sidebar / Navigation**

1.1 WHEN the viewport width is ≤768px THEN the sidebar collapse/expand button
    (`.sidebar__collapse-btn`) is hidden via `display: none` yet the footer element
    still renders and occupies layout space, creating phantom spacing

1.2 WHEN the viewport width is ≤768px THEN there is no hamburger menu or drawer
    control to show or hide the sidebar, making all sidebar navigation links
    completely inaccessible on mobile

1.3 WHEN the viewport width is ≤768px THEN the sidebar is forced to 60px collapsed
    width with no mechanism to expand it, causing a permanent state desync between
    React's `collapsed` prop and the CSS-forced collapsed state

**Navbar**

1.4 WHEN the viewport width is ≤480px THEN the connection indicator is hidden via CSS
    but its adjacent divider element remains visible, creating an orphaned divider with
    no neighbouring content

1.5 WHEN the viewport width is ≤480px THEN the navbar contains 5 items crammed into a
    shrinking space with no reflow, causing overflow or visual crowding

**Icon Button Touch Targets**

1.6 WHEN a user on a touch device interacts with `.navbar__icon-btn` (34×34px) THEN the
    touch target is below the WCAG 2.5.5 recommended minimum of 44×44px

1.7 WHEN a user on a touch device interacts with `.sidebar__collapse-btn` (28×28px)
    THEN the touch target is below the WCAG 2.5.5 recommended minimum of 44×44px

**Table Header (Helmet/Enterprise Table)**

1.8 WHEN the viewport width is ≤768px AND the table header wraps via `flex-wrap: wrap`
    THEN the search input and filter button have no `max-width` constraint, causing
    horizontal overflow beyond the viewport edge

1.9 WHEN the viewport width is ≤768px AND the table header wraps THEN the filter button
    has no `flex-shrink: 0` constraint, allowing it to compress below its usable size

**Analytics Date Filter**

1.10 WHEN the viewport width is ≤768px AND the date filter wraps via `flex-wrap: wrap`
     THEN the Apply and Clear buttons (`btn--sm`) have cramped padding (5px 10px),
     resulting in a touch target below the recommended 44px minimum tap height

**Alerts/Emergencies Page Toolbar**

1.11 WHEN the viewport width is ≤480px AND the `.page-toolbar` wraps THEN the count
     badge and Refresh button may overlap or misalign due to missing wrapping layout rules

**Dashboard / LiveTelemetry**

1.12 WHEN the viewport width is ≤480px THEN the right-column `LiveTelemetry` component
     does not constrain its width, potentially overflowing the single-column grid

---

### Expected Behavior (Correct)

**Sidebar / Navigation**

2.1 WHEN the viewport width is ≤768px THEN the system SHALL render a hamburger menu
    button in the navbar that opens a full-height slide-in drawer overlay containing
    the sidebar navigation content with a backdrop

2.2 WHEN the viewport width is ≤768px THEN the system SHALL hide the sidebar collapse
    button footer entirely (no phantom space) and instead expose navigation exclusively
    through the hamburger drawer

2.3 WHEN the viewport width is ≤768px THEN the system SHALL synchronise the sidebar
    open/closed state with the hamburger drawer, eliminating the React `collapsed` prop
    / CSS desync

**Navbar**

2.4 WHEN the viewport width is ≤480px THEN the system SHALL hide the divider adjacent
    to the connection indicator together with the indicator itself, so no orphaned
    spacing is left behind

2.5 WHEN the viewport width is ≤480px THEN the system SHALL reflow the navbar items
    gracefully so all visible elements fit within the viewport without overflow

**Icon Button Touch Targets**

2.6 WHEN the viewport width is ≤768px THEN the system SHALL render `.navbar__icon-btn`
    with a minimum tap area of 44×44px (via padding or `min-width`/`min-height`) to
    meet WCAG 2.5.5

2.7 WHEN the viewport width is ≤768px THEN the system SHALL render
    `.sidebar__collapse-btn` with a minimum tap area of 44×44px on mobile

**Table Header**

2.8 WHEN the viewport width is ≤768px AND the table header wraps THEN the system SHALL
    constrain the search input and filter button row to `width: 100%` with
    `flex-shrink: 0` on the filter button, preventing horizontal overflow

2.9 WHEN the viewport width is ≤768px THEN the filter button SHALL maintain its full
    legible size and not be compressed when the header wraps

**Analytics Date Filter**

2.10 WHEN the viewport width is ≤768px AND the date filter row wraps THEN the system
     SHALL render the Apply and Clear buttons at full width with a minimum height of
     44px, meeting the recommended touch target size

**Alerts/Emergencies Page Toolbar**

2.11 WHEN the viewport width is ≤480px AND the `.page-toolbar` wraps THEN the system
     SHALL apply a wrapping flex layout that keeps the count badge and Refresh button
     on separate rows or in a safe alignment so they do not overlap

**Dashboard / LiveTelemetry**

2.12 WHEN the viewport width is ≤480px THEN the system SHALL constrain `LiveTelemetry`
     to `width: 100%` within the single-column grid, preventing overflow

**Drawer Animation**

2.13 WHEN the hamburger drawer opens or closes on mobile THEN the system SHALL animate
     the slide-in/slide-out with a smooth CSS transition (≥200ms ease) unless
     `prefers-reduced-motion` is active

---

### Unchanged Behavior (Regression Prevention)

**Sidebar — Desktop**

3.1 WHEN the viewport width is >768px THEN the system SHALL CONTINUE TO render the
    sidebar in its existing collapsed/expanded toggle mode controlled by the
    `.sidebar__collapse-btn`

3.2 WHEN the viewport width is >768px THEN the system SHALL CONTINUE TO persist sidebar
    collapse state as driven by the React `collapsed` prop

**Navbar — Desktop**

3.3 WHEN the viewport width is >768px THEN the system SHALL CONTINUE TO display the
    connection indicator and its divider in the navbar

3.4 WHEN the viewport width is >480px THEN the system SHALL CONTINUE TO display all
    existing navbar items (theme toggle, notification bell, connection indicator) without
    layout changes

**Icon Buttons — Desktop**

3.5 WHEN the viewport width is >768px THEN `.navbar__icon-btn` and
    `.sidebar__collapse-btn` SHALL CONTINUE TO render at their existing sizes (34×34px
    and 28×28px respectively) with no visual change

**Table — Desktop**

3.6 WHEN the viewport width is >768px THEN the table header SHALL CONTINUE TO render
    in a single non-wrapping row with the title, search input, and filter button inline

3.7 WHEN the viewport width is >768px THEN the table SHALL CONTINUE TO display all 8
    columns without horizontal scroll (existing behaviour)

**Analytics Date Filter — Desktop**

3.8 WHEN the viewport width is >768px THEN the Apply and Clear buttons SHALL CONTINUE
    TO render at their current `btn--sm` size inline with the date inputs

**Alerts/Emergencies Toolbar — Desktop / Tablet**

3.9 WHEN the viewport width is >480px THEN the `.page-toolbar` SHALL CONTINUE TO render
    its count badge and Refresh button in a single row without wrapping

**Dashboard Grid**

3.10 WHEN the viewport width is >480px THEN the existing two-column dashboard grid
     layout SHALL CONTINUE TO render with `LiveTelemetry` in the right column without
     constraint changes

**Reduced Motion**

3.11 WHEN the user has `prefers-reduced-motion: reduce` set THEN the system SHALL
     CONTINUE TO suppress all drawer slide animations, consistent with the existing
     animation policy

**All Pages — Existing Functionality**

3.12 WHEN any fix is applied THEN existing React component logic (hooks, socket events,
     data fetching, routing) SHALL CONTINUE TO function without modification

---

## Bug Condition Summary

```pascal
FUNCTION isBugCondition(X)
  INPUT: X of type ViewportContext
  OUTPUT: boolean

  RETURN (
    (X.viewportWidth <= 768 AND X.element IN [sidebar, table-header, icon-buttons, date-filter])
    OR
    (X.viewportWidth <= 480 AND X.element IN [navbar-divider, page-toolbar, live-telemetry])
  )
END FUNCTION

// Property: Fix Checking
FOR ALL X WHERE isBugCondition(X) DO
  result ← renderLayout'(X)
  ASSERT no_overflow(result)
    AND touch_target_meets_44px(result)
    AND no_orphaned_elements(result)
    AND sidebar_accessible(result)
END FOR

// Property: Preservation Checking
FOR ALL X WHERE NOT isBugCondition(X) DO
  ASSERT renderLayout(X) = renderLayout'(X)
END FOR
```
