import { prisma } from "@/lib/prisma";
import { NextRequest, NextResponse } from "next/server";

export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  const body = await request.json();
  const { name } = body;

  const folder = await prisma.folder.update({
    where: { id },
    data: { name },
    include: { _count: { select: { notes: true } } },
  });

  return NextResponse.json(folder);
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  await prisma.folder.delete({ where: { id } });
  return NextResponse.json({ success: true });
}
