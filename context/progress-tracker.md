# Progress Tracker

Update this file after every meaningful implementation change.

## Current Phase

- Complete

## Current Goal

- Project dialogs and sidebar actions from `04-project-dialogs.md` are implemented.

## Completed

- Installed and configured shadcn/ui with the Radix Nova preset.
- Added UI primitives: Button, Card, Dialog, Input, Tabs, Textarea, and Scroll Area.
- Installed Lucide React and shadcn dependencies.
- Added `lib/utils.ts` with the reusable `cn()` helper.
- Updated global theme tokens and root layout so the app defaults to the dark theme.
- Verified with `npm run lint`, `npx tsc --noEmit`, and `npm run build`.
- Added `components/editor/editor-navbar.tsx` with fixed-height left, center, and right sections plus sidebar-state icons.
- Added `components/editor/project-sidebar.tsx` with floating slide-in behavior, project tabs, empty states, footer action support, and New Project button.
- Added `components/editor/editor-layout.tsx` and used it on the home page to compose the editor navbar and project sidebar.
- Installed `@clerk/ui` and added a shared Clerk dark appearance config that uses app CSS variables.
- Wrapped the root layout in `ClerkProvider`.
- Added Clerk sign-in and sign-up routes with minimal responsive auth layouts.
- Added root `proxy.ts` route protection that keeps only auth pages public.
- Fixed `proxy.ts` public auth route matching so `/sign-in` and `/sign-up` are not protected.
- Added standard Clerk sign-in and sign-up URL env vars and used them for public auth routing.
- Updated `/` to redirect authenticated users to `/editor` and unauthenticated users to `/sign-in`.
- Added `/editor` and placed Clerk's built-in `UserButton` in the editor navbar.
- Added the `/editor` home screen with centered project creation copy and New Project action.
- Added a dedicated project dialog hook for dialog, form, and loading state.
- Added Create, Rename, and Delete project dialogs wired to mock project data.
- Wired sidebar New Project, rename, and delete actions to the dialogs.
- Added a mobile sidebar backdrop scrim that closes the sidebar when tapped.

## In Progress

- None.

## Next Up

- Continue with the next feature spec.

## Open Questions

- None.

## Architecture Decisions

- Use shadcn/ui's generated `components/ui/*` files as-is so future registry updates remain clean.
- Use Radix-backed primitives because Dialog, Tabs, and Scroll Area need accessible interaction behavior.
- Set dark theme tokens at `:root` and apply the `dark` class in `app/layout.tsx` to avoid default light styling.
- Keep editor chrome components in `components/editor/*` and expose behavior through props so future screens can own state.
- Keep sidebar state in a client editor layout so app routes can remain mostly server-rendered while interactive chrome stays isolated.
- Keep Clerk's built-in forms, user menu, profile settings, and logout flow intact while styling through Clerk appearance variables.
- Keep project dialog state client-side and mock-only until API/persistence work is specified.

## Session Notes

- Fixed sign-in 404 by changing Clerk proxy public route patterns to static `/sign-in(.*)` and `/sign-up(.*)` matchers; verified `http://localhost:3000/sign-in` returns 200, plus `npm run lint`, `npx tsc --noEmit`, and `npm run build` passed.
- Completed project dialogs/sidebar actions implementation from `04-project-dialogs.md`; `npm run lint`, `npx tsc --noEmit`, and `npm run build` passed.
- Started project dialogs/sidebar actions implementation from `04-project-dialogs.md`.
- Completed editor chrome implementation from `02-editor.md`; `npm run lint`, `npx tsc --noEmit`, and `npm run build` passed.
- Wired the editor navbar and project sidebar into `EditorLayout`, then rendered the home page inside it.
- Started editor chrome implementation from `02-editor.md`.
- Completed Clerk auth implementation from `03.auth.md`; `npm run lint`, `npx tsc --noEmit`, and `npm run build` passed.
- Started Clerk auth implementation from `03.auth.md`.
- Build verification initially failed because sandboxed Next build could not fetch Google Fonts; rerunning with approved network access passed.
- `app/page.tsx` and default `public/*.svg` deletions were already present in the working tree and were left untouched.
