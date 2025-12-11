import { prisma } from "@/lib/db";
import { NextResponse } from "next/server";

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { title, description, coverImg, teacherId, name, code } = body;

    if (!title || !teacherId || !name || !code) {
      return NextResponse.json(
        { message: "missing required fields" },
        { status: 400 }
      );
    }

    const createdClassroomSet = await prisma.classroom.create({
      data: {
        title,
        description: description ?? "",
        coverImg: coverImg ?? "",
        teacherId,
        name,
        code,
      },
    });

    return NextResponse.json({ message: createdClassroomSet }, { status: 200 });
  } catch (err) {
    console.log(err);
    return NextResponse.json({ message: err }, { status: 500 });
  }
}
