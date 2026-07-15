import { NextResponse } from "next/server";
import { currentUser } from "@clerk/nextjs/server";
import { getCurrentProjectIdentity, getProjectWithAccess } from "@/lib/project-access";
import { liveblocks, getUserColor } from "@/lib/liveblocks";
import { isDatabaseConfigured } from "@/lib/prisma";

export async function POST(req: Request) {
  try {
    // If no real Liveblocks key is configured, fail gracefully
    const secretKey = process.env.LIVEBLOCKS_SECRET_KEY;
    if (!secretKey || secretKey === "sk_dummy_secret_for_build" || !secretKey.startsWith("sk_")) {
      return new NextResponse(
        JSON.stringify({ error: "forbidden", reason: "Liveblocks is not configured. Set LIVEBLOCKS_SECRET_KEY in your environment." }),
        { status: 403, headers: { "Content-Type": "application/json" } }
      );
    }

    if (!isDatabaseConfigured()) {
      return new NextResponse("Database is not configured", { status: 503 });
    }

    const identity = await getCurrentProjectIdentity();
    if (!identity) {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    const body = await req.json().catch(() => null);
    const roomId = body?.room;

    if (!roomId) {
      return new NextResponse("Room ID is required", { status: 400 });
    }

    // Verify project access check
    const project = await getProjectWithAccess(roomId, identity);
    if (!project) {
      return new NextResponse("Forbidden", { status: 403 });
    }

    // Ensure the Liveblocks room exists
    try {
      await liveblocks.getOrCreateRoom(roomId, {
        defaultAccesses: [], // Private by default
      });
    } catch (error) {
      // Let it log and continue, as the room will try to be managed on session authorize/creation
      console.error("[LIVEBLOCKS_ROOM_GET_OR_CREATE]", error);
    }

    // Fetch user info from Clerk to enrich the session
    const user = await currentUser();
    const displayName = user ? (user.fullName ?? user.username ?? "") : "";
    const imageUrl = user?.imageUrl ?? "";
    const userColor = getUserColor(identity.userId);

    // Prepare session for Liveblocks Access Token auth
    const session = liveblocks.prepareSession(identity.userId, {
      userInfo: {
        name: displayName,
        avatar: imageUrl,
        color: userColor,
      },
    });

    // Grant access to the room
    session.allow(roomId, session.FULL_ACCESS);

    const { status, body: responseBody } = await session.authorize();
    
    return new Response(responseBody, {
      status,
      headers: {
        "Content-Type": "application/json",
      },
    });
  } catch (error) {
    console.error("[LIVEBLOCKS_AUTH_ERROR]", error);
    return new NextResponse("Internal Error", { status: 500 });
  }
}
