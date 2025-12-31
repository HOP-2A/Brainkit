"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import StudentSideBar from "../_components/StudentSideBar";
import { Button } from "@/components/ui/button";
import { useUser } from "@clerk/nextjs";

type ClassroomData = {
  id: string;
  title: string;
  coverImg: string;
  description: string;
};

const Classroom = () => {
  const router = useRouter();
  const { user, isLoaded } = useUser();

  const [classrooms, setClassrooms] = useState<ClassroomData[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    if (!isLoaded || !user) return;

    const fetchClassroom = async () => {
      try {
        const res = await fetch("/api/student-allclass", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            studentId: user.id,
          }),
        });

        if (!res.ok) {
          setClassrooms([]);
          return;
        }

        const classroom = await res.json();

        setClassrooms(classroom ? [classroom] : []);
      } catch (err) {
        setError("Failed to load classrooms");
      } finally {
        setLoading(false);
      }
    };

    fetchClassroom();
  }, [isLoaded, user]);
  console.log(classrooms);
  return (
    <div className="min-h-screen flex bg-[#f4f6ff]">
      <StudentSideBar />

      <div className="flex-1 p-8">
        <h1 className="text-5xl font-bold text-gray-900">My Classes</h1>
        <div className="mt-4 h-[2px] bg-gray-300 rounded -mx-8" />

        {error && <p className="mt-4 text-red-500">{error}</p>}

        <div className="mt-8">
          {loading ? (
            <p className="text-gray-500">Loading...</p>
          ) : classrooms.length > 0 ? (
            <div className="grid xl:grid-cols-6 lg:grid-cols-4 sm:grid-cols-2 gap-6">
              {classrooms.map((cls) => (
                <div
                  key={cls.id}
                  className="bg-white border rounded-lg overflow-hidden"
                >
                  <div className="h-30 bg-[#0BC2CF] flex items-center justify-center text-white font-extrabold text-2xl">
                    BRAINKET
                  </div>

                  <div className="p-4 flex flex-col gap-4 items-center">
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
          ) : (
            <p className="mt-4 text-gray-500">
              You haven’t joined any classes yet.
            </p>
          )}
        </div>
      </div>
    </div>
  );
};

export default Classroom;
