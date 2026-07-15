import type { Node, Edge } from "@xyflow/react";

export type CanvasNodeData = {
  label: string;
  color: string;
  shape: string;
  [key: string]: unknown;
};

export type CanvasNode = Node<CanvasNodeData, "canvasNode">;
export type CanvasEdge = Edge<Record<string, any>, "canvasEdge">;
