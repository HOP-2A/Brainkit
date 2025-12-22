import { prisma } from "@/lib/db";
import { NextResponse } from "next/server";

export async function DELETE(req: Request) {
  const body = await req.json();

  try {
    const { quizId } = body;

    const deleteQuestions = await prisma.quizQuestion.deleteMany({
      where: { quizId },
    });

    return NextResponse.json({ status: 200 });
  } catch (err) {
    return NextResponse.json(err, { status: 500 });
  }
}
