import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";

export async function GET(
  request: Request,
  { params }: { params: { name: string } }
) {
  const name = params.name;
  const theme = await prisma?.theme?.findFirst({
    where: {
      name,
    },
  });

  if (!theme) {
    return new NextResponse("No theme with ID found", { status: 404 });
  }

  return NextResponse.json(theme.id);
}