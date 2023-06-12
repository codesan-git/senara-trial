import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";

export async function GET(
  request: Request,
  { params }: { params: { id: string } }
) {
  const id = parseInt(params.id);
  const rooms = await prisma?.middleComponent?.findMany({
    where: {
      id,
    },
  });

  if (!rooms) {
    return new NextResponse("No rooms with roomsId found", { status: 404 });
  }

  return NextResponse.json(rooms);
}

export async function PATCH(
    request: Request,
    { params }: { params: { id: string } }
  ) {
    const id = parseInt(params.id);
    let json = await request.json();
  
    const updated_rooms = await prisma?.middleComponent?.update({
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
    { params }: { params: { id: string } }
  ) {
    try {
      const id = parseInt(params.id);
      await prisma?.middleComponent?.deleteMany({
        where: { id },
      });
  
      return new NextResponse(null, { status: 204 });
    } catch (error: any) {
      if (error.code === "P2025") {
        return new NextResponse("No rooms with roomsId found", { status: 404 });
      }
  
      return new NextResponse(error.message, { status: 500 });
    }
  }