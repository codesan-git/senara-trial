import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";

export async function GET(request: Request) {
  const components = await prisma?.middleComponent?.findMany(
    {
    orderBy:{
        id:'desc'
    },
    select: {
        roomsComponentId: true
    },
    take:1
  }
  );
  return NextResponse.json(components);
}