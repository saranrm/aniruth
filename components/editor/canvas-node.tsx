"use client";

import React from "react";
import { Handle, Position, type NodeProps, type Node } from "@xyflow/react";

export type CanvasNodeData = {
  label?: string;
  shape?: string;
  type?: string;
  color?: string;
};

export type CanvasNode = Node<CanvasNodeData, "canvasNode">;

const SHAPE_SIZES: Record<string, { width: number; height: number }> = {
  rectangle: { width: 120, height: 80 },
  diamond: { width: 100, height: 100 },
  circle: { width: 100, height: 100 },
  arrow: { width: 150, height: 40 },
  "square-in-box": { width: 100, height: 100 },
  polygon: { width: 100, height: 100 },
};

export function CanvasNodeComponent({
  data,
  selected,
  isConnectable = true,
}: NodeProps<CanvasNode>) {
  const label = data.label ?? "";
  const color = data.color || "#a855f7";

  const rawShape = data.type || data.shape || "rectangle";
  const shapeType = rawShape.toLowerCase().replace(/_/g, "-");
  
  const size = SHAPE_SIZES[shapeType] || SHAPE_SIZES.rectangle;

  const renderShapeGeometry = () => {
    switch (shapeType) {
      case "diamond":
        return (
          <svg width={size.width} height={size.height} className="overflow-visible">
            <polygon
              points="50,2 98,50 50,98 2,50"
              fill="#09090b"
              stroke={color}
              strokeWidth="2"
            />
          </svg>
        );
      case "circle":
        return (
          <svg width={size.width} height={size.height} className="overflow-visible">
            <circle
              cx="50"
              cy="50"
              r="48"
              fill="#09090b"
              stroke={color}
              strokeWidth="2"
            />
          </svg>
        );
      case "arrow":
        return (
          <svg width={size.width} height={size.height} className="overflow-visible">
            <line
              x1="5"
              y1="20"
              x2="135"
              y2="20"
              stroke={color}
              strokeWidth="3"
              strokeLinecap="round"
            />
            <polygon
              points="135,13 147,20 135,27"
              fill={color}
            />
          </svg>
        );
      case "square-in-box":
        return (
          <svg width={size.width} height={size.height} className="overflow-visible">
            <rect
              x="2"
              y="2"
              width="96"
              height="96"
              rx="6"
              fill="#09090b"
              stroke={color}
              strokeWidth="2"
            />
            <rect
              x="30"
              y="30"
              width="40"
              height="40"
              rx="3"
              fill={color}
            />
          </svg>
        );
      case "polygon":
        return (
          <svg width={size.width} height={size.height} className="overflow-visible">
            <polygon
              points="50,2 98,26 98,74 50,98 2,74 2,26"
              fill="#09090b"
              stroke={color}
              strokeWidth="2"
            />
          </svg>
        );
      case "rectangle":
      default:
        return (
          <svg width={size.width} height={size.height} className="overflow-visible">
            <rect
              x="2"
              y="2"
              width="116"
              height="76"
              rx="6"
              fill="#09090b"
              stroke={color}
              strokeWidth="2"
            />
          </svg>
        );
    }
  };

  return (
    <div
      className="relative flex items-center justify-center font-sans group transition-all duration-200"
      style={{
        width: size.width,
        height: size.height,
        filter: selected
          ? `drop-shadow(0 0 5px ${color})`
          : "drop-shadow(0 2px 4px rgba(0, 0, 0, 0.25))",
      }}
    >
      {renderShapeGeometry()}

      <Handle
        type="target"
        position={Position.Top}
        id="top"
        isConnectable={isConnectable}
        className="!w-2 !h-2 !bg-zinc-600 border border-zinc-900 !min-w-0 !min-h-0 hover:!scale-125 transition-transform"
        style={{ top: 0 }}
      />
      <Handle
        type="source"
        position={Position.Right}
        id="right"
        isConnectable={isConnectable}
        className="!w-2 !h-2 !bg-zinc-600 border border-zinc-900 !min-w-0 !min-h-0 hover:!scale-125 transition-transform"
        style={{ right: 0 }}
      />
      <Handle
        type="target"
        position={Position.Bottom}
        id="bottom"
        isConnectable={isConnectable}
        className="!w-2 !h-2 !bg-zinc-600 border border-zinc-900 !min-w-0 !min-h-0 hover:!scale-125 transition-transform"
        style={{ bottom: 0 }}
      />
      <Handle
        type="source"
        position={Position.Left}
        id="left"
        isConnectable={isConnectable}
        className="!w-2 !h-2 !bg-zinc-600 border border-zinc-900 !min-w-0 !min-h-0 hover:!scale-125 transition-transform"
        style={{ left: 0 }}
      />

      <div className="absolute inset-0 flex items-center justify-center pointer-events-none select-none px-3 text-center">
        <span className="z-10 text-xs font-semibold text-zinc-100 truncate max-w-[90%] whitespace-nowrap overflow-hidden text-ellipsis pointer-events-none">
          {label || <span className="text-zinc-600 italic font-normal">{rawShape}</span>}
        </span>
      </div>
    </div>
  );
}
