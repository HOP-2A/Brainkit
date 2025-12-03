"use client";
import { useUser } from "@clerk/nextjs";

const Page = () => {
  const { user, isSignedIn } = useUser();

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
