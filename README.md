# AI Semester Sim

Browser-based semester simulation game built with React, TypeScript, Vite, Zustand, and Phaser.

This repository now includes authenticated, backend-backed save/load/reset using Supabase Auth + Postgres and Vercel-compatible serverless API routes.

## Tech Stack

- Frontend runtime: React + Vite + TypeScript + Zustand + Phaser
- Auth + DB: Supabase Auth + Postgres
- Save API: Vercel serverless route at /api/game-save
- Hosting target: Vercel free tier + Supabase free tier

## What Persistence Covers

Saves are durable and user-linked:

- Survive page refresh
- Survive browser close/reopen
- Survive server restart
- Isolated per authenticated Supabase user

Current auth mode is minimal and non-disruptive: the app attempts anonymous Supabase sign-in when no session exists (requires Supabase Anonymous Auth enabled).

## Local Setup

1. Install dependencies.

```bash
npm install
```

2. Create environment file from example.

```bash
cp .env.example .env
```

3. Fill these values in .env:

- VITE_SUPABASE_URL
- VITE_SUPABASE_ANON_KEY
- SUPABASE_URL
- SUPABASE_ANON_KEY
- SUPABASE_SERVICE_ROLE_KEY

4. In Supabase dashboard:

- Enable Anonymous Auth (Authentication -> Providers -> Anonymous).
- Run SQL migration from [supabase/migrations/20260318_create_game_saves.sql](supabase/migrations/20260318_create_game_saves.sql).

5. Run full local stack (frontend + API) with one command.

```bash
npm run dev:full
```

This starts:

- Vite frontend on its default port
- Vercel local API runtime on port 3000
- Vite dev proxy forwarding /api/* to http://localhost:3000

Optional:

- Frontend only: npm run dev:web
- API only: npm run dev:api

If you only run npm run dev (Vite-only), /api routes are not served and cloud save requests will fall back to local resilience cache.

6. (Optional) Run frontend only.

```bash
npm run dev
```

## Save API Contract

Route: /api/game-save

- GET: returns authenticated user save payload or null.
- PUT: validates payload and upserts one row per user.
- DELETE: clears authenticated user save.

All methods require Bearer token auth (Supabase access token).

## Save Schema Versioning

Save payload type and migration/validation are in [src/persistence/saveSchema.ts](src/persistence/saveSchema.ts).

- versioned payload (v1)
- validation guard
- migration entry point for future versions

## Core Integration Points

- Startup hydration: [src/game/bootstrap.ts](src/game/bootstrap.ts)
- Phaser boot waits for hydration: [src/App.tsx](src/App.tsx)
- Autosave orchestration: [src/persistence/autosave.ts](src/persistence/autosave.ts)
- Durable store adapter: [src/persistence/storeSaveAdapter.ts](src/persistence/storeSaveAdapter.ts)
- Persistence service: [src/persistence/persistenceService.ts](src/persistence/persistenceService.ts)
- Reset UI entry: [src/components/overlay/MenuOverlay.tsx](src/components/overlay/MenuOverlay.tsx)

## Scripts

- npm run dev
- npm run dev:full
- npm run dev:web
- npm run dev:api
- npm run lint
- npm run build
- npm run preview

## Cost Guardrails Implemented

- One save row per user (upsert on user_id)
- Compact durable payload (no transient modal/hover/input UI state)
- Debounced autosave on meaningful progression deltas only
- No movement-tick or render-loop saves
- Local cache used only as resilience fallback, not canonical source of truth
