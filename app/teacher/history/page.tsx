"use client";
import SideBar from "../_components/SideBar";

export default function SettingsPage() {
  return (
    <div className="min-h-screen flex bg-[#f4f6ff]">
      <SideBar />

      <div className="flex-1 p-8">
        <div className="mb-6">
          <h1 className="text-4xl font-bold text-gray-900">History</h1>
          <div className="mt-4 h-[2px] bg-gray-300 rounded -mx-8" />
        </div>
      </div>
    </div>
  );
}
