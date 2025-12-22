import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";

export async function POST(req: Request) {
  try {
    const { code } = await req.json();

    if (!code) {
      return NextResponse.json(
        { error: "Class code is required" },
        { status: 400 }
      );
    }

    const classroom = await prisma.classroom.findUnique({
      where: {
        code: code,
      },
      include: {
        quizzes: true,
      },
    });

    if (!classroom) {
      return NextResponse.json(
        { error: "Invalid class code" },
        { status: 404 }
      );
    }

    return NextResponse.json(classroom, { status: 200 });
  } catch (err) {
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}
