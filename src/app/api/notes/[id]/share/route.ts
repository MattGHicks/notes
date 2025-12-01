import { prisma } from "@/lib/prisma";
import { NextRequest, NextResponse } from "next/server";
import { randomBytes } from "crypto";

function generateShareToken(): string {
  return randomBytes(16).toString("base64url");
}

export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;

  const note = await prisma.note.findUnique({ where: { id } });
  if (!note) {
    return NextResponse.json({ error: "Note not found" }, { status: 404 });
  }

  // If already shared, return existing token
  if (note.shareToken) {
    return NextResponse.json({ shareToken: note.shareToken });
  }

  // Generate new share token
  const shareToken = generateShareToken();
  await prisma.note.update({
    where: { id },
    data: { shareToken },
  });

  return NextResponse.json({ shareToken });
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;

  const note = await prisma.note.findUnique({ where: { id } });
  if (!note) {
    return NextResponse.json({ error: "Note not found" }, { status: 404 });
  }

  await prisma.note.update({
    where: { id },
    data: { shareToken: null },
  });

  return NextResponse.json({ success: true });
}
