import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";

export async function GET(
  request: Request,
  { params }: { params: { id: string } }
) {
  const id = parseInt(params.id);
  const component = await prisma?.component?.findUnique({
    where: {
      id,
    },
  });

  if (!component) {
    return new NextResponse("No component with ID found", { status: 404 });
  }

  return NextResponse.json(component);
}

export async function PATCH(
  request: Request,
  { params }: { params: { id: string } }
) {
    const id = parseInt(params.id);
    let json = await request.json();
    
    console.log("data id", id)
    
    const updated_component = await prisma?.component?.update({
      where: { id },
      data: json,
    });

  if (!updated_component) {
    return new NextResponse("No component with ID found", { status: 404 });
  }

  return NextResponse.json(updated_component);
}

export async function DELETE(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const id = parseInt(params.id);
    await prisma?.component?.delete({
      where: { id },
    });

    return new NextResponse(null, { status: 204 });
  } catch (error: any) {
    if (error.code === "P2025") {
      return new NextResponse("No component with ID found", { status: 404 });
    }

    return new NextResponse(error.message, { status: 500 });
  }
}
