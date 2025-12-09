"use client";
import { useRouter } from "next/navigation";
import { useUser, SignInButton } from "@clerk/nextjs";
import { useEffect } from "react";

const Page = () => {
  const router = useRouter();
  const { isSignedIn } = useUser();

  useEffect(() => {
    if (isSignedIn) {
      router.push("/home-page");
    }
  }, [isSignedIn]);

  return (
    <div>
      <header className="flex justify-between items-center mt-8 sm:mx-8 md:mx-16 lg:mx-20">
        <div
          className="bg-[#8598FF] text-white px-4 sm:px-6 md:px-8 py-3 sm:py-3.5 md:py-4 rounded-xl text-2xl sm:text-3xl md:text-5xl font-extrabold tracking-wider
                shadow-[0_6px_0_#27408B] text-center drop-shadow-lg"
        >
          BRAINKET
        </div>

        <div className="flex gap-2 sm:gap-3 md:gap-4 items-center"></div>
      </header>

      <div className="flex flex-col items-center mt-24 gap-8">
        <div className="text-2xl sm:text-3xl mt-40 md:text-4xl font-bold text-center">
          Fun, free, educational games for everyone!
        </div>

        <div className="flex gap-4 mt-8">
          <SignInButton>
            <button
              className="bg-[#4169E1] text-white rounded-3xl font-bold text-base sm:text-lg md:text-xl px-5 sm:px-6 md:px-8 py-2.5 sm:py-3 md:py-4
                     shadow-[0_4px_0_#27408B] hover:scale-105 hover:shadow-[0_6px_0_#27408B] active:translate-y-1 active:shadow-[0_2px_0_#27408B]
                     transition-all"
            >
              Log In
            </button>
          </SignInButton>

          <button
            onClick={() => router.push("/signup")}
            className="bg-[#4169E1] text-white rounded-3xl font-bold text-base sm:text-lg md:text-xl px-5 sm:px-6 md:px-8 py-2.5 sm:py-3 md:py-4
                     shadow-[0_4px_0_#27408B] hover:scale-105 hover:shadow-[0_6px_0_#27408B] active:translate-y-1 active:shadow-[0_2px_0_#27408B]
                     transition-all"
          >
            Sign Up
          </button>
        </div>
      </div>
    </div>
  );
};

export default Page;
