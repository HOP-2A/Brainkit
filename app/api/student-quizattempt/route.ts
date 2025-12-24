import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";
export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { studentId, quizId, score } = body;
    if (!studentId)
      return NextResponse.json({ error: "studentId alga" }, { status: 401 });
    if (!quizId)
      return NextResponse.json({ error: "quizId alga" }, { status: 401 });
    else {
      await prisma.studentQuizAttempt.create({
        data: {
          studentId,
          quizId,
          score,
        },
      });

      return NextResponse.json(
        { message: "successfully created quizattempt" },
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
