"use client";

import { useUser } from "@clerk/nextjs";
import { useState } from "react";
import { useRouter } from "next/navigation";

export default function UserMenu() {
  const { user, isLoaded } = useUser();
  const [open, setOpen] = useState(false);
  const router = useRouter();

  if (!isLoaded) return null;

  const username =
    user?.firstName ||
    user?.username ||
    user?.emailAddresses[0]?.emailAddress.split("@")[0] ||
    "User";

  return (
    <div className="">
      <button
        onClick={() => setOpen(!open)}
        className="
      flex items-center gap-3
      bg-purple-500
      text-white
      rounded-bl-2xl
      px-11 py-2
      text-lg font-bold tracking-wide
      shadow-[0_6px_0_#27408B]
      drop-shadow-lg
      
  "
      >
        <img
          src={user?.imageUrl}
          className="w-8 h-8 rounded-full border border-white"
          alt="avatar"
        />

        <span className="font-semibold">{username}</span>

        <span className="text-sm">▼</span>
      </button>

      {open && (
        <div className="absolute right-0 mt-2 w-40 bg-white rounded-xl shadow-xl p-3 z-50">
          <button
            onClick={() => router.push("/settings")}
            className="block w-full text-left px-3 py-2 hover:bg-gray-100"
          >
            Settings
          </button>

          <button
            onClick={() => router.push("/")}
            className="block w-full text-left px-3 py-2 hover:bg-gray-100 text-red-500"
          >
            Logout
          </button>
        </div>
      )}
    </div>
  );
}
