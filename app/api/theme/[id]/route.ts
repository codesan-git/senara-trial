import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";

export async function GET(
  request: Request,
  { params }: { params: { id: string } }
) {
  const id = parseInt(params.id);
  const theme = await prisma?.theme?.findUnique({
    where: {
      id,
    },
  });

  if (!theme) {
    return new NextResponse("No theme with ID found", { status: 404 });
  }

  return NextResponse.json(theme);
}

export async function PATCH(
  request: Request,
  { params }: { params: { id: string } }
) {
    const id = parseInt(params.id);
    let json = await request.json();
    
    console.log("data id", id)
    
    const updated_theme = await prisma?.theme?.update({
      where: { id },
      data: json,
    });

  if (!updated_theme) {
    return new NextResponse("No theme with ID found", { status: 404 });
  }

  return NextResponse.json(updated_theme);
}

export async function DELETE(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const id = parseInt(params.id);
    await prisma?.theme?.delete({
      where: { id },
    });

    return new NextResponse(null, { status: 204 });
  } catch (error: any) {
    if (error.code === "P2025") {
      return new NextResponse("No theme with ID found", { status: 404 });
    }

    return new NextResponse(error.message, { status: 500 });
  }
}
