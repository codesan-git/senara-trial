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
    include: {
      rooms:{
        select:{
          id:true,
          name: true,
          description: true,
          image: true,
          imgName: true,
        }
      }
        }
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
  const id = parseInt(params.middleRooms_id);
  let json = await request.json();

  const updated_rooms = await prisma?.middleComponent?.updateMany({
    where: { id },
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
    const roomsComponentId = parseInt(params.middleRooms_id);
    await prisma?.middleComponent?.deleteMany({
      where: { roomsComponentId },
    });

    return new NextResponse(null, { status: 204 });
  } catch (error: any) {
    if (error.code === "P2025") {
      return new NextResponse("No rooms with roomsId found", { status: 404 });
    }

    return new NextResponse(error.message, { status: 500 });
  }
}
