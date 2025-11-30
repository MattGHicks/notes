import { prisma } from "@/lib/prisma";
import { NextRequest, NextResponse } from "next/server";

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams;
  const search = searchParams.get("search");
  const folderId = searchParams.get("folderId");

  const notes = await prisma.note.findMany({
    where: {
      ...(search && {
        OR: [
          { title: { contains: search } },
          { content: { contains: search } },
        ],
      }),
      ...(folderId && { folderId }),
    },
    orderBy: { updatedAt: "desc" },
    include: { folder: true },
  });

  return NextResponse.json(notes);
}

export async function POST(request: NextRequest) {
  const body = await request.json();
  const { title, content, folderId } = body;

  const note = await prisma.note.create({
    data: {
      title: title || "Untitled",
      content: content || "",
      folderId: folderId || null,
    },
    include: { folder: true },
  });

  return NextResponse.json(note);
}
