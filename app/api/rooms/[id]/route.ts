import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";

export async function GET(
  request: Request,
  { params }: { params: { id: string } }
) {
  const id = parseInt(params.id);
  const roomsThemeId = parseInt(params.id);
  const roomsComponentId = parseInt(params.id);

  const themeRooms = await prisma?.middleTheme?.findMany({
    where: {
      roomsThemeId,
    },
  })

  const componentRooms = await prisma?.middleComponent?.findMany({
    where: {
      roomsComponentId,
    },
  })
  
  const rooms = await prisma?.rooms?.findMany({
    where: {
      id,
    },
    include:{
      middleTheme: true,
      middleComponent: true
    }
  });
  const sapi = rooms.map((agung)=>({
    ...agung,
    middleTheme: themeRooms.map((ageng)=>({
      ...ageng,
    })),
    middleComponent: componentRooms.map((anom)=>({
      ...anom
    }))
  }))
  
  if (!rooms) {
    return new NextResponse("No rooms with ID found", { status: 404 });
  }

  return NextResponse.json(sapi);
}


export async function PATCH(
  request: Request,
  { params }: { params: { id: string } }
) {
  const id = parseInt(params.id);
  let json = await request.json();

  const updated_rooms = await prisma?.rooms?.update({
    where: { id },
    data: json,
  });

  if (!updated_rooms) {
    return new NextResponse("No rooms with ID found", { status: 404 });
  }

  return NextResponse.json(updated_rooms);
}

export async function DELETE(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const id = parseInt(params.id);
    await prisma?.rooms?.delete({
      where: { id },
    });

    return new NextResponse(null, { status: 204 });
  } catch (error: any) {
    if (error.code === "P2025") {
      return new NextResponse("No rooms with ID found", { status: 404 });
    }

    return new NextResponse(error.message, { status: 500 });
  }
}
