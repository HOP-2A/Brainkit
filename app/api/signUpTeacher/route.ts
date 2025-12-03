// import { prisma } from "@/lib/db";
// import { hash } from "bcrypt";
import { NextResponse } from "next/server";

// export async function POST(req: Request) {
//   try {
//     const body = await req.json();
//     const saltRound = 10;
//     const { email, password, name } = body;
//     const hashedPassword = await hash(password, saltRound);
//     console.log(email, "asjdoiasodjpoajsdojpaosdpaosjop");
//     if (!email || !password || !name)
//       return NextResponse.json({ error: "buren boglooroi" }, { status: 401 });

//     const findUser = await prisma.teacher.findUnique({
//       where: { email: email },
//     });

//     if (findUser) {
//       return NextResponse.json({ error: "already sign in" }, { status: 404 });
//     } else {
//       await prisma.teacher.create({
//         data: {
//           email,
//           password: hashedPassword,
//           name,
//         },
//       });

//       return NextResponse.json(
//         { message: "successfully registered" },
//         { status: 200 }
//       );
//     }
//   } catch (error) {
//     return NextResponse.json(
//       { message: "aldaa garlaa", error },
//       { status: 404 }
//     );
//   }
// }

export const GET = () => {
  return NextResponse.json("gg");
};
