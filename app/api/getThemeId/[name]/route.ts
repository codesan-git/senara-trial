import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";

export async function GET(
  request: Request,
  { params }: { params: { value: string } }
) {
  const value = params.value;
  const theme = await prisma?.theme?.findFirst({
    where: {
      value,
    },
  });

  if (!theme) {
    return new NextResponse("No theme with ID found", { status: 404 });
  }

  return NextResponse.json(theme.id);
}