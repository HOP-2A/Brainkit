"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import StudentSideBar from "../_components/StudentSideBar";
import { Button } from "@/components/ui/button";

type ClassroomData = {
  id: string;
  title: string;
  coverImg: string;
  description: string;
};

const Classroom = () => {
  const router = useRouter();
  const [code, setCode] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [classroom, setClassroom] = useState<ClassroomData[] | null>([]);

  const joinClassroom = async () => {
    if (!code) return;

    setLoading(true);
    setError("");

    try {
      const response = await fetch("/api/joinCodeClassroom", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ code }),
      });

      if (!response.ok) {
        setError("Class not found");
        return;
      }

      const data: ClassroomData = await response.json();

      const alreadyJoined = classroom?.some((cls) => cls.id === data.id);

      if (alreadyJoined) {
        setError("You have already joined this class");
        return;
      }

      setClassroom((prev) => (prev ? [...prev, data] : [data]));
      setCode("");
    } catch (err) {
      setError("Error joining class. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    joinClassroom();
  }, [setCode]);
  console.log(classroom, "asd");
  return (
    <div className="min-h-screen flex bg-[#f4f6ff]">
      <StudentSideBar />
      <div className="flex-1 p-8">
        <div className="flex items-center justify-between pr-15">
          <h1 className="text-5xl font-bold text-gray-900">My Classes</h1>
          <div className="flex items-center gap-3">
            <input
              className="h-12 w-56 border-2 border-gray-300 rounded-lg px-4
          focus:outline-none focus:ring-2 focus:ring-[#0BC2CF]"
              value={code}
              onChange={(e) => setCode(e.target.value)}
              placeholder="Enter class code"
              onKeyDown={(e) => e.key === "Enter" && joinClassroom()}
            />

            <Button
              onClick={joinClassroom}
              disabled={loading}
              className="h-12 px-6 bg-[#0BC2CF] text-white font-semibold
          hover:bg-[#09b1bd] transition disabled:opacity-50"
            >
              {loading ? "Joining..." : "Join"}
            </Button>

            {error && <p className="text-red-500 text-sm ml-2">{error}</p>}
          </div>
        </div>
        <div className="mt-4 h-[2px] bg-gray-300 rounded -mx-8" />

        <div className="mt-8">
          {classroom && (
            <div className="grid xl:grid-cols-6 lg:grid-cols-4 sm:grid-cols-2 gap-6">
              {classroom.map((cls) => (
                <div
                  key={cls.id}
                  className="bg-white border rounded-lg overflow-hidden"
                >
                  <div className="h-30 bg-[#0BC2CF] flex items-center justify-center text-white font-extrabold text-2xl">
                    BRAINKET
                  </div>

                  <div className="p-4 flex flex-col gap-4 items-center ">
                    <p className="text-2xl font-semibold text-center">
                      {cls.title}
                    </p>

                    <div className="active:translate-y-[4px] transition-all py-2">
                      <Button
                        onClick={() =>
                          router.push(`/students/play-student/${cls.id}`)
                        }
                        className="bg-[#0BC2CF] text-white font-bold py-2 px-6
                        shadow-[0_6px_0_#09AEB9]
                       hover:bg-[#09AEB9] hover:-translate-y-1
                        hover:shadow-[0_10px_0_#0898A3]"
                      >
                        Open Class
                      </Button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Classroom;
