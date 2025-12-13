import { prisma } from "@/lib/db";
import { NextResponse } from "next/server";

export const GET = async (
  req: Request,
  context: { params: { teacherId: string } }
) => {
  const { teacherId } = await context.params;

  if (!teacherId) {
    return;
  }
  try {
    const teacher = await prisma.teacher.findUnique({
      where: {
        id: teacherId,
      },

      include: { createdClasses: true },
    });

    return NextResponse.json({ message: teacher }, { status: 200 });
  } catch (err) {
    return NextResponse.json({ message: err }, { status: 404 });
  }
};
