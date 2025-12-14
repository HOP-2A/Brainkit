import { prisma } from "@/lib/db";
import { NextResponse } from "next/server";

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { title, description, coverImg, teacherId, name, code } = body;

    if (!title || !teacherId || !name || !code) {
      return NextResponse.json(
        { message: "missing required fields" },
        { status: 400 }
      );
    }

    const createdClassroomSet = await prisma.classroom.create({
      data: {
        title,
        description: description ?? "",
        coverImg: coverImg ?? "",
        teacherId,
        name,
        code,
      },
    });

    return NextResponse.json({ message: createdClassroomSet }, { status: 200 });
  } catch (err) {
    return NextResponse.json({ message: err }, { status: 500 });
  }
}

export const GET = async (
  req: Request,
  context: { params: Promise<{ classroomId: string }> }
) => {
  const { classroomId } = await context.params;

  try {
    const classroom = await prisma.classroom.findUnique({
      where: {
        id: classroomId,
      },
      include: {
        quizzes: true,
      },
    });

    return NextResponse.json(classroom, { status: 200 });
  } catch (err) {
    return NextResponse.json(err, { status: 404 });
  }
};
