import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";
export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { title, creatorId, classroomId, description, coverImg, code } = body;
    if (!title)
      return NextResponse.json({ error: "Title heregtei" }, { status: 401 });
    else {
      await prisma.quiz.create({
        data: {
          code,
          title,
          creatorId,
          classroomId,
          description,
          coverImg: coverImg ?? "",
        },
      });

      return NextResponse.json(
        { message: "successfully created quiz" },
        { status: 200 }
      );
    }
  } catch (error) {
    return NextResponse.json(
      { message: "aldaa garchlaa", error },
      { status: 404 }
    );
  }
}
export const GET = async (
  req: Request,
  context: { params: Promise<{ quizId: string }> }
) => {
  const { quizId } = await context.params;

  try {
    const Quiz = await prisma.quiz.findUnique({
      where: {
        id: quizId,
      },
      include: {
        questions: {
          include: { options: true },
        },
      },
    });

    return NextResponse.json(Quiz, { status: 200 });
  } catch (err) {
    return NextResponse.json(err, { status: 404 });
  }
};
