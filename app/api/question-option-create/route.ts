import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";

export async function POST(req: Request) {
  try {
    const { question, quizId, timer, options } = await req.json();

    if (!question || !quizId || !options?.length) {
      return NextResponse.json({ error: "Invalid input" }, { status: 400 });
    }

    const createdQuestion = await prisma.quizQuestion.create({
      data: {
        question,
        timer,
        quiz: {
          connect: {
            id: quizId,
          },
        },
        options: {
          create: options.map((opt: any) => ({
            text: opt.text,
            isCorrect: opt.isCorrect,
          })),
        },
      },
    });

    return NextResponse.json(createdQuestion, { status: 201 });
  } catch (error) {
    return NextResponse.json(
      { error: "Server error", details: error },
      { status: 500 }
    );
  }
}
