import { prisma } from "@/lib/db";

export async function GET(req: Request) {
  const body = await req.json();

  const { teacherId } = body;

  const classrooms = await prisma.teacher.findMany({});
}
