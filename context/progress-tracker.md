# Progress Tracker

Update this file after every meaningful implementation change.

## Current Phase

- Completed: Collaborative Shape Panel and Custom Nodes

## Current Goal

- Feature finalized and verified successfully.

- Added Shapes Node Panel toolbar under left workspace sidebar for selecting Rectangle, Circle, Diamond, and Triangle shapes.
- Configured HTML5 drag-and-drop protocols on both Flow (collaborative) and LocalFlow (fallback preview draft) canvases, converting coordinates dynamically to canvas positions based on panning and zoom offsets.
- Implemented CanvasNodeComponent to render custom SVG shapes (Rectangle, Circle, Diamond, Triangle) with selection glow and top/right/bottom/left handles.
- Built PropertiesPanel properties inspector for real-time labelEditing, color accent changes, shape transformations, and node deletion.
- Set explicit calc height settings on the editor layout container to fix React Flow width/height canvas element resolution warnings in HTML rendering tree.
- Created GET /api/projects/shared to query projects shared with the current user as a collaborator.
- Fixed ShareDialog to dispatch router.refresh() and a project-shared window event after invite/remove actions.
- Rewrote ProjectSidebar to dynamically fetch shared projects from /api/projects/shared, listen for the project-shared event, and re-fetch on tab switch and sidebar open.
- Fixed Liveblocks auth: replaced string authEndpoint with a callback function that POSTs the room ID in the request body and returns forbidden sentinel on 403 to prevent reconnect loops.
- Added shared React Flow canvas types (CanvasNodeData, CanvasNode, CanvasEdge) in types/canvas.ts.
- Replaced the workspace canvas placeholder with a collaborative canvas in components/editor/editor-workspace.tsx.
- Created components/editor/collaborative-canvas.tsx wrapper setting up Liveblocks RoomProvider (with cursor presence), ClientSideSuspense, and ErrorBoundary.
- Built components/editor/flow.tsx binding React Flow to Liveblocks state using useLiveblocksFlow, loose connections, fitView, dot background, and MiniMap.
- Configured standard Liveblocks types (Presence, UserMeta) in liveblocks.config.ts.
- Created cached Liveblocks Node client and deterministic user color mapping helper in lib/liveblocks.ts.
- Implemented POST /api/liveblocks-auth to authorize users for dynamic project rooms, creating the room on the fly if needed and returning session tokens (access tokens).
- Installed @liveblocks/node dependency and verified clean TypeScript compilation and Next.js builds.
- Added editor-scoped active project state with route synchronization and localStorage persistence.
- Wired workspace sidebar create, rename, and delete controls to the existing project actions and dialogs.
- Split owned and shared project data for both the editor home and workspace sidebar, with read-only shared project controls.
- Updated project list and detail APIs to use owner-or-collaborator access checks and added selection loading/error handling.
- Added the workspace Share dialog with temporary copy-link feedback and owner/read-only collaborator states.
- Added collaborator list, invite, and removal API routes with server-side owner enforcement for writes.
- Enriched collaborator records with Clerk display names and avatars while retaining email-only fallbacks.
- Built `/editor/[roomId]` as a server-rendered workspace route with Clerk identity and project access checks.
- Added `lib/project-access.ts` for current identity lookup and owner-or-collaborator project queries.
- Added `ProjectCollaborator` persistence and its Prisma migration for email-based collaborator access.
- Added the `AccessDenied` state for missing or unauthorized workspaces.
- Reworked the editor workspace into a full-height shell with a docked project sidebar, project navbar, disabled share control, AI sidebar toggle, canvas placeholder, and AI placeholder.
- Created `hooks/use-project-actions.ts` hook for client-side API mutations, utilizing shared helpers.
- Extracted shared project utilities (like `generateRoomId` and fetch wrappers) into `lib/projects.ts`.
- Converted `app/editor/page.tsx` into an async Server Component fetching initial projects using Prisma.
- Updated `components/editor/editor-home.tsx` to handle `initialProjects` prop, migrating dialog state to use actions hook.
- Handled Prisma Driver Adapters required by V7 by implementing standard `@prisma/adapter-pg` driver inside `lib/prisma.ts`.
- Verified TypeScript compilation and build processes (`npm run build`).
- Created `lib/prisma.ts` global client instance.
- Updated Prisma configuration to properly support `prismaSchemaFolder` multi-file schemas.
- Implemented `app/api/projects/route.ts` (GET list, POST create) with Clerk auth.
- Implemented `app/api/projects/[projectId]/route.ts` (GET, PUT, DELETE) with Clerk auth.
- Verified TypeScript compilation (`npx tsc --noEmit`) passes cleanly with the generated Prisma client.
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

- Wait for next user requirements or modifications.

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
- Keep authorization queries in `lib/project-access.ts` so project routes and future protected endpoints share one access rule.
- Store collaborator access as normalized email addresses and enrich presentation data from Clerk at read time instead of maintaining a local user table.

## Session Notes

- Repaired sidebar selection, navigation, active state, shared project loading, and workspace actions; `npx.cmd tsc --noEmit` and `npm.cmd run build` passed.
- Completed `09-share-dialog.md`; `npx.cmd tsc --noEmit` and `npm.cmd run build` passed.
- Completed `08-editor-workspace-shell.md`; `npx.cmd tsc --noEmit` and `npm.cmd run build` passed with `/editor/[roomId]` registered as a dynamic server route.
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
