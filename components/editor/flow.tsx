"use client";

import React, { useCallback, useRef } from "react";
import { 
  ReactFlow, 
  MiniMap, 
  Background, 
  BackgroundVariant, 
  ConnectionMode, 
  ReactFlowProvider, 
  useReactFlow 
} from "@xyflow/react";
import { useLiveblocksFlow } from "@liveblocks/react-flow";

import "@xyflow/react/dist/style.css";
import "@liveblocks/react-flow/styles.css";

import { CanvasNodeComponent } from "./canvas-node";
import { PropertiesPanel } from "./properties-panel";
import { ShapesToolbar } from "./shapes-toolbar";

const nodeTypes = {
  canvasNode: CanvasNodeComponent,
};

function FlowInner() {
  const { nodes, edges, onNodesChange, onEdgesChange, onConnect, onDelete } =
    useLiveblocksFlow({
      suspense: true,
      nodes: {
        initial: [],
      },
      edges: {
        initial: [],
      },
    });

  const reactFlowInstance = useReactFlow() as any;
  const counterRef = useRef(0);

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

        const newNode = {
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

        reactFlowInstance.setNodes((current: any) => current.concat(newNode));
      } catch (err) {
        console.error("Error onDrop: ", err);
      }
    },
    [reactFlowInstance]
  );

  return (
    <div className="h-full w-full">
      <ReactFlow
        nodes={nodes || undefined}
        edges={edges || undefined}
        onNodesChange={onNodesChange}
        onEdgesChange={onEdgesChange}
        onConnect={onConnect}
        onDelete={onDelete}
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
    </div>
  );
}

export function Flow() {
  return (
    <ReactFlowProvider>
      <FlowInner />
    </ReactFlowProvider>
  );
}
