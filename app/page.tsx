"use client";
import { useUser } from "@clerk/nextjs";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
const Page = () => {
  const { user, isSignedIn } = useUser();
  console.log(user);
  return (
    <div className="flex justify-center mt-20 text-3xl font-bold">
      {isSignedIn ? (
        <div>Hello, {user?.firstName || "Player"} 🎮</div>
      ) : (
        <div>Please sign in to continue</div>
      )}
    </div>
  );
};

export default Page;
