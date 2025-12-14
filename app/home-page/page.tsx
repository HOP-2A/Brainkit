"use client";

import { UserButton } from "@clerk/nextjs";
import { useRouter } from "next/navigation";

export default function Dashboard() {
  const router = useRouter();

  const discoverSets = [
    { id: "1", title: "World Capitals", cardsCount: 40 },
    { id: "2", title: "Chemistry Basics", cardsCount: 32 },
    { id: "3", title: "English Vocabulary", cardsCount: 55 },
  ];

  const mySets = [
    { id: "m1", title: "My Math Set", cardsCount: 21 },
    { id: "m2", title: "History Dates", cardsCount: 15 },
  ];

  return (
    <div className="min-h-screen flex bg-[#f4f6ff]">
      <aside className="w-64 bg-purple-500 text-white flex flex-col p-6">
        <h2 className="text-4xl font-bold mb-6">BRAINKET</h2>
        <UserButton />
        <ul className="flex flex-col gap-4">
          <li
            className="hover:bg-purple-500 p-3 rounded-lg cursor-pointer"
            onClick={() => router.push("/my-sets")}
          >
            My sets
          </li>
          <li
            className="hover:bg-purple-500 p-3 rounded-lg cursor-pointer"
            onClick={() => router.push("/sets/new")}
          >
            Create Set
          </li>
          <li
            className="hover:bg-purple-500 p-3 rounded-lg cursor-pointer"
            onClick={() => router.push("/profile")}
          >
            Profile
          </li>
          <li
            className="hover:bg-purple-500 p-3 rounded-lg cursor-pointer"
            onClick={() => router.push("/settings")}
          >
            Settings
          </li>
        </ul>
      </aside>

      <main className="flex-1 p-6">
        <header className="flex justify-between items-center mb-8">
          
        </header>
        <section>
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-2xl font-semibold">My Sets</h2>
            <button
              onClick={() => router.push("/sets/new")}
              className="bg-[#4169E1] text-white px-4 py-2 rounded-xl font-bold shadow-[0_4px_0_#27408B]"
            >
              Create Set
            </button>
          </div>
          

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {mySets.map((s) => (
              <div
                key={s.id}
                className="bg-white rounded-2xl p-4 shadow-md hover:scale-105 transition cursor-pointer border-2 border-transparent hover:border-[#8598FF]"
                onClick={() => router.push(`/sets/${s.id}/edit`)}
              >
                <h3 className="font-bold text-lg">{s.title}</h3>
                <div className="text-xs text-gray-500 mt-2">
                  {s.cardsCount} cards
                </div>
              </div>  
            ))}
          </div>
        </section>
      </main>
    </div>
  );
}
