"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import StudentSideBar from "../_components/StudentSideBar";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/providers/useAuth";
import { useUser } from "@clerk/nextjs";

type Classroom = {
  id: string;
  title: string;
  coverImg: string;
  description: string;
};
const ClassroomPage = () => {
  const router = useRouter();
  const [code, setCode] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [classrooms, setClassrooms] = useState<Classroom[]>([]);
  const { user: clerkUser } = useUser();
  const clerkId = clerkUser?.id;
  const { user } = useAuth(clerkId ?? "");
  const classroomId = user?.classRoomId;

  const getClassroom = async () => {
    if (!classroomId) return;
    try {
      const res = await fetch(`/api/classroom-create/${classroomId}`);
      if (!res.ok) return;
      const data: Classroom = await res.json();
      setClassrooms([data]);
      console.log("work");
    } catch (err) {
      console.log("Error fetching classroom", err);
    }
  };

  const joinClassroom = async () => {
    if (!code || !user?.id) return;

    setLoading(true);
    setError("");

    try {
      const response = await fetch("/api/joinCodeClassroom", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ code, studentId: user.id }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        setError(errorData?.error || "Class not found");
        return;
      }

      const newClassroom = await response.json();

      setClassrooms([newClassroom.classroom]);
      setCode("");
    } catch (err) {
      setError("Error joining class. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    getClassroom();
  }, [classroomId]);

  return (
    <div className="min-h-screen flex bg-[#f4f6ff]">
      <StudentSideBar />
      <div className="flex-1 p-8">
        <div className="flex items-center justify-between pr-15">
          <h1 className="text-5xl font-bold text-gray-900">My Class</h1>
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

        <div className="mt-4 h-0.5 bg-gray-300 rounded -mx-8" />

        <div className="mt-8">
          {classrooms.length > 0 ? (
            <div className="grid xl:grid-cols-6 lg:grid-cols-4 sm:grid-cols-2 gap-6 ">
              {classrooms.map((cls) => (
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

                    <div className="active:translate-y-1 transition-all py-2">
                      <Button
                        onClick={() =>
                          router.push(`/students/join-quiz/${cls.id}`)
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
          ) : (
            <p className="text-gray-500 text-lg">No classes joined yet.</p>
          )}
        </div>
      </div>
    </div>
  );
};

export default ClassroomPage;
