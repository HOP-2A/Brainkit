import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";

type Option = {
  id: string;
  text: string;
  isCorrect: boolean;
};
export async function POST(req: Request) {
  try {
    const { question, quizId, timer, options } = await req.json();

    if (!question || !quizId || !options?.length) {
      return NextResponse.json({ error: "Invalid input" }, { status: 400 });
    }

    const normalizedTexts = options.map((opt: Option) =>
      opt.text.trim().toLowerCase()
    );

    const hasDuplicate =
      new Set(normalizedTexts).size !== normalizedTexts.length;
    if (hasDuplicate) {
      return NextResponse.json(
        { error: "Duplicate option text is not allowed" },
        { status: 400 }
      );
    } else {
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
            create: options.map((opt: Option) => ({
              text: opt.text,
              isCorrect: opt.isCorrect,
            })),
          },
        },
      });

      return NextResponse.json(createdQuestion, { status: 201 });
    }
  } catch (error) {
    return NextResponse.json(
      { error: "Server error", details: error },
      { status: 500 }
    );
  }
}
