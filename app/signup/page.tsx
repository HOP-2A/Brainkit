"use client";
import { useRouter } from "next/navigation";
import { useUser, SignInButton, SignUpButton } from "@clerk/nextjs";

const SignUp = () => {
  const router = useRouter();

  return (
    <div className="flex flex-col items-center mt-24 gap-8">
      <div className="flex gap-4 mt-8">
        <SignUpButton>
          <button
            className="bg-[#4169E1] text-white rounded-3xl font-bold text-base sm:text-lg md:text-xl px-5 sm:px-6 md:px-8 py-2.5 sm:py-3 md:py-4
                     shadow-[0_4px_0_#27408B] hover:scale-105 hover:shadow-[0_6px_0_#27408B] active:translate-y-1 active:shadow-[0_2px_0_#27408B]
                     transition-all"
          >
            Sign Up
          </button>
        </SignUpButton>
      </div>
    </div>
  );
};

export default SignUp;
