"use client";
import { useUser } from "@clerk/nextjs";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
const Page = () => {
  const { isSignedIn } = useUser();
  const router = useRouter();
  const user = useUser();
  // useEffect(() => {
  //   if (!isSignedIn) {
  //     router.push("/sign-up");
  //   }
  // }, [isSignedIn]);
  return (
    <div>
      <div>hello</div>
    </div>
  );
};

export default Page;
