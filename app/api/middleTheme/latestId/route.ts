import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";

export async function GET(request: Request) {
  const themes = await prisma?.middleTheme?.findMany(
    {
    orderBy:{
        id:'desc'
    },
    select: {
        roomsThemeId: true
    },
    take:1
  }
  );
  return NextResponse.json(themes);
}