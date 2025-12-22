"use client";

import { useEffect, useState } from "react";
import { Input } from "@/components/ui/input";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { SignInButton, useUser } from "@clerk/nextjs";

export default function SignUpPage() {
  const [name, setName] = useState("");
  const [password, setPassword] = useState("");
  const [email, setEmail] = useState("");
  const [role, setRole] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [data, setData] = useState();
  const { user, isSignedIn } = useUser();
  const router = useRouter();

  const handleSubmit = async () => {
    setError(null);

    const res = await fetch("/api/signUp", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        email,
        name,
        password,
        type: role,
      }),
    });

    const data = await res.json();

    if (!res.ok) {
      setError(data.error || "Something went wrong");
    } else {
      router.push("/");
    }
  };

  useEffect(() => {
    if (isSignedIn) {
      router.push("/");
    }
  }, [isSignedIn]);

  return (
    <div>
      <header className="flex justify-between items-center mt-5 sm:mx-8">
        <div
          className="bg-[#8598FF] text-white sm:px-6 md:px-8 sm:py-3.5 rounded-xl text-2xl sm:text-3xl 
          md:text-4xl font-extrabold tracking-wider
          shadow-[0_6px_0_#27408B] text-center drop-shadow-lg"
        >
          BRAINKET
        </div>
        <div className="ml-auto pr-160">
          <SignInButton>
            <button
              className=" bg-gray-400 text-white rounded-xl font-bold text-base 
              px-5 sm:px-6 md:px-8 py-2.5 sm:py-3 md:py-4 shadow-[0_4px_0_#999999]
              hover:bg-gray-500 hover:scale-105 hover:shadow-[0_6px_0_#777777]
              active:translate-y-1 active:shadow-[0_2px_0_#555555] transition-all"
            >
              Log In
            </button>
          </SignInButton>
        </div>
      </header>
    </div>
  );
}
