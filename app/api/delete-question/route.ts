import { prisma } from "@/lib/db";
import { NextResponse } from "next/server";

export async function DELETE(req: Request) {
  const body = await req.json();
  const { questionId } = body;

  try {
    const deletedQuestion = await prisma.quizQuestion.delete({
      where: { id: questionId },
    });

    return NextResponse.json(deletedQuestion, { status: 200 });
  } catch (err) {
    return NextResponse.json(err), { status: 500 };
  }
}
