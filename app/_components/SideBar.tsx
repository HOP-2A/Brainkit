"use client";

import { UserButton } from "@clerk/nextjs";
import { useRouter } from "next/navigation";
import { List } from "lucide-react";
import { PenLine } from "lucide-react";
import { History } from "lucide-react";
import { SquarePlus } from "lucide-react";
import { Settings } from "lucide-react";

export default function SideBar() {
  const router = useRouter();

  return (
    <div className="min-h-screen flex bg-[#f4f6ff]">
      <div className="min-h-screen flex bg-[#f4f6ff]">
        <aside className="w-56 bg-[#7B5CFF] text-white flex flex-col p-6">
          <h2 className="text-4xl font-bold mb-6">BRAINKET</h2>

          <button
            onClick={() => router.push("/create-class")}
            className="mb-6 w-40 bg-[#5B3FFF] text-white
            rounded-xl font-bold text-lg py-3 px-4
            flex items-center justify-center gap-2
            shadow-[0_5px_0_#3B1FCC] hover:bg-[#6A52FF]
             hover:-translate-y-1 active:translate-y-1   
            relative -right-2 transition-all "
          >
            <PenLine className="w-5 h-5" />
            CREATE
          </button>

          <ul className="flex flex-col gap-4">
            <ul className="flex flex-col gap-4">
              <li
                onClick={() => router.push("/my-sets")}
                className="flex items-center gap-3 p-3 rounded-lg cursor-pointer
               text-gray-950 font-semibold text-xl hover:bg-white transition-all"
              >
                <List className="w-5 h-5" />
                <span>My sets</span>
              </li>
              <li
                onClick={() => router.push("/create-quiz")}
                className="flex items-center gap-3 p-3 rounded-lg cursor-pointer
               text-gray-950 font-semibold text-xl hover:bg-white transition-all"
              >
                <SquarePlus className="w-5 h-5" />
                <span>Create Quiz</span>
              </li>
              <li
                onClick={() => router.push("/history")}
                className="flex items-center gap-3 p-3 rounded-lg cursor-pointer
               text-gray-950 font-semibold text-xl hover:bg-white transition-all"
              >
                <History className="w-5 h-5" />
                <span>History</span>
              </li>
              <li
                onClick={() => router.push("/settings")}
                className="flex items-center gap-3 p-3 rounded-lg cursor-pointer
               text-gray-950 font-semibold text-xl hover:bg-white transition-all"
              >
                <Settings className="w-5 h-5" />
                <span>Settings</span>
              </li>
            </ul>
          </ul>
        </aside>

        <div className="absolute top-4 right-6">
          <UserButton />
        </div>
      </div>

      <div className="absolute top-4 right-6">
        <UserButton />
      </div>
    </div>
  );
}
