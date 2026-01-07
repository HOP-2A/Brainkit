"use client";
import { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import StudentSideBar from "../../_components/StudentSideBar";
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

  const [openQuizId, setOpenQuizId] = useState<string | null>(null);
  const [codeMap, setCodeMap] = useState<{ [key: string]: string }>({});
  const [errorMap, setErrorMap] = useState<{ [key: string]: string }>({});

  useEffect(() => {
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

    if (classroomId) GetClass();
  }, [classroomId]);

  const handleCodeChange = (quizId: string, value: string) => {
    setCodeMap((prev) => ({ ...prev, [quizId]: value }));
    setErrorMap((prev) => ({ ...prev, [quizId]: "" }));
  };

  const handleJoin = (quiz: Quiz) => {
    if (codeMap[quiz.id] === quiz.code) {
      router.push(`/play/${quiz.id}`);
    } else {
      setErrorMap((prev) => ({ ...prev, [quiz.id]: "Invalid code" }));
    }
  };

  return (
    <div className="min-h-screen flex bg-gray-100">
      <StudentSideBar />

      <div className="flex-1 flex flex-col">
        <div className="p-8">
          <h1 className="text-5xl font-bold text-gray-900">My Classes</h1>
          <div className="mt-4 h-0.5 bg-gray-300 rounded -mx-8" />
        </div>

        <div className="p-8 pt-0">
          {classroom && (
            <div
              className="mb-6 rounded-xl bg-background p-5 shadow flex
             flex-col items-center border-2 border-[#9a49aa]"
            >
              <h1 className="text-2xl font-bold">{classroom.title}</h1>
              <p className="text-sm text-muted-foreground mt-1">
                {classroom.description}
              </p>
            </div>
          )}

          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {quizzes.length > 0 ? (
              quizzes.map((q) => (
                <div
                  key={q.id}
                  className="group rounded-2xl border bg-white p-6 shadow-sm
                   transition-all duration-300
                   hover:-translate-y-1 hover:shadow-lg"
                >
                  <h2 className="text-xl font-bold text-gray-900 group-hover:text-primary transition">
                    {q.title}
                  </h2>

                  <p className="text-sm text-gray-500 mt-2 line-clamp-2">
                    {q.description}
                  </p>

                  <Dialog
                    open={openQuizId === q.id}
                    onOpenChange={(open) => {
                      setOpenQuizId(open ? q.id : null);
                      if (!open) {
                        setCodeMap((prev) => ({ ...prev, [q.id]: "" }));
                        setErrorMap((prev) => ({ ...prev, [q.id]: "" }));
                      }
                    }}
                  >
                    <DialogTrigger asChild>
                      <Button
                        onClick={() => router.push(`/playQuiz/${q.id}`)}
                        size="sm"
                        className="mt-5 w-full rounded-xl
                         bg-[#0BC2CF] text-white
                         hover:bg-[#09a9b4] transition"
                      >
                        ▶ Play
                      </Button>
                    </DialogTrigger>
                  </Dialog>
                </div>
              ))
            ) : (
              <div className="col-span-full text-center text-gray-400 text-lg">
                No quiz yet.
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Page;
