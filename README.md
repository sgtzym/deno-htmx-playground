# Deno HTMX Test

Building server-rendered web apps with [Deno](https://deno.com) 🦕 – using SQLite, Hono, HTMX, and
Alpine.

**Note:** This is a playground repo for testing the stack and educational purposes only - use at own risk.

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

This project follows a vertical slice architecture. Each feature (entity) owns its complete stack — model, repository, API handler, and UI — in a single directory under entities/. This keeps related code together and avoids the cognitive overhead of navigating across multiple top-level layers (controllers/, models/, views/) for a single change. Cross-cutting concerns like layout, shared components, and middleware live in core/ and shared/.

```
src/
├── core/             # Server config, middleware, DB connection
├── entities/         # Feature modules (model, repo, api, lib, ui, pages)
├── modules/          # Auth and other non-entity modules (signin, register)
├── shared/           # Cross-cutting components, layout, utilities
├── styles/           # Tailwind entry point
├── app.tsx           # Hono app instance and route registration
└── main.ts           # Entry point
```

**Routing split:** API routes (`/api/v1/*`) return JSON for external clients. Web routes (`/*`)
return HTML for browsers.

**HTMX rendering:** The `render()` helper in `~shared/lib/render.tsx` handles three cases
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

1. Create `~entities/my_entity/model.ts` incl. a `sparq()` model and `~entities/my_entity/repo.ts` via `createRepo()`.
2. Add the model to `src/core/db.ts` (`db.init([...])`).
3. Create `~entities/my_entity/api.ts` and/or `~entities/my_entity/ui.ts`.
4. Register the routes in `~core/app.ts`.
5. Add pages and JSX components as needed in `~entities/my_entity/` or `~modules/my_module/`.
