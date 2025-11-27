import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";
export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { text, isCorrect, questionId } = body;
    if (!text)
      return NextResponse.json(
        { error: "answers cannot be empty" },
        { status: 401 }
      );
    if (!questionId)
      return NextResponse.json(
        { error: "Ymar question holbootoigoo tavij ugnu uu" },
        { status: 401 }
      );
    else {
      await prisma.quizOption.create({
        data: {
          text,
          questionId,
          isCorrect,
        },
      });
      return NextResponse.json(
        { message: "successfully created option" },
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
