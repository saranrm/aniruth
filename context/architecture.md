# Architecture Context

## Stack

| Layer     | Technology           | Role                                      |
| --------- | -------------------- | ----------------------------------------- |
| Framework | Next.js + TypeScript | App framework and type-safe UI/runtime    |
| UI        | Tailwind + shadcn/ui | Theme tokens and reusable UI primitives   |
| Auth      | Clerk                | Authentication, user menu, route guarding |
| Storage   | Mock client state    | Temporary project data until specified    |

## System Boundaries

- `app/` - Next.js routes, layouts, and page composition.
- `components/` - Reusable UI and editor interface components.
- `lib/` - Shared utilities.
- `context/` - Product, architecture, workflow, and progress documentation.

## Storage Model

- **Client mock state**: Project dialog and sidebar data remain mock-only until API or persistence work is specified.

## Auth and Access Model

- Users authenticate with Clerk.
- Protected application routes require a signed-in user.
- Project ownership and persistence access rules are not implemented until a storage spec is introduced.

## Invariants

1. Generated shadcn/ui primitives should remain clean for future registry updates.
2. Interactive editor state should stay isolated to client editor components until persistence is specified.
3. Clerk's built-in profile, user menu, and logout flows should remain intact.
4. Do not add persistence behavior without a current feature spec.
