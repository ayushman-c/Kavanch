# KAVACH Mining Helmet Monitoring System

## Project Overview

KAVACH is an IoT-based mining safety system designed for hackathons. A
smart mining helmet continuously sends environmental, health, and
location data to a supervisor dashboard. The dashboard enables a
supervisor to monitor a miner in real time and receive emergency alerts.

The system is a prototype and currently supports **one helmet** and
**one supervisor dashboard**.

------------------------------------------------------------------------

# Objectives

-   Monitor miner safety in real time.
-   Display environmental sensor data.
-   Track the miner's latest GPS location.
-   Notify the supervisor immediately when the SOS button is pressed.
-   Keep the architecture simple, modular, and easy to extend.

------------------------------------------------------------------------

# Hardware

-   ESP32
-   NEO-6M GPS Module
-   Temperature Sensor
-   Gas Sensor 1
-   Gas Sensor 2
-   Gas Sensor 3
-   SOS Push Button

The ESP32 has Wi-Fi connectivity and transmits data every **2--3
seconds**.

------------------------------------------------------------------------

# Software Stack

## Frontend

-   React + Vite (JavaScript)
-   Tailwind CSS
-   React Leaflet
-   Recharts
-   Axios
-   Socket.IO Client

## Backend

-   Node.js
-   Express.js
-   Socket.IO

## Database

-   MongoDB Atlas (optional for MVP, used for history/logging)

## Deployment

-   Frontend → Vercel
-   Backend → Railway (or Render)
-   Database → MongoDB Atlas

------------------------------------------------------------------------

# System Architecture

ESP32 ↓ Wi-Fi ↓ Express + Socket.IO Server ↓ React Dashboard

Optional: Express → MongoDB Atlas (store historical sensor readings)

------------------------------------------------------------------------

# Data Flow

1.  ESP32 reads all sensors.
2.  Every 2--3 seconds it sends a payload to the backend.
3.  Backend validates and updates the current helmet state.
4.  Backend broadcasts the latest state via Socket.IO.
5.  Dashboard updates instantly.
6.  Backend may optionally save readings to MongoDB.

------------------------------------------------------------------------

# Sample Payload

``` json
{
  "helmetId": "KAVACH-01",
  "temperature": 31.2,
  "gas1": 120,
  "gas2": 18,
  "gas3": 4,
  "latitude": 22.5726,
  "longitude": 88.3639,
  "sos": false,
  "timestamp": 1752236400
}
```

------------------------------------------------------------------------

# Dashboard Features

## Live Status

-   Helmet online/offline
-   Last update timestamp
-   Connection health

## Sensor Monitoring

-   Temperature
-   Gas Sensor 1
-   Gas Sensor 2
-   Gas Sensor 3

## GPS

-   Live location
-   Last known location if GPS becomes unavailable

## Emergency

-   SOS popup
-   Audible alert
-   Red emergency indicator

## Visualization

-   Live sensor cards
-   Historical charts
-   Map view

------------------------------------------------------------------------

# Project Scope

## Current Prototype

-   One helmet
-   One dashboard
-   No authentication
-   Wi-Fi only
-   Real-time monitoring

## Future Scope

-   Multiple helmets
-   Authentication
-   Role management
-   Notifications
-   Analytics
-   Battery monitoring
-   Geofencing

------------------------------------------------------------------------

# Recommended Folder Separation

Frontend - UI - Components - Pages - Services - Socket integration

Backend - Routes - Controllers - Services - Socket server - Models -
Validation

------------------------------------------------------------------------

# Development Phases

## Phase 1

-   Backend setup
-   ESP32 communication
-   Live Socket.IO updates

## Phase 2

-   Dashboard UI
-   Live sensor cards
-   GPS map
-   SOS alert

## Phase 3

-   Charts
-   History
-   UI polish
-   Deployment

------------------------------------------------------------------------

# Constraints

-   Use JavaScript only (no TypeScript).
-   Keep the implementation simple and hackathon-friendly.
-   Avoid over-engineering.
-   Build incrementally and verify each feature before moving to the
    next.

------------------------------------------------------------------------

# AI Agent Instructions

-   Do not introduce unnecessary complexity.
-   Follow modern best practices.
-   Keep frontend and backend responsibilities separate.
-   Write modular, maintainable code.
-   Prefer clear folder structures.
-   Validate all incoming data.
-   Use Socket.IO for real-time communication.
-   If a requirement is unclear, ask instead of assuming.
-   Do not hallucinate APIs, hardware capabilities, or project
    requirements.
-   Focus on delivering a working prototype before adding optional
    enhancements.
