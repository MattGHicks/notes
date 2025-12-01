import { prisma } from "@/lib/prisma";
import { NextRequest, NextResponse } from "next/server";

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ token: string }> }
) {
  const { token } = await params;

  const note = await prisma.note.findUnique({
    where: { shareToken: token },
    select: {
      id: true,
      title: true,
      content: true,
      createdAt: true,
      updatedAt: true,
    },
  });

  if (!note) {
    return NextResponse.json({ error: "Shared note not found" }, { status: 404 });
  }

  return NextResponse.json(note);
}
