import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";

export async function GET(
  request: Request,
  { params }: { params: { id: string } }
) {
  const id = parseInt(params.id);
  const house = await prisma?.house?.findUnique({
    where: {
      id,
    },
  });

  if (!house) {
    return new NextResponse("No house with ID found", { status: 404 });
  }

  return NextResponse.json(house);
}

export async function PATCH(
  request: Request,
  { params }: { params: { id: string } }
) {
  const id = parseInt(params.id);
  let json = await request.json();

  const updated_house = await prisma?.house?.update({
    where: { id },
    data: json,
  });

  if (!updated_house) {
    return new NextResponse("No house with ID found", { status: 404 });
  }

  return NextResponse.json(updated_house);
}

export async function DELETE(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const id = parseInt(params.id);
    await prisma?.house?.delete({
      where: { id },
    });

    return new NextResponse(null, { status: 204 });
  } catch (error: any) {
    if (error.code === "P2025") {
      return new NextResponse("No house with ID found", { status: 404 });
    }

    return new NextResponse(error.message, { status: 500 });
  }
}
