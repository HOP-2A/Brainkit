import { prisma } from "@/lib/db";
import { NextResponse } from "next/server";
import { clerkClient } from "@clerk/nextjs/server";

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { email, type, name } = body;

    if (!email || !name)
      return NextResponse.json({ error: "buren boglooroi" }, { status: 401 });

    const findStudent = await prisma.student.findUnique({ where: { email } });
    const findTeacher = await prisma.teacher.findUnique({ where: { email } });

    if (findStudent || findTeacher) {
      return NextResponse.json(
        { error: "ene email ali hezeenii burtgeltei bn" },
        { status: 400 }
      );
    }

    const clerk = await clerkClient();
    const clerkUser = await clerk.users.createUser({
      emailAddress: [email],
      skipPasswordChecks: true,
      skipPasswordRequirement: true,
      publicMetadata: {
        role: type,
      },
    });

    if (type === "TEACHER") {
      await prisma.teacher.create({
        data: { email, name, clerkId: clerkUser.id },
      });
      return NextResponse.json(
        { message: "successfully registered as a teacher" },
        { status: 200 }
      );
    }

    if (type === "STUDENT") {
      await prisma.student.create({
        data: { email, name, clerkId: clerkUser.id },
      });
      return NextResponse.json(
        { message: "successfully registered as a student" },
        { status: 200 }
      );
    }
  } catch (error) {
    return NextResponse.json(
      { message: "aldaa garlaa", error },
      { status: 404 }
    );
  }
}

export const GET = () => {
  return NextResponse.json("gg");
};
