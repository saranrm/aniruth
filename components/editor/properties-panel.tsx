"use client";

import React from "react";
import { useReactFlow, useNodes } from "@xyflow/react";
import { Square, Diamond, Circle as CircleIcon, ArrowRight, Box, Hexagon, Trash2 } from "lucide-react";
import type { CanvasNode, CanvasNodeData } from "./canvas-node";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

const COLORS = [
  { name: "Blue", value: "#3b82f6" },
  { name: "Purple", value: "#8b5cf6" },
  { name: "Emerald", value: "#10b981" },
  { name: "Amber", value: "#f59e0b" },
  { name: "Rose", value: "#f43f5e" },
  { name: "Zinc", value: "#e4e4e7" },
];

const SHAPES = [
  { value: "rectangle", label: "Rect", Icon: Square },
  { value: "diamond", label: "Diamond", Icon: Diamond },
  { value: "circle", label: "Circle", Icon: CircleIcon },
  { value: "arrow", label: "Arrow", Icon: ArrowRight },
  { value: "square-in-box", label: "Box", Icon: Box },
  { value: "polygon", label: "Polygon", Icon: Hexagon },
];

export function PropertiesPanel() {
  const nodes = useNodes();
  const { setNodes } = useReactFlow();

  const selectedNode = nodes.find(
    (n) => n.selected && n.type === "canvasNode"
  ) as CanvasNode | undefined;

  if (!selectedNode) return null;

  const handleLabelChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    updateData({ label: e.target.value });
  };

  const updateData = (fields: Partial<CanvasNodeData>) => {
    setNodes((prev) =>
      prev.map((n) => {
        if (n.id === selectedNode.id) {
          return {
            ...n,
            data: {
              ...n.data,
              ...fields,
            },
          };
        }
        return n;
      })
    );
  };

  const handleDelete = () => {
    setNodes((prev) => prev.filter((n) => n.id !== selectedNode.id));
  };

  const activeColor = selectedNode.data.color || "#3b82f6";
  const activeShape = selectedNode.data.shape || "rectangle";

  return (
    <div className="absolute right-4 top-4 z-30 w-72 rounded-xl border border-zinc-800 bg-zinc-950/90 p-4 shadow-2xl backdrop-blur-md text-zinc-100 flex flex-col gap-4 animate-in fade-in slide-in-from-top-2 duration-200">
      <div className="flex items-center justify-between border-b border-zinc-800 pb-2">
        <span className="text-xs font-semibold uppercase tracking-wider text-zinc-400">
          Node Properties
        </span>
        <Button
          variant="ghost"
          size="icon-sm"
          onClick={handleDelete}
          className="text-zinc-400 hover:text-red-400 hover:bg-zinc-900 cursor-pointer"
          title="Delete Node"
        >
          <Trash2 className="size-4" />
        </Button>
      </div>

      {/* Label Text Input */}
      <div className="space-y-1">
        <label className="text-xs font-medium text-zinc-400">Label text</label>
        <input
          type="text"
          value={selectedNode.data.label || ""}
          onChange={handleLabelChange}
          placeholder="New shape..."
          className="w-full rounded-md border border-zinc-800 bg-zinc-900 px-3 py-1.5 text-sm text-zinc-100 placeholder-zinc-500 focus:border-zinc-500 focus:outline-none transition-colors"
        />
      </div>

      {/* Shape Selector */}
      <div className="space-y-1.5">
        <span className="text-xs font-medium text-zinc-400">Shape</span>
        <div className="grid grid-cols-6 gap-1">
          {SHAPES.map(({ value, Icon, label }) => {
            const isActive = activeShape === value;
            return (
              <button
                key={value}
                type="button"
                onClick={() => updateData({ shape: value as CanvasNodeData["shape"] })}
                title={label}
                className={cn(
                  "flex h-9 items-center justify-center rounded-lg border text-zinc-400 cursor-pointer transition-all hover:bg-zinc-900 hover:text-zinc-200",
                  isActive
                    ? "border-primary bg-primary/10 text-primary hover:bg-primary/20 hover:text-primary"
                    : "border-zinc-800 bg-zinc-900/30"
                )}
              >
                <Icon className="size-4" />
              </button>
            );
          })}
        </div>
      </div>

      {/* Color Palette */}
      <div className="space-y-1.5">
        <span className="text-xs font-medium text-zinc-400">Accent Color</span>
        <div className="flex gap-2.5">
          {COLORS.map(({ name, value }) => {
            const isActive = activeColor === value;
            return (
              <button
                key={name}
                type="button"
                onClick={() => updateData({ color: value })}
                title={name}
                className={cn(
                  "size-6 rounded-full border border-black/50 cursor-pointer transition-transform hover:scale-110 relative flex items-center justify-center focus:outline-none",
                  isActive ? "ring-2 ring-primary ring-offset-2 ring-offset-zinc-950 scale-105" : ""
                )}
                style={{ backgroundColor: value }}
              >
                {isActive && (
                  <span className="size-1.5 rounded-full bg-zinc-950" />
                )}
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
}
