import { prisma } from "@/lib/db";
import { NextResponse } from "next/server";

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { code, studentId } = body;

    if (!code) {
      return NextResponse.json(
        { error: "Classroom code is required" },
        { status: 400 }
      );
    }

    if (!studentId) {
      return NextResponse.json(
        { error: "Student ID is required" },
        { status: 400 }
      );
    }

    const classroom = await prisma.classroom.findUnique({
      where: { code },
      include: {
        quizzes: true,
      },
    });

    if (!classroom) {
      return NextResponse.json(
        { error: "Classroom not found with this code" },
        { status: 404 }
      );
    }

    const student = await prisma.student.update({
      where: { id: studentId },
      data: { classRoomId: classroom.id },
    });

    return NextResponse.json(
      { message: "Student successfully assigned to classroom", classroom },
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
