import { prisma } from "@/lib/db";
import { NextResponse } from "next/server";

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { id, newTitle, newDescription, newCoverImg, className } = body;

    const updateData: {
      title?: string;
      description?: string;
      coverImg?: string;
      name?: string;
    } = {};

    if (newTitle) updateData.title = newTitle;
    if (newDescription) updateData.description = newDescription;
    if (newCoverImg) updateData.coverImg = newCoverImg;
    if (className) updateData.name = className;

    await prisma.classroom.update({
      where: { id },
      data: updateData,
    });

    return NextResponse.json({ message: "success", status: 200 });
  } catch (err) {
    console.log(err);
    return NextResponse.json({ message: err, status: 401 });
  }
}
