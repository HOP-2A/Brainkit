"use client";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader } from "@/components/ui/dialog";
import { DialogTrigger } from "@radix-ui/react-dialog";
import { useParams } from "next/navigation";
import { useRouter } from "next/navigation";
import { useState, useEffect } from "react";
import { Input } from "@/components/ui/input";
import SideBar from "@/app/_components/SideBar";
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

  const params = useParams();
  const classroomId = params.classroomID as string;
  const router = useRouter();
  const [code, setCode] = useState("");
  const [error, setError] = useState("");

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
    <div className="min-h-screen flex bg-gray-100">
      <SideBar />
      {classroom && (
        <div className="mb-6 rounded-xl bg-background p-6 shadow">
          <h1 className="text-2xl font-bold">{classroom.title}</h1>
          <p className="text-sm text-muted-foreground mt-1">
            {classroom.description}
          </p>
        </div>
      )}

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {quizzes.length > 0 ? (
          quizzes.map((q) => (
            <div
              key={q.id}
              className="rounded-xl border bg-background p-4 shadow-sm hover:shadow-md transition"
            >
              <div className="text-lg font-semibold">{q.title}</div>
              <p className="text-sm text-muted-foreground mt-1 line-clamp-2">
                {q.description}
              </p>
              <Dialog>
                <DialogTrigger asChild>
                  <Button size="sm" className="mt-3 w-full">
                    Play
                  </Button>
                </DialogTrigger>

                <DialogContent>
                  <DialogHeader>
                    <strong className="text-lg">Play {q.title}</strong>
                  </DialogHeader>

                  <Input
                    placeholder={`Enter ${q.title} code...`}
                    value={code}
                    onChange={(e) => {
                      setCode(e.target.value);
                      setError("");
                    }}
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
          <div className="col-span-full text-center text-muted-foreground">
            No quiz yet.
          </div>
        )}
      </div>
    </div>
  );
};

export default Page;
