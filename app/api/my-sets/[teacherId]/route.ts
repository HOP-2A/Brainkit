import { prisma } from "@/lib/db";
import { NextResponse } from "next/server";

export const GET = async (
  req: Request,
  context: { params: { teacherId: string } }
) => {
  const { teacherId } = context.params;
  try {
    const teacher = await prisma.teacher.findFirst({
      where: {
        id: teacherId,
      },
    });

    if (!teacher) {
      return NextResponse.json(
        { message: "teacher id baihgui baina" },
        { status: 404 }
      );
    }

    const classrooms = await prisma.classroom.findMany({
      where: { teacherId },
    });

    return NextResponse.json(classrooms, { status: 200 });
  } catch (err) {
    return NextResponse.json(err, { status: 404 });
  }
};
