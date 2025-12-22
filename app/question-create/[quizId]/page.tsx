"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { Input } from "@/components/ui/input";
import { Checkbox } from "@/components/ui/checkbox";
import { PenLine } from "lucide-react";
import { Trash } from "lucide-react";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Save, X } from "lucide-react";
import SideBar from "@/app/_components/SideBar";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";

type Questions = {
  id: string;
  quizId: string;
  question: string;
  timer: string;
};

type Quiz = {
  id: string;
  title: string;
  coverImg: string;
  description: string;
  questions: Questions[];
  creatorId: string;
};

type Option = {
  text: string;
  isCorrect: boolean;
};

const Page = () => {
  const params = useParams();
  const quizId = params.quizId as string;

  const [quiz, setQuiz] = useState<Quiz | null>(null);
  const [questions, setQuestions] = useState<Questions[]>([]);

  const [question, setQuestion] = useState("");
  const [timer, setTimer] = useState<number>(20);

  const [options, setOptions] = useState<Option[]>([
    { text: "", isCorrect: false },
    { text: "", isCorrect: false },
    { text: "", isCorrect: false },
    { text: "", isCorrect: false },
  ]);

  const updateOptionText = (index: number, value: string) => {
    const copy = [...options];
    copy[index].text = value;
    setOptions(copy);
  };

  const setCorrectOption = (index: number) => {
    setOptions(
      options.map((opt, i) => ({
        ...opt,
        isCorrect: i === index,
      }))
    );
  };
  const getQuiz = async () => {
    const res = await fetch(`/api/quizCreate/${quizId}`);
    if (!res.ok) return;
    const data: Quiz = await res.json();
    setQuiz(data);
    setQuestions(data.questions || null);
  };

  console.log(questions);
  const createQuestion = async () => {
    if (!question.trim()) return toast.error("Question hooson");
    if (!options.some((o) => o.isCorrect))
      return toast.error("Zuv hariult songo");

    const res = await fetch("/api/question-option-create", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        question,
        quizId,
        timer,
        options,
      }),
    });

    if (res.ok) {
      toast.success("Question added 🎉");
      setQuestion("");
      getQuiz();
      setTimer(0);

      setOptions(options.map(() => ({ text: "", isCorrect: false })));
      getQuiz();
    } else {
      toast.error("Failed to create question");
    }
  };

  const deleteAll = async () => {
    const response = await fetch("/api/delete-question", {
      method: "DELETE",
      headers: {
        "Content-type": "application/json",
      },
      body: JSON.stringify({
        quizId,
      }),
    });
    if (response.ok) {
      toast.success("All questions deleted successfully.");
    } else {
      toast.error("Error");
    }
  };

  const deleteQuestion = async (questionId: string) => {
    const response = await fetch("/api/delete-question", {
      method: "DELETE",
      headers: {
        "Content-type": "application/json",
      },
      body: JSON.stringify({
        questionId,
      }),
    });
    if (response.ok) {
      toast.success("Question deleted successfully");
      getQuiz();
    } else if (response.ok) {
      toast.error("Error");
    }
  };

  // const editQuestion = () => {};
  useEffect(() => {
    const fetchData = async () => await getQuiz();
    fetchData();
  }, [quizId]);
  console.log(questions);
  return (
    <div className="flex gap-20">
      <SideBar />

      <div className="border shadow-lg rounded-xl p-5 w-80 bg-white h-80">
        {quiz?.coverImg ? (
          <img
            src={quiz.coverImg}
            className="w-full h-40 object-cover rounded-xl"
          />
        ) : (
          <div className="w-full h-40 bg-blue-500 rounded-xl flex items-center justify-center text-white text-3xl font-bold">
            BRAINKET
          </div>
        )}
        <div className="mt-4 text-xl font-semibold">{quiz?.title}</div>
        <div className="text-gray-600">{quiz?.description}</div>
      </div>

      <div className="mt-6 space-y-4">
        <div className="flex gap-2">
          <div className="shadow border rounded-xl w-53 h-12 flex items-center justify-center text-xl font-bold">
            {questions.length} Questions
          </div>
          <Button
            onClick={deleteAll}
            className="w-53 h-12 bg-[#ec2c55] text-white
            rounded-xl font-bold text-lg
            flex items-center justify-center gap-2
            shadow-[0_5px_0_#3B1FCC] hover:bg-[#ff5252]
             hover:-translate-y-1 active:translate-y-1   
            relative -right-2 transition-all"
          >
            <Trash /> Delete All Questions
          </Button>
        </div>

        <Dialog>
          <DialogTrigger className="bg-[#4169E1] text-white rounded-2xl font-semibold text-xl h-12 px-6 shadow-[0_4px_0_#27408B] hover:-translate-y-1 hover:shadow-[0_6px_0_#27408B]">
            Add Question
          </DialogTrigger>

          <DialogContent className="p-8 w-900">
            <DialogHeader>
              <DialogTitle>Add Question</DialogTitle>
            </DialogHeader>

            <Input
              placeholder="Type your question here..."
              className="h-20 text-lg font-semibold"
              value={question}
              onChange={(e) => setQuestion(e.target.value)}
            />
            <div className="text-gray-800 font-bold">Time Limit</div>

            <Input
              type="number"
              placeholder="Timer (seconds)"
              value={timer}
              onChange={(e) => setTimer(Number(e.target.value))}
            />

            <div className="grid grid-cols-2 gap-4 mt-4">
              {options.map((opt, index) => {
                const colors = [
                  "bg-red-500",
                  "bg-blue-500",
                  "bg-yellow-400",
                  "bg-green-500",
                ];

                return (
                  <div
                    key={index}
                    className={`${colors[index]}
                    h-50
                    px-2
                    py-2
                    rounded-2xl
                    flex items-center gap-4
                    shadow-md
                    hover:scale-[1.02]
                    transition`}
                  >
                    <Checkbox
                      checked={opt.isCorrect}
                      onCheckedChange={() => setCorrectOption(index)}
                    />
                    <Input
                      className="bg-white text-black h-35 w-70 text-lg font-medium"
                      placeholder={`Option ${index + 1}`}
                      value={opt.text}
                      onChange={(e) => updateOptionText(index, e.target.value)}
                    />
                  </div>
                );
              })}
            </div>

            <div className="flex justify-end gap-4 mt-6">
              <DialogClose asChild>
                <Button
                  variant="outline"
                  className="flex items-center gap-2 text-gray-500"
                >
                  {" "}
                  <X /> Cancel
                </Button>
              </DialogClose>

              <button
                onClick={createQuestion}
                className="flex items-center gap-2 bg-blue-600 text-white px-4 py-2 rounded-xl"
              >
                <Save /> Save
              </button>
            </div>
          </DialogContent>
        </Dialog>
      </div>
      <div>
        {questions.map((question, index) => {
          return (
            <div
              key={index}
              className="border-2 border-gray-400 w-full rounded-lg p-5 mt-2 shadow-xl flex"
            >
              <div>
                <div className="-mt-2">
                  <Button
                    className=" w-18 bg-[#492cec] text-white -ml-4
            rounded-xl font-bold text-lg py-3 px-4
            flex items-center justify-center gap-2
            shadow-[0_5px_0_#3B1FCC] hover:bg-[#6A52FF]
             hover:-translate-y-1 active:translate-y-1   
            relative -right-2 transition-all"
                  >
                    <span>
                      {" "}
                      <PenLine />
                    </span>
                    Edit{" "}
                  </Button>
                  <Button
                    onClick={() => deleteQuestion(question.id)}
                    className="mt-3 w-18 bg-[#ec2c55] text-white -ml-4
            rounded-xl font-bold text-lg py-3 px-4
            flex items-center justify-center gap-2
            shadow-[0_5px_0_#3B1FCC] hover:bg-[#ff5252]
             hover:-translate-y-1 active:translate-y-1   
            relative -right-2 transition-all"
                  >
                    <Trash />
                  </Button>
                </div>
              </div>
              <div className="pl-6">
                <div>Question {index + 1}</div>
                <div>{question.question}</div>
                <div>{question.id}</div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default Page;
