import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";


export async function POST(request: Request) {
  try {
    const json = await request.json();

    const middleTheme = await prisma?.middleTheme?.createMany({
      data: json,
    });

    return new NextResponse(JSON.stringify(middleTheme), { 
     status: 201, 
     headers: { "Content-Type": "application/json" },
    });
  } catch (error: any) {
    if (error.code === "P2002") {
      return new NextResponse("User with email already exists", {
        status: 409,
      });
    }
    return new NextResponse(error.message, { status: 500 });
  }
}

export async function DELETE(
    request: Request,
    { params }: { params: { middleRooms_id: string } }
  ) {
    try {
      const roomsThemeId = parseInt(params.middleRooms_id);
      await prisma?.middleTheme?.deleteMany({
        where: { roomsThemeId },
      });
    // await prisma?.rooms?.delete({
    //     where: {id}
    // })
  
      return new NextResponse(null, { status: 204 });
    } catch (error: any) {
      if (error.code === "P2025") {
        return new NextResponse("No rooms with roomsId found", { status: 404 });
      }
  
      return new NextResponse(error.message, { status: 500 });
    }
  }