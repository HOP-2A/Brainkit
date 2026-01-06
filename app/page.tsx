"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { SignInButton, useUser } from "@clerk/nextjs";
import { Button } from "@/components/ui/button";

const Page = () => {
  const router = useRouter();
  const { user: clerkUser, isSignedIn, isLoaded } = useUser();

  useEffect(() => {
    if (!isLoaded || !isSignedIn) return;

    const roleCheck = async () => {
      const email = clerkUser?.emailAddresses[0]?.emailAddress;
      if (!email) return;

      const res = await fetch("/api/role-check", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email }),
      });

      if (!res.ok) return;

      const data = await res.json();

      if (data.role === "teacher") {
        router.push("/teacher/my-sets");
      } else if (data.role === "student") {
        router.push("/students/classroom");
      }
    };

    roleCheck();
  }, [isLoaded, isSignedIn, clerkUser, router]);

  return (
    <div>
      <header className="flex justify-between items-center mt-8 sm:mx-8 md:mx-16 lg:mx-20">
        <div
          className="bg-[#3a25d9] text-white px-4 sm:px-6 md:px-8 py-3 sm:py-3.5 md:py-4
             rounded-xl text-2xl sm:text-3xl md:text-5xl font-extrabold tracking-wider
             shadow-[0_8px_0_#1f1a99]
             text-center"
        >
          BRAINKET
        </div>

        <div className="ml-auto">
          <SignInButton>
            <button
              className="border-2 border-gray-300 rounded-lg px-8 py-3 text-xl font-semibold text-gray-600
             hover:bg-gray-100 shadow-[0_4px_0_rgba(156,163,175,1)] transition-all duration-200 ease-out
             hover:brightness-110 hover:-translate-y-1"
            >
              Log In
            </button>
          </SignInButton>
        </div>
      </header>

      <div className="flex flex-col items-center mt-35 gap-12">
        <div className="flex items-center justify-center gap-25">
          <img
            src="/school-college.gif"
            alt="left image"
            className="w-[500px] h-[500px]"
          />

          <div className="flex flex-col items-center gap-6 max-w-lg">
            <div className="text-2xl sm:text-3xl md:text-4xl font-bold text-center">
              Fun, free, educational games for everyone!
            </div>

            <Button
              onClick={() => router.push("/sign-up")}
              className="
          bg-[#3a25d9] text-white text-lg font-bold
          py-5 px-25 rounded-lg
          shadow-[0_8px_0_#1f1a99]
          transition-all duration-200 ease-out
          hover:bg-[#2c1fbf] hover:-translate-y-1
          hover:shadow-[0_12px_0_#1f1a99]
        "
            >
              Sign Up
            </Button>
          </div>

          <img
            src="/school-book.gif"
            alt="right image"
            className="w-[500px] h-[500px]"
          />
        </div>
      </div>
    </div>
  );
};

export default Page;
