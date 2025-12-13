"use client";

import SideBar from "../_components/sidebar";

export default function Dashboard() {
  return (
    <div className="min-h-screen flex bg-[#f4f6ff]">
      <SideBar />

      <div className="flex-1 p-6">
        <div className="mb-6">
          <h1 className="text-4xl font-bold">History</h1>
          <div className="mt-5 w-full h-1 bg-gray-300"></div>
        </div>
      </div>
    </div>
  );
}
