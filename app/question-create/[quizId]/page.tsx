"use client";
type Quiz = {
  id: string;
  title: string;
  coverImg: string;
  description: string;
  questions: Questions[];
  creatorId: string;
};

type Questions = {
  id: string;
  title: string;
  description: string;
  creatorId: string;
};
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Checkbox } from "@/components/ui/checkbox";
import { useRouter } from "next/navigation";
import { Input } from "@/components/ui/input";
import { useParams } from "next/navigation";
import { useState, useEffect } from "react";
import SideBar from "@/app/_components/SideBar";
const Page = () => {
  const [quiz, setQuiz] = useState<Quiz | null>(null);
  const [questions, setQuestions] = useState<Questions[]>([]);
  const params = useParams();
  const quizId = params.quizId as string;
  const getQuiz = async () => {
    try {
      const res = await fetch(`/api/quizCreate/${quizId}`);
      if (!res.ok) {
        console.log("Failed to get quiz");
        return;
      }
      const data: Quiz = await res.json();
      setQuiz(data);
      setQuestions(data.questions);
    } catch (err) {
      console.log("Error fetching quiz", err);
    }
  };
  useEffect(() => {
    if (quizId) getQuiz();
  }, [quizId]);

  console.log(quiz);
  return (
    <div className="px-10 mt-10">
      <div className="flex items-start gap-20">
        <div className="border shadow-lg rounded-xl p-5 w-80 bg-white">
          <div>
            {quiz?.coverImg ? (
              <img
                src={quiz.coverImg}
                alt="Classroom Cover"
                className="w-full h-40 object-cover rounded-xl"
              />
            ) : (
              <div className="w-full h-40 bg-blue-500 rounded-xl flex justify-center items-center text-white text-3xl font-bold">
                BRAINKET
              </div>
            )}
          </div>
          <div className="mt-4 text-xl font-semibold">{quiz?.title}</div>
          <div className="text-gray-600">{quiz?.description}</div>
        </div>

        <div className="flex items-center gap-4 mt-6">
          <div className="shadow-lg border rounded-xl w-50 h-12 flex items-center justify-center text-xl font-bold">
            {questions?.length ?? 0} Questions
          </div>

          <Dialog>
            <DialogTrigger
              className="bg-[#4169E1] w-50 text-white rounded-2xl font-semibold
            text-xl h-12 px-6 cursor-pointer
            shadow-[0_4px_0_#27408B] transition-all
            hover:-translate-y-1 hover:shadow-[0_6px_0_#27408B]
            active:translate-y-1 active:shadow-[0_1px_0_#27408B]"
            >
              Add Question
            </DialogTrigger>

            <DialogContent className="w-250">
              <Input placeholder="Question Text" className="w-110 h-40" />

              <Input
                placeholder="Option 1"
                className="bg-yellow-300 h-20 w-50 absolute left-70 top-50"
              />

              <Input placeholder="Option 2" className="bg-blue-500 h-20 w-50" />
              <Input placeholder="Option 3" className="bg-red-500 h-20 w-50" />
              <Input
                placeholder="Option 4"
                className="bg-green-500 h-20 w-50 absolute left-70 top-74"
              />
            </DialogContent>
          </Dialog>
        </div>
      </div>
    </div>
  );
};

export default Page;
