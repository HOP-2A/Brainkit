import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";
export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { title, creatorId, classroomId, description, coverImg } = body;
    if (!title)
      return NextResponse.json({ error: "Title heregtei" }, { status: 401 });
    else {
      await prisma.quiz.create({
        data: {
          title,
          creatorId,
          classroomId,
          description,
          coverImg: coverImg ?? "",
        },
      });

      return NextResponse.json(
        { message: "successfully created quiz" },
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
