import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";

export async function GET(
  request: Request,
  { params }: { params: { middleRooms_id: string } }
) {
  const roomsId = parseInt(params.middleRooms_id);
  const rooms = await prisma?.middleTheme?.findMany({
    where: {
      roomsId,
    },
  });

  if (!rooms) {
    return new NextResponse("No rooms with roomsId found", { status: 404 });
  }

  return NextResponse.json(rooms);
}

export async function PATCH(
  request: Request,
  { params }: { params: { middleRooms_id: string } }
) {
  const roomsId = parseInt(params.middleRooms_id);
  let json = await request.json();

  const updated_rooms = await prisma?.middleTheme?.updateMany({
    where: { roomsId },
    data: json,
  });

  if (!updated_rooms) {
    return new NextResponse("No rooms with roomsId found", { status: 404 });
  }

  return NextResponse.json(updated_rooms);
}

export async function DELETE(
  request: Request,
  { params }: { params: { middleRooms_id: string } }
) {
  try {
    const roomsId = parseInt(params.middleRooms_id);
    await prisma?.middleTheme?.deleteMany({
      where: { roomsId },
    });

    return new NextResponse(null, { status: 204 });
  } catch (error: any) {
    if (error.code === "P2025") {
      return new NextResponse("No rooms with roomsId found", { status: 404 });
    }

    return new NextResponse(error.message, { status: 500 });
  }
}
