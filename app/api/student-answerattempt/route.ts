import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";
export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { attemptId, questionId, optionId } = body;
    if (!attemptId)
      return NextResponse.json({ error: "attemptId alga" }, { status: 401 });
    if (!questionId)
      return NextResponse.json({ error: "questionId alga" }, { status: 401 });
    if (!optionId)
      return NextResponse.json({ error: "optionId alga" }, { status: 401 });
    else {
      await prisma.studentAnswer.create({
        data: {
          attemptId,
          questionId,
          optionId,
        },
      });

      return NextResponse.json(
        { message: "successfully created studentAnswer" },
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
