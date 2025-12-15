import { prisma } from "@/lib/db";
import { NextResponse } from "next/server";

export async function DELETE(req: Request) {
  try {
    const { id } = await req.json();

    if (!id) {
      return NextResponse.json(
        { message: "ID bhgui bn", status: 400 },
        { status: 400 }
      );
    }

    const exists = await prisma.quiz.findFirst({
      where: { id },
    });

    if (!exists) {
      return NextResponse.json(
        { message: "Class bhgui bn", status: 404 },
        { status: 404 }
      );
    }

    await prisma.quiz.delete({
      where: { id },
    });

    return NextResponse.json(
      { message: "Delete amjilttai", status: 200 },
      { status: 200 }
    );
  } catch (err) {
    console.log(err);
    return NextResponse.json(
      { message: "Server error", status: 500 },
      { status: 500 }
    );
  }
}
