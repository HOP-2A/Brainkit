import { prisma } from "@/lib/db";
import { NextResponse } from "next/server";

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { title, description, coverImg, teacherId, name, code } = body;

    const createdQuizSet = await prisma.classroom.create({
      data: {
        title,
        description,
        coverImg,
        teacherId,
        name,
        code,
      },
    });

    return NextResponse.json(createdQuizSet, { status: 200 });
  } catch (err) {
    console.log(err);
    return NextResponse.json({ message: err }, { status: 401 });
  }
}
