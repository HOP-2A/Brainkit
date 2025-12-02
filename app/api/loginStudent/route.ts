// import { prisma } from "@/lib/db";
// import { hash, compare } from "bcrypt";
// import bcrypt from "bcryptjs";
// import { NextResponse } from "next/server";

import { NextResponse } from "next/server";

// export async function POST(req: Request) {
//   try {
//     const body = await req.json();
//     const { email, password } = body;

//     if (!email || !password)
//       return NextResponse.json({ error: "buren boglooroi" }, { status: 401 });

//     const findUser = await prisma.student.findUnique({
//       where: { email: email },
//     });

//     if (findUser) {
//       const hashedPassword = findUser.password;
//       const isValid = await compare(password, hashedPassword);
//       if (isValid) {
//         return NextResponse.json(
//           { message: "login successfully" },
//           { status: 200 }
//         );
//       } else {
//         return NextResponse.json(
//           { message: "password is wrong!" },
//           { status: 401 }
//         );
//       }
//     } else {
//       return NextResponse.json({ message: "please sign up" }, { status: 401 });
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
