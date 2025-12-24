"use client";

import Link from "next/link";

export const SignUp = () => {
  return (
    <Link href="sign-up">
      <button
        className="bg-[#4169E1] text-white rounded-2xl font-semibold 
          text-xl h-12 px-6 cursor-pointer
          shadow-[0_4px_0_#27408B] transition-all
          hover:-translate-y-1 hover:shadow-[0_6px_0_#27408B]
          active:translate-y-1 active:shadow-[0_1px_0_#27408B]"
      >
        Sign Up
      </button>
    </Link>
  );
};
