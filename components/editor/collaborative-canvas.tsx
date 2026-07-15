"use client";

import { useEffect, useState } from "react";
import { LiveblocksProvider, RoomProvider, ClientSideSuspense } from "@liveblocks/react/suspense";
import { useErrorListener } from "@liveblocks/react/suspense";
import { ErrorBoundary } from "react-error-boundary";
import { Flow } from "./flow";
import { LocalFlow } from "./local-flow";

type CollaborativeCanvasProps = {
  roomId: string;
};

// Inner component: listens for auth/connection errors and shows fallback UI
function CanvasWithErrorHandling() {
  const [connectionError, setConnectionError] = useState<string | null>(null);

  useErrorListener((error) => {
    if (error.context.type === "ROOM_CONNECTION_ERROR") {
      const code = error.context.code;
      if (code === -1) {
        setConnectionError("Authentication failed. Please check your LIVEBLOCKS_SECRET_KEY environment variable.");
      } else if (code === 4001) {
        setConnectionError("You do not have access to this workspace.");
      } else {
        setConnectionError(`Connection error (code ${code}). Please try again.`);
      }
    }
  });

  if (connectionError) {
    return (
      <div className="flex h-full w-full items-center justify-center bg-zinc-950 text-zinc-400">
        <div className="text-center space-y-2 max-w-sm px-4">
          <h3 className="text-lg font-medium text-zinc-200">Connection Error</h3>
          <p className="text-sm">{connectionError}</p>
        </div>
      </div>
    );
  }

  return <Flow />;
}

export function CollaborativeCanvas({ roomId }: CollaborativeCanvasProps) {
  // Check if Liveblocks is configured at all
  const [isConfigured, setIsConfigured] = useState<boolean | null>(null);

  useEffect(() => {
    // Quick probe: call auth to see if it's configured
    fetch("/api/liveblocks-auth", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ room: roomId }),
    })
      .then((res) => {
        if (res.status === 403) {
          return res.json().then((data) => {
            if (data?.error === "forbidden") {
              setIsConfigured(false);
            } else {
              setIsConfigured(true);
            }
          });
        }
        setIsConfigured(true);
      })
      .catch(() => setIsConfigured(true)); // Let Liveblocks handle other errors
  }, [roomId]);

  // Still probing
  if (isConfigured === null) {
    return (
      <div className="flex h-full w-full items-center justify-center bg-zinc-950 text-zinc-400">
        <div className="flex flex-col items-center gap-2">
          <div className="h-6 w-6 animate-spin rounded-full border-2 border-zinc-700 border-t-zinc-400" />
          <p className="text-sm">Connecting to workspace...</p>
        </div>
      </div>
    );
  }

  // Liveblocks is not configured - fallback to local flow simulation
  if (!isConfigured) {
    return <LocalFlow />;
  }

  return (
    <ErrorBoundary
      fallback={
        <div className="flex h-full w-full items-center justify-center bg-zinc-950 text-zinc-400">
          <div className="text-center space-y-2">
            <h3 className="text-lg font-medium text-zinc-200">Connection Error</h3>
            <p className="text-sm">Failed to connect to collaboration server.</p>
          </div>
        </div>
      }
    >
      <LiveblocksProvider
        authEndpoint={async (room) => {
          const response = await fetch("/api/liveblocks-auth", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ room }),
          });
          // Always parse JSON - on 403 our route returns the forbidden sentinel
          return response.json();
        }}
      >
        <RoomProvider id={roomId} initialPresence={{ cursor: null, isThinking: false }}>
          <ClientSideSuspense
            fallback={
              <div className="flex h-full w-full items-center justify-center bg-zinc-950 text-zinc-400">
                <div className="flex flex-col items-center gap-2">
                  <div className="h-6 w-6 animate-spin rounded-full border-2 border-zinc-700 border-t-zinc-400" />
                  <p className="text-sm">Connecting to workspace...</p>
                </div>
              </div>
            }
          >
            <CanvasWithErrorHandling />
          </ClientSideSuspense>
        </RoomProvider>
      </LiveblocksProvider>
    </ErrorBoundary>
  );
}
