import { UserButton } from "@clerk/nextjs";
import { useRouter } from "next/navigation";
import router from "next/router";

export const SideBar = () => {
  return (
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
  );
};
