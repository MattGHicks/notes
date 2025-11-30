import { prisma } from "@/lib/prisma";
import { NextRequest, NextResponse } from "next/server";

export async function GET() {
  const folders = await prisma.folder.findMany({
    orderBy: { name: "asc" },
    include: { _count: { select: { notes: true } } },
  });

  return NextResponse.json(folders);
}

export async function POST(request: NextRequest) {
  const body = await request.json();
  const { name } = body;

  const folder = await prisma.folder.create({
    data: { name: name || "New Folder" },
    include: { _count: { select: { notes: true } } },
  });

  return NextResponse.json(folder);
}
