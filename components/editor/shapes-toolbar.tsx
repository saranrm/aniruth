"use client";

import React from "react";
import { Square, Diamond, Circle, ArrowRight, Box, Hexagon } from "lucide-react";

export type ShapeType = "rectangle" | "diamond" | "circle" | "arrow" | "square-in-box" | "polygon";

type ToolbarItem = {
  type: ShapeType;
  label: string;
  icon: React.ComponentType<{ className?: string }>;
  width: number;
  height: number;
};

export const SHAPES_TOOLBAR_ITEMS: ToolbarItem[] = [
  { type: "rectangle", label: "Rectangle", icon: Square, width: 120, height: 80 },
  { type: "diamond", label: "Diamond", icon: Diamond, width: 100, height: 100 },
  { type: "circle", label: "Circle", icon: Circle, width: 100, height: 100 },
  { type: "arrow", label: "Arrow", icon: ArrowRight, width: 150, height: 40 },
  { type: "square-in-box", label: "Square-in-box", icon: Box, width: 100, height: 100 },
  { type: "polygon", label: "Polygon", icon: Hexagon, width: 100, height: 100 },
];

export function ShapesToolbar() {
  const onDragStart = (event: React.DragEvent, item: ToolbarItem) => {
    const payload = {
      type: item.type,
      width: item.width,
      height: item.height,
    };
    event.dataTransfer.setData("application/reactflow", JSON.stringify(payload));
    event.dataTransfer.effectAllowed = "move";
  };

  return (
    <div className="absolute bottom-6 left-1/2 z-30 -translate-x-1/2 flex items-center gap-1 px-3 py-2 rounded-xl border border-zinc-800 bg-zinc-950/90 shadow-2xl backdrop-blur-md text-zinc-400">
      {SHAPES_TOOLBAR_ITEMS.map((item) => {
        const Icon = item.icon;
        return (
          <div
            key={item.type}
            draggable
            onDragStart={(e) => onDragStart(e, item)}
            title={item.label}
            className="flex size-10 cursor-grab items-center justify-center rounded-lg transition-colors hover:bg-zinc-900 hover:text-zinc-100 active:cursor-grabbing border border-transparent hover:border-zinc-800"
          >
            <Icon className="size-5" />
          </div>
        );
      })}
    </div>
  );
}
