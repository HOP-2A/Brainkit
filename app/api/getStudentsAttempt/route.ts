import { prisma } from "@/lib/db";
import { NextResponse } from "next/server";

export async function POST(req: Request) {
  try {
    const { teacherId } = await req.json();

    if (!teacherId) {
      return NextResponse.json(
        { error: "TeacherId is required" },
        { status: 400 }
      );
    }

    const quizzes = await prisma.quiz.findMany({
      where: { creatorId: teacherId },
      orderBy: { createdAt: "desc" },
    });

    const quizzesWithLatestAttempts = await Promise.all(
      quizzes.map(async (quiz) => {
        const latestAttempts = await prisma.studentQuizAttempt.findMany({
          where: { quizId: quiz.id },
          distinct: ["studentId"],
          orderBy: { createdAt: "desc" },
          include: { student: true },
        });

        return {
          ...quiz,
          StudentQuizAttempt: latestAttempts,
        };
      })
    );

    return NextResponse.json(quizzesWithLatestAttempts);
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { error: "Something went wrong" },
      { status: 500 }
    );
  }
}
