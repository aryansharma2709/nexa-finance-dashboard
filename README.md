# Nexa Finance Dashboard

A premium fintech analytics dashboard built with React, TypeScript, and Vite. The project is designed to feel evaluator-ready: polished UI, clear information hierarchy, role-aware interactions, resilient local persistence, and realistic data flows through a mock API.

Live Demo: `https://your-live-demo-link-here`

GitHub Repo: `https://github.com/your-username/your-repo-here`

## Overview

Nexa Finance Dashboard presents transaction analytics, KPI summaries, insights, filtering, CRUD workflows, and export tools in a luxury dark/light dashboard shell. The implementation focuses on clean component boundaries, derived state instead of hardcoded metrics, and frontend-only role behavior for both `Viewer` and `Admin`.

## Tech Stack

- React 19
- TypeScript
- Vite
- Tailwind CSS
- Zustand
- TanStack Table
- Recharts
- MSW
- Sonner
- Motion
- Papa Parse

## Key Features

- Premium dark/light fintech dashboard UI
- KPI summary cards driven by derived transaction data
- Analytics charts for balance trend and spending breakdown
- Insights cards sourced from shared state and mock API responses
- Advanced transaction filtering with active filter chips and reset paths
- Admin CRUD flows for transactions
- Viewer/Admin role-aware UI behavior
- CSV and JSON export of currently filtered transaction rows
- Local persistence for transactions, filters, role, and theme
- Responsive layout with mobile transaction cards and desktop data table
- Functional topbar search and sidebar navigation across dashboard sections

## Role-Based Behavior

- `Viewer`
  Read-only experience. Users can explore metrics, filters, charts, insights, and exports, but cannot create, edit, or delete transactions.
- `Admin`
  Full frontend CRUD access for transaction management, including create, edit, and delete flows from the transactions section.

## Mock API Usage

The app uses MSW to simulate backend behavior for transactions and insights. This keeps the UI realistic without requiring a live server and makes evaluator testing predictable.

Mock API responsibilities include:

- fetching transactions
- creating, updating, and deleting transactions
- returning insights derived from the current data
- supporting failure-path testing for resilient UI states

## State Management Approach

Zustand is used for shared dashboard state. The store holds:

- transactions
- filters
- current role
- current theme

Selectors derive filtered rows, totals, category breakdowns, trends, and insight inputs from state rather than hardcoding display values. Persisted storage is wrapped with a safe localStorage helper to avoid crashes and recover from malformed stored JSON.

## Export Functionality

The transactions header includes the export menu. CSV and JSON exports use the currently filtered transaction rows, preserve success toast feedback, and generate context-aware filenames with the current date.

## Theme Support

The dashboard supports both dark and light themes. Theme choice is persisted locally, and shared surface tokens keep cards, charts, shells, and controls visually consistent across modes.

## Responsive Design Notes

- Desktop uses a full data table and expanded navigation shell.
- Mobile uses stacked transaction cards for readability and touch comfort.
- Filters, chips, export controls, and role controls are designed to wrap cleanly on smaller screens.
- Layout spacing stays consistent while preserving the premium visual tone.

## Project Structure

```text
src/
  app/                 App shell and providers
  components/          Shared layout and brand components
  features/dashboard/  Dashboard UI, hooks, charts, filters, exports
  features/finance/    Domain types, API layer, seed data
  features/theme/      Theme syncing logic
  lib/                 Utilities, storage, parsers, MSW setup
  store/               Zustand store and selectors
  styles/              Global design tokens and base styling
```

## Setup Instructions

1. Install dependencies:

```bash
npm install
```

2. Start the development server:

```bash
npm run dev
```

3. Open the local Vite URL shown in the terminal.

## Run / Build Commands

```bash
npm run dev
npm run build
npm run lint
npm run preview
```

## Assumptions and Trade-Offs

- Role handling is intentionally frontend-only for this assignment.
- MSW is used instead of a real backend to keep the project portable and easy to evaluate.
- Persistence is localStorage-based for simplicity and reliability in a demo setting.
- Search and section navigation are designed for shell usability rather than full app routing.
- The focus is implementation quality, clarity, and polish over adding unnecessary feature breadth.

## Future Improvements

- Connect the dashboard to a real authenticated API
- Add server-backed role enforcement
- Add automated tests for filters, exports, and CRUD flows
- Expand keyboard accessibility and interaction testing
- Add richer analytics ranges, drill-downs, and saved views
- Introduce pagination or virtualization for very large datasets
