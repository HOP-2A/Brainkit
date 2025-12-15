import { prisma } from "@/lib/db";
import { NextResponse } from "next/server";

export const GET = async (
  req: Request,
  context: { params: { searchParam: string } }
) => {
  const { searchParam } = await context.params;
  try {
    const searchClassroom = await prisma.classroom.findMany({
      where: { name: { contains: searchParam, mode: "insensitive" } },
    });

    return NextResponse.json(searchClassroom, { status: 200 });
  } catch (err) {
    return NextResponse.json(err, { status: 500 });
  }
};
