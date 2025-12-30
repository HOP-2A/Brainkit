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
        router.push("/students/join-class-bycode");
      }
    };

    roleCheck();
  }, [isLoaded, isSignedIn, clerkUser, router]);

  return (
    <div>
      <header className="flex justify-between items-center mt-8 sm:mx-8 md:mx-16 lg:mx-20">
        <div className="bg-[#3a25d9] text-white px-6 py-4 rounded-xl text-4xl font-extrabold shadow-[0_8px_0_#1f1a99]">
          BRAINKET
        </div>

        <SignInButton>
          <button className="border-2 border-gray-300 rounded-lg px-8 py-3 text-xl font-semibold text-gray-600">
            Log in
          </button>
        </SignInButton>
      </header>

      <div className="flex flex-col items-center mt-32 gap-12">
        <div className="text-4xl font-bold text-center">
          Fun, free, educational games for everyone!
        </div>

        <Button
          onClick={() => router.push("/sign-up")}
          className="bg-[#3a25d9] text-white text-lg font-bold px-16 py-5 rounded-lg shadow-[0_8px_0_#1f1a99]"
        >
          Sign Up
        </Button>
      </div>
    </div>
  );
};

export default Page;
