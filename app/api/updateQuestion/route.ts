import { prisma } from "@/lib/db";
import { NextResponse } from "next/server";

type Option = {
  id: string;
  text: string;
  isCorrect: boolean;
};

export async function PUT(req: Request) {
  try {
    const body = await req.json();
    const { editQuestionId, newQuestion, newTimer, newOptions } = body;

    if (!editQuestionId) {
      throw new Error("edit question Id baihgui baina!");
    }

    const findQuestion = await prisma.quizQuestion.findUnique({
      where: { id: editQuestionId },
    });

    if (findQuestion) {
      const updatedQuestion = await prisma.quizQuestion.update({
        where: { id: editQuestionId },
        data: {
          question: newQuestion,
          timer: newTimer,
          options: {
            deleteMany: {},
            create: newOptions.map((opt: Option) => ({
              text: opt.text,
              isCorrect: opt.isCorrect,
            })),
          },
        },
        include: {
          options: true,
        },
      });

      return NextResponse.json(updatedQuestion, { status: 200 });
    }
  } catch (err) {
    return NextResponse.json({ error: err }, { status: 500 });
  }
}
