import db from "@/db/drizzle";
import { videos } from "@/db/schema";
import { isAdmin } from "@/lib/admin";
import { eq } from "drizzle-orm";
import { NextResponse } from "next/server";

export const GET = async (req: Request, { params }: { params: { videoId: number } }) => {
  if (!isAdmin()) {
    return new NextResponse("Unauthorized", { status: 401 });
  }
  const data = await db.query.videos.findFirst({
    where: eq(videos.id, params.videoId),
  });

  return NextResponse.json(data);
};

export const PUT = async (req: Request, { params }: { params: { videoId: number } }) => {
  if (!isAdmin()) {
    return new NextResponse("Unauthorized", { status: 401 });
  }

  const body = await req.json();
  const data = await db
    .update(videos)
    .set({
      ...body,
    })
    .where(eq(videos.id, params.videoId))
    .returning();

  return NextResponse.json("data[0]");
};

export const DELETE = async (req: Request, { params }: { params: { videoId: number } }) => {
  if (!isAdmin()) {
    return new NextResponse("Unauthorized", { status: 401 });
  }
  const data = await db.delete(videos).where(eq(videos.id, params.videoId)).returning();

  return NextResponse.json(data[0]);
};
