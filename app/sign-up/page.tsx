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
    <div className="min-h-screen flex">
      <div className="w-1/2 bg-white flex flex-col">
        <header className="flex justify-between items-center px-8 py-6">
          <div className="bg-[#3a25d9] text-white px-6 py-3 rounded-xl text-3xl font-extrabold shadow-[0_8px_0_#1f1a99]">
            BRAINKET
          </div>

          <SignInButton>
            <button
              className="border-2 border-gray-300 rounded-lg px-5 py-2 font-semibold text-gray-600
              hover:bg-gray-100 shadow-[0_4px_0_rgba(156,163,175,1)] transition-all duration-200 ease-out
              hover:brightness-110 hover:-translate-y-1"
            >
              Log In
            </button>
          </SignInButton>
        </header>

        <div className="flex-1 flex items-center justify-center">
          <div className="w-full max-w-sm space-y-4 mb-28">
            <h1 className="text-2xl font-bold text-center mb-4  ">
              Create an account
            </h1>

            <Input
              placeholder="Email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />

            <Input
              placeholder="Username"
              value={name}
              onChange={(e) => setName(e.target.value)}
            />

            <Input
              type="password"
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />

            <select
              value={role}
              onChange={(e) => setRole(e.target.value)}
              className="border rounded-lg p-2 w-full"
            >
              <option value="">Who are you ?</option>
              <option value="STUDENT">Student</option>
              <option value="TEACHER">Teacher</option>
            </select>

            {error && (
              <p className="text-red-500 text-sm text-center">{error}</p>
            )}

            <div className="active:translate-y-[4px] transition-all">
              <Button
                onClick={handleSubmit}
                className="w-full bg-[#3a25d9] text-white font-bold py-4
                shadow-[0_8px_0_#1f1a99] transition-all duration-200 ease- t
                hover:bg-[#2c1fbf] hover:brightness-110 hover:-translate-y-1
                hover:shadow-[0_12px_0_#1f1a99]"
              >
                Sign Up
              </Button>
            </div>
          </div>
        </div>
      </div>

      <div className="w-1/2 bg-[url('/image.jpg')] bg-cover relative overflow-hidden flex items-center justify-center">
        <div className="absolute inset-0 opacity-20 bg-[radial-gradient(circle,_white_1px,_transparent_1px)] bg-[length:40px_40px]" />

        <img src="/jump.gif" width={5000} className=" ml-[390px] mt-40" />
        <img src="/snow02.gif" className="h-[1000px] w-[1200px] absolute" />
        {/* <img src="/white.png" className="" /> */}
      </div>
    </div>
  );
}
