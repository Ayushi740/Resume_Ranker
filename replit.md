# Workspace

## Overview

pnpm workspace monorepo using TypeScript. Each package manages its own dependencies.

## Stack

- **Monorepo tool**: pnpm workspaces
- **Node.js version**: 24
- **Package manager**: pnpm
- **TypeScript version**: 5.9
- **API framework**: Express 5
- **Database**: PostgreSQL + Drizzle ORM
- **Validation**: Zod (`zod/v4`), `drizzle-zod`
- **API codegen**: Orval (from OpenAPI spec)
- **Build**: esbuild (CJS bundle)

## Key Commands

- `pnpm run typecheck` — full typecheck across all packages
- `pnpm run build` — typecheck + build all packages
- `pnpm --filter @workspace/api-spec run codegen` — regenerate API hooks and Zod schemas from OpenAPI spec
- `pnpm --filter @workspace/db run push` — push DB schema changes (dev only)
- `pnpm --filter @workspace/api-server run dev` — run API server locally

See the `pnpm-workspace` skill for workspace structure, TypeScript setup, and package details.

## Flask Resume Screener (Python)

Standalone Python service in `flask-resume-screener/`.

- Stack: Flask, Flask-SQLAlchemy (SQLite at `flask-resume-screener/app.db`), Werkzeug auth, PyPDF2, scikit-learn TF-IDF + cosine similarity.
- Run via workflow `Flask Resume API` (`python flask-resume-screener/app.py`, port 5000).
- Endpoints: `/api/signup`, `/api/login`, `/api/logout`, `/api/me`, `POST/GET /api/resumes`, `DELETE /api/resumes/<id>`, `POST /api/rank`.
- Uploads stored under `flask-resume-screener/uploads/<user_id>/`.
