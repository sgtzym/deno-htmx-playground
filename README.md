# Deno HTMX Template

Build server-rendered web apps with [Deno](https://deno.com) 🦕 – using SQLite, Hono, HTMX, and
Alpine.

## Stack

| Layer         | Technology                                                                              | Purpose                                         |
| ------------- | --------------------------------------------------------------------------------------- | ----------------------------------------------- |
| Runtime       | [Deno v2](https://deno.com)                                                             | TypeScript runtime, built-in tooling            |
| Server        | [Hono](https://hono.dev)                                                                | HTTP routing, middleware, JSX rendering         |
| Database      | [@db/sqlite](https://jsr.io/@db/sqlite) + [@sgtzym/sparq](https://jsr.io/@sgtzym/sparq) | SQLite client with type-safe query builder      |
| Interactivity | [HTMX](https://htmx.org)                                                                | Partial HTML swaps without a frontend framework |
| Reactivity    | [Alpine](https://alpinejs.dev)                                                          | Lightweight client-side state                   |
| Styles        | [Tailwind CSS v4](https://tailwindcss.com) + [DaisyUI v5](https://daisyui.com)          | Utility-first CSS with component classes        |

## Architecture

The server renders HTML directly. HTMX updates the page by swapping HTML fragments returned from the
server — no client-side routing, no JavaScript framework.

```
src/
├── app/          # Server setup, config, middleware
├── entities/     # Data models and repositories (one file per entity)
├── lib/          # Shared utilities and factories
├── routes/       # HTTP handlers — api/ for JSON, web/ for HTML
├── styles/       # Tailwind entry point
└── web/          # JSX components and page templates
```

**Routing split:** API routes (`/api/v1/*`) return JSON for external clients. Web routes (`/*`)
return HTML for browsers.

**HTMX rendering:** The `render()` helper in `src/web/shared/render.tsx` handles three cases
automatically:

- Direct browser request → full page with layout
- HTMX request → page (main) content only
- HTMX request with `HX-Target` → matching HTML fragment

## Getting started

```bash
# Install dependencies and copy client assets
deno task copy:assets

# Start dev server
deno task dev
```

The app runs on `http://localhost:8000` by default.

## Configuration

Create `.env` and adjust as needed.

| Variable   | Default    | Description                         |
| ---------- | ---------- | ----------------------------------- |
| `HOST`     | `0.0.0.0`  | Server hostname                     |
| `PORT`     | `8000`     | Server port                         |
| `DB_PATH`  | `./app.db` | SQLite database path                |
| `DEBUG`    | `false`    | Show error stack traces             |
| `DENO_ENV` | `dev`      | Environment (`dev`, `test`, `prod`) |

## Adding Entities

1. Create `src/entities/my_entity.ts` incl. a `sparq()` model and `createRepo()`.
2. Add the model to `src/app/db.ts` (`db.init([...])`).
3. Create `src/routes/my_entity_api.ts` and/or `src/routes/my_entity_web.tsx`.
4. Register the routes in `src/routes/index.ts`.
5. Add pages and JSX components as needed in `src/web/my_entity/`.
