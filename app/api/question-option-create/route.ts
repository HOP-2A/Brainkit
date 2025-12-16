import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";
export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { question, quizId, text, isCorrect, questionId, timer } = body;
    if (!question || !text)
      return NextResponse.json(
        { error: "question cannot be empty and answers cannot be empty" },
        { status: 401 }
      );
    if (!quizId || !questionId)
      return NextResponse.json(
        { error: "Ymar quiztei , question holbootoigoo tavij ugnu uu" },
        { status: 401 }
      );
    else {
      await prisma.quizQuestion.create({
        data: {
          question,
          quizId,
          timer,
        },
      });

      await prisma.quizOption.create({
        data: {
          text,
          questionId,
          isCorrect,
        },
      });
      return NextResponse.json(
        { message: "successfully created question and options" },
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
