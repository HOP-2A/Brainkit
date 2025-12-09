"use client";

import { useEffect, useState } from "react";
import { Input } from "@/components/ui/input";
import { useRouter } from "next/navigation";
import { useUser } from "@clerk/nextjs";
import { Button } from "@/components/ui/button";

export default function SignUpPage() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [role, setRole] = useState("");
  const [error, setError] = useState<string | null>(null); // <-- add state for errors

  const { user, isSignedIn } = useUser();
  const router = useRouter();

  const handleSubmit = async () => {
    setError(null); // reset error on submit

    const res = await fetch("/api/signUp", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        email,
        name,
        type: role,
      }),
    });

    const data = await res.json();

    // if (!res.ok) {
    //   // if the response is an error, show it
    //   setError(data.error || "Something went wrong");
    // } else {
    //   // successful sign up, you can redirect or show success
    //   router.push("/");
    // }
  };

  useEffect(() => {
    if (isSignedIn) {
      router.push("/");
    }
  }, [isSignedIn]);

  return (
    <div className="flex flex-col gap-4 items-center">
      <div className="border bg-blue-500 w-50 text-white shadow-black rounded-lg items-center p-4">
        <strong className="text-4xl">Brainkit</strong>
      </div>
      <Input
        className="w-50"
        placeholder="Email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
      />
      <Input
        className="w-50"
        placeholder="Name"
        value={name}
        onChange={(e) => setName(e.target.value)}
      />
      <select
        value={role}
        onChange={(e) => setRole(e.target.value)}
        className="border bg-blue-500 text-white rounded-lg p-2"
      >
        <option value="">Select Role</option>
        <option value="TEACHER">Teacher</option>
        <option value="STUDENT">Student</option>
      </select>
      {error && <p className="text-red-500">{error}</p>} {/* <-- show error */}
      <Button onClick={handleSubmit} className="bg-blue-500 flex">
        Sign Up
      </Button>
    </div>
  );
}
