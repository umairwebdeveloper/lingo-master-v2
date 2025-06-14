import db from "@/db/drizzle";
import { videoChapters } from "@/db/schema";
import { isAdmin } from "@/lib/admin";
import { NextResponse } from "next/server";

export const GET = async () => {
  if (!isAdmin()) {
    return new NextResponse("Unauthorized", { status: 401 });
  }
  const data = await db.query.videoChapters.findMany();

  return NextResponse.json(data);
};
export const POST = async (req: Request) => {
  if (!isAdmin()) {
    return new NextResponse("Unauthorized", { status: 401 });
  }

  const body = await req.json();

  const data = await db
      .insert(videoChapters)
      .values({
          ...body,
      })
      .returning();

  return NextResponse.json(data[0]);
};
