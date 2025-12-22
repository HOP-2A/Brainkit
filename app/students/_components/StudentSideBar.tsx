"use client";

import { UserButton } from "@clerk/nextjs";
import { useRouter, usePathname } from "next/navigation";
import { Settings, Play, School, PcCase, UserRound } from "lucide-react";

export default function StudentSideBar() {
  const router = useRouter();
  const pathname = usePathname();

  const menuItems = [
    {
      name: " My class",
      icon: <PcCase className="w-5 h-5" />,
      path: "../students/classroom",
    },
    {
      name: "Settings",
      icon: <Settings className="w-5 h-5" />,
      path: "../students/settings-page",
    },
    {
      name: "Play",
      icon: <Play className="w-5 h-5" />,
      path: "../students/play",
    }
  ];

  return (
    <div className="min-h-screen flex bg-[#f4f6ff]">
      <aside className="w-56 bg-[#9a49aa] text-white flex flex-col p-6">
        <h2 className="text-4xl font-bold mb-10">BRAINKET</h2>

        <ul className="flex flex-col gap-3">
          {menuItems.map((item) => {
            const isActive = pathname === item.path;
            return (
              <li
                key={item.name}
                onClick={() => router.push(item.path)}
                className={`flex items-center gap-3 p-3 rounded-lg cursor-pointer
                text-white font-semibold text-xl transition-colors relative
                hover:bg-white hover:text-black`}
              >
                {isActive && (
                  <span className="absolute left-0 top-0 h-full w-1 bg-white rounded-r-md"></span>
                )}

                {item.icon}
                <span className="ml-1">{item.name}</span>
              </li>
            );
          })}
        </ul>
        <div
          onClick={() => router.push("../teacher/classroom-create")}
          className="mt-auto w-40 bg-[#0BC2CF] text-white 
          rounded-sm font-bold text-lg py-3 px-4
          flex items-center justify-center gap-2"
        >
          <UserRound className="w-5 h-5" />
          Student
        </div>
      </aside>

      <div className="absolute right-6 mt-6">
        <UserButton />
      </div>
    </div>
  );
}
