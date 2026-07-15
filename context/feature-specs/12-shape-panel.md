# Collaborative Shape Panel and Custom Nodes

Implement a shape insertion toolbar and shape customization controls on the collaborative canvas, including custom shape node rendering (Rectangle, Circle, Diamond, Triangle).

## Implementation

1. **Custom Node Types**:
   - Register a custom React Flow node component for `"canvasNode"` in `components/editor/flow.tsx`.
   - This component should look at `data.shape` and `data.color` and render appropriate styles.
   - Support shapes:
     - `rectangle`: Card with rounded corners.
     - `circle`: Circular layout.
     - `diamond`: Rotated square or SVG diamond shape.
     - `triangle`: Triangle SVG shape.
   - Nodes should have a subtle border highlighting using `data.color` (using CSS variables or predefined classes) and display `data.label` centered.
   - Render connection handles on all 4 sides (Top, Right, Bottom, Left) using `@xyflow/react` `<Handle>` components to enable easy diagramming.

2. **Floating Toolbar (Shape Selector)**:
   - Render a floating toolbar (e.g. bottom-center of the canvas) containing buttons for each shape icon: Square, Circle, Triangle, Diamond.
   - Clicking a shape insertion button adds a new component-driven Node at the center of the current screen bounds (using `reactFlowInstance.screenToFlowPosition` or screen viewport coordinates).
   - Newly inserted nodes default to:
     - `type: "canvasNode"`
     - `data.shape`: chosen shape type
     - `data.color`: a default color (e.g., `#a855f7` violet)
     - `data.label`: `"New Shape"`

3. **Node Properties Panel**:
   - Add a floating customization panel (e.g., top-right or adjacent to the node, or a popover/side panel) that reveals controls when a single `canvasNode` is selected.
   - Controls:
     - **Text label**: Input field to update `data.label`.
     - **Shape Selector**: Toggle or select between rectangle, circle, diamond, triangle.
     - **Color Selector**: Grid of color buttons (e.g. Violet, Amber, Emerald, Blue, Rose) to change `data.color`.
   - Modifying these controls updates the selected node's `data` using `setNodes((nds) => nds.map(...))` or your React Flow `onNodesChange` flow, which automatically propagates to Liveblocks.

## Scope Limits

- Focus on custom shape nodes, toolbar insertion, and node property modification.
- Do NOT build the AI chat database/routing or full persistent DB saving (Prisma updates) for node states in this step.

## Check When Done

- Floating toolbar allows inserting Rectangle, Circle, Diamond, and Triangle nodes.
- Selected custom nodes display correct shapes and accent colors.
- Connection handles exist on Top, Bottom, Left, and Right of custom nodes.
- Selection of a node displays a property inspector allowing label, color, and shape type selection.
- All modifications are collaborative (sync in real-time between clients).
- `npm run build` runs cleanly.