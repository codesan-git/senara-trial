import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";

export async function GET(
  request: Request,
  { params }: { params: { id: string } }
) {
  const id = parseInt(params.id);
  const project = await prisma?.project?.findUnique({
    where: {
      id,
    },
  });

  if (!project) {
    return new NextResponse("No project with ID found", { status: 404 });
  }

  return NextResponse.json(project);
}

export async function PATCH(
  request: Request,
  { params }: { params: { id: string } }
) {
    const id = parseInt(params.id);
    let json = await request.json();
    
    console.log("data id", id)
    
    const updated_project = await prisma?.project?.update({
      where: { id },
      data: json,
    });

  if (!updated_project) {
    return new NextResponse("No project with ID found", { status: 404 });
  }

  return NextResponse.json(updated_project);
}

export async function DELETE(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const id = parseInt(params.id);
    await prisma?.project?.delete({
      where: { id },
    });

    return new NextResponse(null, { status: 204 });
  } catch (error: any) {
    if (error.code === "P2025") {
      return new NextResponse("No project with ID found", { status: 404 });
    }

    return new NextResponse(error.message, { status: 500 });
  }
}
