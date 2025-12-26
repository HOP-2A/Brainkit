import { prisma } from "@/lib/db";
import { NextResponse } from "next/server";

export const GET = async (
  req: Request,
  context: { params: { attemptId: string } }
) => {
  const { attemptId } = await context.params;
  try {
    const attempt = await prisma.studentQuizAttempt.findUnique({
      where: { id: attemptId },
    });

    return NextResponse.json(attempt, { status: 200 });
  } catch (err) {
    return NextResponse.json({ error: err }, { status: 500 });
  }
};
