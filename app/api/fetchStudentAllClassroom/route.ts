import { prisma } from "@/lib/db";
import { NextResponse } from "next/server";

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { studentId } = body;

    if (!studentId) {
      return NextResponse.json(
        { error: "studentId is required" },
        { status: 400 }
      );
    }

    const student = await prisma.student.findUnique({
      where: { id: studentId },
      include: {
        classRoom: true,
      },
    });

    if (!student || !student.classRoom) {
      return NextResponse.json(
        { error: "Student is not in any classroom" },
        { status: 404 }
      );
    }

    return NextResponse.json(student.classRoom, { status: 200 });
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { error: "Failed to fetch classroom" },
      { status: 500 }
    );
  }
}
