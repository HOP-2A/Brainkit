import { prisma } from "@/lib/db";
import { NextResponse } from "next/server";

export async function DELETE(req: Request) {
  const body = await req.json();

  const { id } = body;
  try {
    await prisma.quiz.deleteMany({
      where: {
        classroomId: id,
      },
    });

    const deletedClassroom = await prisma.classroom.delete({
      where: { id },
    });

    return NextResponse.json(deletedClassroom, { status: 200 });
  } catch (err) {
    return NextResponse.json(err, { status: 500 });
  }
}
