"use client";

import React from "react";
import { Square, Circle, Diamond, Triangle } from "lucide-react";

export function NodePanel() {
  const onDragStart = (event: React.DragEvent, nodeType: string) => {
    event.dataTransfer.setData("application/reactflow", nodeType);
    event.dataTransfer.effectAllowed = "move";
  };

  const shapes = [
    { type: "rectangle", label: "Rectangle", Icon: Square },
    { type: "circle", label: "Circle", Icon: Circle },
    { type: "diamond", label: "Diamond", Icon: Diamond },
    { type: "triangle", label: "Triangle", Icon: Triangle },
  ];

  return (
    <div className="space-y-4">
      <div className="text-xs font-semibold uppercase tracking-wider text-zinc-500">
        Drag Shapes to Canvas
      </div>
      <div className="grid grid-cols-2 gap-3">
        {shapes.map(({ type, label, Icon }) => (
          <div
            key={type}
            draggable
            onDragStart={(event) => onDragStart(event, type)}
            className="flex flex-col items-center justify-center gap-2 rounded-xl border border-zinc-800 bg-zinc-900/50 p-4 text-center cursor-grab select-none hover:bg-zinc-800/80 hover:border-zinc-700 transition-all active:cursor-grabbing group"
          >
            <Icon className="size-8 text-zinc-400 group-hover:text-primary transition-colors" />
            <span className="text-xs font-medium text-zinc-300">{label}</span>
          </div>
        ))}
      </div>
    </div>
  );
}
