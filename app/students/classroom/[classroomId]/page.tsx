"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { useParams, useRouter } from "next/navigation";
import { useAuth } from "@/providers/useAuth";
import { useUser } from "@clerk/nextjs";

type Classroom = {
  id: string;
  title: string;
  coverImg?: string; // optional
  description: string;
  quizzes: Quiz[];
  teacherId: string;
};
type Quiz = {
  id: string;
  title: string;
  description: string;
  coverImg: string;
  creatorId: string;
  code: string;
};

const ClassroomPage = () => {
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");
  const [classroom, setClassroom] = useState<Classroom | null>(null);

  const { user: clerkUser } = useUser();
  const clerkId = clerkUser?.id;
  const { user } = useAuth(clerkId ?? "");
  const studentId = user?.id;

  const params = useParams();
  const classroomId = params.classroomId as string;
  const router = useRouter();

  const GetClass = async () => {
    try {
      const res = await fetch(`/api/classroom-create/${classroomId}`);
      if (!res.ok) return;
      const data: Classroom = await res.json();
      setClassroom(data);
    } catch (err) {
      console.log("Error fetching classroom", err);
    }
  };

  const handleJoinClassroom = async () => {
    if (!studentId) {
      setMessage("Student not authenticated");
      return;
    }

    setLoading(true);
    setMessage("");

    try {
      const res = await fetch("/api/join-classroom", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ classroomId, studentId }),
      });

      if (!res.ok) {
        const data = await res.json();
        setMessage(data.error || "Something went wrong");
      } else {
        setMessage("Successfully joined classroom!");
      }
    } catch (err) {
      setMessage("Error connecting to server");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (classroomId) GetClass();
  }, [classroomId]);

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col items-center py-10 px-4">
      <div className="max-w-md w-full bg-white rounded-2xl shadow-lg p-6 flex flex-col items-center">
        {classroom && (
          <div className="w-full mb-6 text-center">
            <img
              src={classroom.coverImg}
              alt={classroom.title}
              className="w-full h-48 object-cover rounded-xl mb-4"
            />
            <h2 className="text-2xl font-bold text-gray-800">
              {classroom.title}
            </h2>
            <p className="text-gray-600 mt-2">{classroom.description}</p>
          </div>
        )}

        <Button
          onClick={handleJoinClassroom}
          disabled={loading}
          className="w-full bg-indigo-600 text-white font-semibold py-3 rounded-xl shadow-md
            hover:bg-indigo-700 hover:shadow-lg transition-all duration-200"
        >
          {loading ? "Joining..." : "Join Classroom"}
        </Button>

        {message && (
          <p
            className={`mt-4 text-center ${
              message.includes("Successfully")
                ? "text-green-600"
                : "text-red-600"
            }`}
          >
            {message}
          </p>
        )}
      </div>
    </div>
  );
};

export default ClassroomPage;
