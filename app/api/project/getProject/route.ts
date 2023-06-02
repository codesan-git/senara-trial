import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";

export async function GET(request: Request) {
  const projects = await prisma?.project?.findMany();
  console.log(projects)
  return NextResponse.json(projects);
}