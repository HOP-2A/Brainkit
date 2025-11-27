import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";
export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { question, quizId } = body;
    if (!question)
      return NextResponse.json(
        { error: "question cannot be empty" },
        { status: 401 }
      );
    if (!quizId)
      return NextResponse.json(
        { error: "Ymar quiztei holbootoigoo tavij ugnu uu" },
        { status: 401 }
      );
    else {
      await prisma.quizQuestion.create({
        data: {
          question,
          quizId,
        },
      });
      return NextResponse.json(
        { message: "successfully created question" },
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
