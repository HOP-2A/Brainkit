import { prisma } from "@/lib/db";
import { NextResponse } from "next/server";

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { email } = body;

    if (!email) {
      return NextResponse.json({ error: "Email is required" }, { status: 400 });
    }

    const teacher = await prisma.teacher.findUnique({
      where: { email },
    });

    if (teacher) {
      return NextResponse.json({
        role: "teacher",
        data: teacher,
      });
    }

    const student = await prisma.student.findUnique({
      where: { email },
    });

    if (student) {
      return NextResponse.json({
        role: "student",
        data: student,
      });
    }

    return NextResponse.json(
      { role: "none", message: "User not found" },
      { status: 404 }
    );
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
