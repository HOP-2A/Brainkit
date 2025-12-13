"use client";

import { UserButton } from "@clerk/nextjs";
import { useRouter, usePathname } from "next/navigation";
import { List, PenLine, History, SquarePlus, Settings } from "lucide-react";

export default function SideBar() {
  const router = useRouter();
  const pathname = usePathname();

  const menuItems = [
    { name: "My sets", icon: <List className="w-5 h-5" />, path: "/my-sets" },
    {
      name: "Create Quiz",
      icon: <SquarePlus className="w-5 h-5" />,
      path: "/create-quiz",
    },
    {
      name: "History",
      icon: <History className="w-5 h-5" />,
      path: "/history",
    },
    {
      name: "Settings",
      icon: <Settings className="w-5 h-5" />,
      path: "/settings",
    },
  ];

  return (
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
                <span className="ml-2">{item.name}</span>
              </li>
            );
          })}
        </ul>
      </aside>

      <div className="absolute top-4 right-6">
        <UserButton />
      </div>
    </div>
  );
}
