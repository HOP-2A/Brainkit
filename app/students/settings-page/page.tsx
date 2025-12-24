"use client";
import StudentSideBar from "../_components/StudentSideBar";

export default function SettingsPage() {
  return (
    <div className="min-h-screen flex bg-[#f4f6ff]">
      <StudentSideBar />

      <div className="flex-1 p-8">
        <div className="mb-6">
          <h1 className="text-4xl font-bold text-gray-900">Settings</h1>
          <div className="mt-4 h-[2px] bg-gray-300 rounded -mx-8" />
        </div>
      </div>
    </div>
  );
}
