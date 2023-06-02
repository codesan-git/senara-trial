import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";

export async function GET(
  request: Request,
  { params }: { params: { id: string } }
) {
  const id = parseInt(params.id);
  const existingProject = await prisma?.existingProject?.findUnique({
    where: {
      id,
    },
  });

  if (!existingProject) {
    return new NextResponse("No existingProject with ID found", { status: 404 });
  }

  return NextResponse.json(existingProject);
}

export async function PATCH(
  request: Request,
  { params }: { params: { id: string } }
) {
  const id = parseInt(params.id);
  let json = await request.json();

  const updated_existingProject = await prisma?.existingProject?.update({
    where: { id },
    data: json,
  });

  if (!updated_existingProject) {
    return new NextResponse("No existingProject with ID found", { status: 404 });
  }

  return NextResponse.json(updated_existingProject);
}

export async function DELETE(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const id = parseInt(params.id);
    await prisma?.existingProject?.delete({
      where: { id },
    });

    return new NextResponse(null, { status: 204 });
  } catch (error: any) {
    if (error.code === "P2025") {
      return new NextResponse("No existingProject with ID found", { status: 404 });
    }

    return new NextResponse(error.message, { status: 500 });
  }
}
