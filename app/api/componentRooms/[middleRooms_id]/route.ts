import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";

export async function GET(
  request: Request,
  { params }: { params: { middleRooms_id: string } }
) {
  const roomsComponentId = parseInt(params.middleRooms_id);
  const rooms = await prisma?.middleComponent?.findMany({
    where: {
      roomsComponentId,
    },
  });

  if (!rooms) {
    return new NextResponse("No rooms with roomsId found", { status: 404 });
  }

  return NextResponse.json(rooms);
}
