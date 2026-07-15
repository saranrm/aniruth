import { Liveblocks } from "@liveblocks/node";

const globalForLiveblocks = global as unknown as { liveblocks: Liveblocks };

function getLiveblocksClient() {
  if (!globalForLiveblocks.liveblocks) {
    const secret = process.env.LIVEBLOCKS_SECRET_KEY || "sk_dummy_secret_for_build";
    globalForLiveblocks.liveblocks = new Liveblocks({ secret });
  }
  return globalForLiveblocks.liveblocks;
}

export const liveblocks = getLiveblocksClient();

const PALETTE = [
  "#f43f5e", // Rose
  "#ec4899", // Pink
  "#d946ef", // Fuchsia
  "#a855f7", // Purple
  "#6366f1", // Indigo
  "#3b82f6", // Blue
  "#0ea5e9", // Sky
  "#06b6d4", // Cyan
  "#14b8a6", // Teal
  "#10b981", // Emerald
  "#22c55e", // Green
  "#84cc16", // Lime
  "#eab308", // Yellow
  "#f97316", // Orange
];

/**
 * Deterministically maps a user ID to a consistent color from a fixed palette.
 */
export function getUserColor(userId: string): string {
  let hash = 0;
  for (let i = 0; i < userId.length; i++) {
    hash = userId.charCodeAt(i) + ((hash << 5) - hash);
  }
  const index = Math.abs(hash) % PALETTE.length;
  return PALETTE[index];
}
