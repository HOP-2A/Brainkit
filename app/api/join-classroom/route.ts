import { prisma } from "@/lib/db";
import { NextResponse } from "next/server";

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { classroomId, studentId } = body;

    if (!classroomId) {
      return NextResponse.json(
        { error: "classroomId is required" },
        { status: 400 }
      );
    }

    if (!studentId) {
      return NextResponse.json(
        { error: "studentId is required" },
        { status: 400 }
      );
    }

    const student = await prisma.student.update({
      where: { id: studentId },
      data: { classRoomId: classroomId },
    });

    return NextResponse.json(
      { message: "Student successfully assigned to classroom", student },
      { status: 200 }
    );
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { error: "Something went wrong" },
      { status: 500 }
    );
  }
}
