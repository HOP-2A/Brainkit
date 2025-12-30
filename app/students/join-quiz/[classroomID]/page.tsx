"use client";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader } from "@/components/ui/dialog";
import { DialogTrigger } from "@radix-ui/react-dialog";
import { useParams } from "next/navigation";
import { useRouter } from "next/navigation";
import { useState, useEffect } from "react";
import { Input } from "@/components/ui/input";

type Classroom = {
  id: string;
  title: string;
  coverImg: string;
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

const Page = () => {
  const [quizzes, setQuizzes] = useState<Quiz[]>([]);
  const [classroom, setClassroom] = useState<Classroom | null>(null);
  const [code, setCode] = useState("");
  const [error, setError] = useState("");

  const params = useParams();
  const classroomId = params.classroomID as string;
  const router = useRouter();

  const GetClass = async () => {
    try {
      const res = await fetch(`/api/classroom-create/${classroomId}`);
      if (!res.ok) return;

      const data: Classroom = await res.json();
      setClassroom(data);
      setQuizzes(data.quizzes);
    } catch (err) {
      console.log("Error fetching classroom", err);
    }
  };

  useEffect(() => {
    if (classroomId) GetClass();
  }, [classroomId]);

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      {classroom && (
        <div className="mb-8 rounded-xl bg-white p-6 shadow-md border border-gray-200">
          <h1 className="text-3xl font-bold text-gray-900">
            {classroom.title}
          </h1>
          <p className="text-sm text-gray-500 mt-2">{classroom.description}</p>
        </div>
      )}

      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {quizzes.length > 0 ? (
          quizzes.map((q) => (
            <div
              key={q.id}
              className="flex flex-col rounded-xl border bg-white p-5 shadow hover:shadow-lg transition duration-300"
            >
              <div className="text-xl font-semibold text-gray-900">
                {q.title}
              </div>
              <p className="text-sm text-gray-500 mt-1 line-clamp-2">
                {q.description}
              </p>

              <Dialog>
                <DialogTrigger asChild>
                  <Button size="sm" className="mt-4 w-full">
                    Play
                  </Button>
                </DialogTrigger>

                <DialogContent className="max-w-sm">
                  <DialogHeader>
                    <strong className="text-lg text-gray-900">
                      Play {q.title}
                    </strong>
                  </DialogHeader>

                  <Input
                    placeholder={`Enter ${q.title} code...`}
                    value={code}
                    onChange={(e) => {
                      setCode(e.target.value);
                      setError("");
                    }}
                    className="mt-3"
                  />

                  {error && (
                    <p className="text-sm text-red-500 mt-1">{error}</p>
                  )}

                  <Button
                    className="mt-4 w-full"
                    onClick={() => {
                      if (code === q.code) {
                        router.push(`/play/${q.id}`);
                      } else {
                        setError("Invalid code");
                      }
                    }}
                  >
                    Join
                  </Button>
                </DialogContent>
              </Dialog>
            </div>
          ))
        ) : (
          <div className="col-span-full text-center text-gray-400">
            No quiz yet.
          </div>
        )}
      </div>
    </div>
  );
};

export default Page;
