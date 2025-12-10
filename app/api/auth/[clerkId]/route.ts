import { prisma } from "@/lib/db";
import { NextResponse } from "next/server";

export const GET = async (
  req: Request,
  context: { params: { clerkId: string } }
) => {
  const { clerkId } = await context.params;

  try {
    const studentData = await prisma.student.findUnique({
      where: {
        clerkId,
      },
    });

    const teacherData = await prisma.teacher.findUnique({
      where: {
        clerkId,
      },
    });

    if (studentData) {
      return NextResponse.json(studentData, { status: 200 });
    }

    if (teacherData) {
      return NextResponse.json(teacherData, { status: 200 });
    }
  } catch (err) {
    return NextResponse.json({ message: err }, { status: 400 });
  }
};
