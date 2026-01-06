import { prisma } from "@/lib/db";
import { NextResponse } from "next/server";

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { attemptId } = body;

    if (!attemptId) {
      return NextResponse.json({ message: "Missing attemptId", status: 400 });
    }

    // Find current attempt
    const attempt = await prisma.studentQuizAttempt.findUnique({
      where: { id: attemptId },
    });

    if (!attempt) {
      return NextResponse.json({ message: "Attempt not found", status: 404 });
    }

    const updatedAttempt = await prisma.studentQuizAttempt.update({
      where: { id: attemptId },
      data: { score: (attempt.score || 0) + 1 },
    });

    return NextResponse.json({
      message: "success",
      status: 200,
      score: updatedAttempt.score,
    });
  } catch (err) {
    console.error(err);
    return NextResponse.json({ message: "Error updating score", status: 500 });
  }
}
