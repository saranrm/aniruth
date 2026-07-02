We need the base chrome components that frame every editor screen – the top navbar and the left sidebar shell. These will be reused and extended in every chapter that follows.
Create `components/editor/editor-navbar.tsx`.

Requirements:

fixed-height top navbar

left, center, and right sections

left section contains sidebar toggle button

use `PanelLeftOpen` / `PanelLeftClose` icons based on sidebar state

right section stays empty for now

dark background with subtle bottom border

### Project Sidebar 

create `components/editor/project-sidebar.tsx`

sidebar should float above the editor canvas

opening it should not push page content

slides in from the left

accepts `isOpen` and `onClose` props

header with `Projects` title + close button

shadcn `Tabs`:

My Projects

Shared

both tabs show empty placeholder state

full-width `New Project` button at the bottom with `Plus` icon

Use the existing color tokens from `globals.css` for dialog styling.

Support:

title

description

footer actions

Do not build actual dialogs yet.

### check when done 

-new components compile without typescript errors

-no lint errors 

-dialogue pattern is ready for future use