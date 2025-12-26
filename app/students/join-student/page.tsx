"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";

export default function JoinClass() {
  const [code, setCode] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const router = useRouter();

  const joinClass = async () => {
    if (!code.trim()) {
      setError("Class code оруулна уу");
      return;
    }

    try {
      setLoading(true);
      setError("");

      const res = await fetch("/api/find-classroombycode", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ code }),
      });

      const data = await res.json();

      if (!res.ok) {
        setError(data.error || "Буруу код");
        return;
      }

      router.push(`/students/play-student/${data.id}`);
    } catch (err) {
      setError("Алдаа гарлаа");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex items-center gap-3">
      <input
        className="h-12 w-56 border-2 border-gray-300 rounded-lg px-4
          focus:outline-none focus:ring-2 focus:ring-[#0BC2CF]"
        value={code}
        onChange={(e) => setCode(e.target.value)}
        placeholder="Enter class code"
        onKeyDown={(e) => e.key === "Enter" && joinClass()}
      />

      <Button
        onClick={joinClass}
        disabled={loading}
        className="h-12 px-6 bg-[#0BC2CF] text-white font-semibold
          hover:bg-[#09b1bd] transition disabled:opacity-50"
      >
        {loading ? "Joining..." : "Join"}
      </Button>

      {error && (
        <p className="text-red-500 text-sm ml-2">{error}</p>
      )}
    </div>
  );
}
