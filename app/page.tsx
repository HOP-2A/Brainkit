"use client";
import { useUser } from "@clerk/nextjs";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "./api/providers/useAuth";
const Page = () => {
  const { user: clerkUser } = useUser();

  const clerkId = clerkUser?.id;

  console.log(clerkId, "awe");

  const { user } = useAuth(clerkId ?? "");

  console.log(user, "qw");
  return (
    <div className="flex justify-center mt-20 text-3xl font-bold">
      {/* {isSignedIn ? (
        <div>Hello, {user?.firstName || "Player"} 🎮</div>
      ) : (
        <div>Please sign in to continue</div>
      )} */}
    </div>
  );
};

export default Page;
