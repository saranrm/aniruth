"use client";

import React, { useCallback, useRef } from "react";
import {
  ReactFlow,
  MiniMap,
  Background,
  BackgroundVariant,
  ConnectionMode,
  ReactFlowProvider,
  useReactFlow,
  addEdge,
  useNodesState,
  useEdgesState,
  type Node,
  type Edge,
  type OnConnect,
} from "@xyflow/react";

import "@xyflow/react/dist/style.css";
import { CanvasNodeComponent } from "./canvas-node";
import { PropertiesPanel } from "./properties-panel";
import { ShapesToolbar } from "./shapes-toolbar";

const nodeTypes = {
  canvasNode: CanvasNodeComponent,
};

function LocalFlowInner() {
  const [nodes, setNodes, onNodesChange] = useNodesState<Node>([]);
  const [edges, setEdges, onEdgesChange] = useEdgesState<Edge>([]);

  const reactFlowInstance = useReactFlow() as any;
  const counterRef = useRef(0);

  const onConnect: OnConnect = useCallback(
    (connection) => setEdges((eds) => addEdge(connection, eds)),
    [setEdges]
  );

  const onDragOver = useCallback((event: React.DragEvent) => {
    event.preventDefault();
    event.dataTransfer.dropEffect = "move";
  }, []);

  const onDrop = useCallback(
    (event: React.DragEvent) => {
      event.preventDefault();

      const rawData = event.dataTransfer.getData("application/reactflow");
      if (!rawData) return;

      try {
        const payload = JSON.parse(rawData);
        const { type: shapeName } = payload;
        
        if (!shapeName) return;

        const projectFn = reactFlowInstance.project || reactFlowInstance.screenToFlowPosition;
        if (!projectFn) return;

        const position = projectFn({
          x: event.clientX,
          y: event.clientY,
        });

        const timestamp = Date.now();
        const counterVal = ++counterRef.current;
        const nodeId = `${shapeName}_${timestamp}_${counterVal}`;

        const newNode: Node = {
          id: nodeId,
          type: "canvasNode",
          position,
          data: {
            shape: shapeName,
            type: shapeName,
            label: "",
            color: "#a855f7",
          },
        };

        setNodes((current) => current.concat(newNode));
      } catch (err) {
        console.error("Error onDrop: ", err);
      }
    },
    [reactFlowInstance, setNodes]
  );

  return (
    <div className="h-full w-full">
      <ReactFlow
        nodes={nodes}
        edges={edges}
        onNodesChange={onNodesChange}
        onEdgesChange={onEdgesChange}
        onConnect={onConnect}
        nodeTypes={nodeTypes}
        onDragOver={onDragOver}
        onDrop={onDrop}
        connectionMode={ConnectionMode.Loose}
        fitView
      >
        <MiniMap
          style={{
            backgroundColor: "#09090b",
            border: "1px solid #27272a",
          }}
          maskColor="rgba(0, 0, 0, 0.4)"
          nodeColor="#3f3f46"
        />
        <Background variant={BackgroundVariant.Dots} gap={12} size={1} color="#27272a" />
        <ShapesToolbar />
        <PropertiesPanel />
      </ReactFlow>
      <div className="absolute bottom-4 left-4 z-10 rounded border border-zinc-700 bg-zinc-900 px-3 py-1.5 text-xs text-zinc-400">
        Demo/Local Mode (Liveblocks not configured)
      </div>
    </div>
  );
}

export function LocalFlow() {
  return (
    <ReactFlowProvider>
      <LocalFlowInner />
    </ReactFlowProvider>
  );
}
