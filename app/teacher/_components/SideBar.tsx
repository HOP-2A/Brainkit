"use client";

import { UserButton } from "@clerk/nextjs";
import { useRouter, usePathname } from "next/navigation";
import {
  List,
  PenLine,
  History,
  SquarePlus,
  Settings,
  UserRound,
} from "lucide-react";

export default function SideBar() {
  const router = useRouter();
  const pathname = usePathname();

  const menuItems = [
    {
      name: "My classes",
      icon: <List className="w-5 h-5" />,
      path: "/teacher/my-sets",
    },
    {
      name: "History",
      icon: <History className="w-5 h-5" />,
      path: "/teacher/history",
    },
    {
      name: "Settings",
      icon: <Settings className="w-5 h-5" />,
      path: "/teacher/settings-page",
    },
  ];

  return (
    <div className="min-h-screen flex bg-[#f4f6ff]">
      <aside className="w-56 bg-[#9a49aa] text-white flex flex-col p-6">
        <h2 className="text-4xl font-bold mb-6">BRAINKET</h2>

        <button
          onClick={() => router.push("../teacher/classroom-create")}
          className="mb-6 w-40 bg-[#0BC2CF] text-white 
          rounded-xl font-bold text-lg py-3 px-4
          flex items-center justify-center gap-2
          shadow-[0_5px_0_#088d96] hover:bg-[#0bd5e3]
           hover:-translate-y-1 active:translate-y-1   
          relative -right-2 transition-all "
        >
          <PenLine className="w-5 h-5" />
          CREATE
        </button>

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
                <span
                  className={`absolute left-0 top-0 h-full w-1 rounded-r-md transition-all
                ${
                  isActive
                    ? "bg-white"
                    : "bg-transparent group-hover:bg-white rounded-2xl"
                }`}
                ></span>

                {item.icon}
                <span className="ml-2">{item.name}</span>
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
          Teacher
        </div>
      </aside>

      <div className="absolute right-6 mt-6">
        <UserButton />
      </div>
    </div>
  );
}
