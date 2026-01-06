"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { Input } from "@/components/ui/input";
import { Checkbox } from "@/components/ui/checkbox";
import { PenLine } from "lucide-react";
import { Trash2 } from "lucide-react";
import SideBar from "@/app/teacher/_components/SideBar";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Save, X } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import UserMenu from "@/app/_component/UserMenu";

type Questions = {
  id: string;
  quizId: string;
  question: string;
  timer: string;
  options: Option[];
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

  const [openQuestionId, setOpenQuestionId] = useState<string | null>(null);
  const [editingQuestionId, setEditingQuestionId] = useState<string | null>(
    null
  );

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
    setQuestions(data.questions ?? []);
  };

  const toggleQuestion = (id: string) => {
    setOpenQuestionId((prev) => (prev === id ? null : id));
  };

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
      setTimer(20);
      setOptions(options.map(() => ({ text: "", isCorrect: false })));
      getQuiz();
    } else {
      const data = await res.json();
      toast.error(data.error || "Failed to create question");
    }
  };

  const deleteAll = async () => {
    const response = await fetch("/api/delete-allQuestions", {
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
      getQuiz();
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

  useEffect(() => {
    const fetchData = async () => await getQuiz();
    fetchData();
  }, [quizId]);

  const updateQuestion = async (editQuestionId: string) => {
    const response = await fetch("/api/updateQuestion", {
      method: "PUT",
      headers: {
        "Content-type": "application/json",
      },
      body: JSON.stringify({
        editQuestionId,
        newQuestion: question,
        newTimer: timer,
        newOptions: options,
      }),
    });
    if (response.ok) {
      toast.success("Question updated successfully.");
      setEditingQuestionId(null);
      setQuestion("");
      getQuiz();
      setTimer(20);
      setOptions(options.map(() => ({ text: "", isCorrect: false })));
      getQuiz();
    }
  };

  return (
    <div className="min-h-screen flex bg-[#f4f6ff]">
      <SideBar />

      <div className="flex flex-col p-8 w-full">
        <div className="mb-6">
          <h1 className="text-5xl font-bold text-gray-900">Add Questions</h1>
          <div className="mt-4 h-[2px] bg-gray-300 rounded -mx-8" />
        </div>
        <div className="flex">
          <div className="border shadow-xl rounded-2xl p-5 w-80 bg-white h-80 flex flex-col">
            {quiz?.coverImg ? (
              <img
                src={quiz.coverImg}
                className="w-full h-40 object-cover rounded-xl"
              />
            ) : (
              <div
                className="w-full h-40 bg-gradient-to-br from-[#0BC2CF] to-[#09AEB9]
              rounded-xl flex items-center justify-center text-white text-3xl
              font-extrabold tracking-wide"
              >
                BRAINKET
              </div>
            )}

            <div className="flex flex-col items-center text-center mt-4 flex-1">
              <div className="text-2xl font-bold line-clamp-1">
                {quiz?.title}
              </div>
              <div className="text-gray-500 text-sm mt-1 line-clamp-2">
                {quiz?.description}
              </div>
            </div>

            <div className="flex gap-2 mt-6">
              <div
                className="flex-1 border rounded-xl h-12 flex items-center justify-center
              text-sm font-semibold bg-gray-50"
              >
                {questions.length} Questions
              </div>

              <Button
                onClick={deleteAll}
                className="flex-1 h-12 bg-[#ec2c55] text-white rounded-xl
              font-semibold text-sm flex items-center justify-center gap-2
              shadow-[0_4px_0_#b81f40] transition-all duration-300 ease-out
              hover:bg-[#ff4d6d] hover:-translate-y-0.5 hover:shadow-[0_8px_20px_rgba(236,44,85,0.45)]
              active:translate-y-0 active:shadow-[0_3px_0_#b81f40]"
              >
                <Trash2 size={18} />
                Delete
              </Button>
            </div>
          </div>

          <Dialog>
            <div className="flex flex-col items-center gap-4 pl-8 w-full">
              <DialogTrigger
                className="w-full h-12 bg-[#0BC2CF] text-white  
          rounded-xl font-bold text-lg py-3 px-4
          flex items-center justify-center gap-2
          shadow-[0_5px_0_#088d96] hover:bg-[#0bd5e3]
           hover:-translate-y-1 active:translate-y-1   
          relative -right-2 transition-all"
                onClick={() => {
                  setEditingQuestionId(null);
                  setQuestion("");
                  setTimer(20);
                  setOptions([
                    { text: "", isCorrect: false },
                    { text: "", isCorrect: false },
                    { text: "", isCorrect: false },
                    { text: "", isCorrect: false },
                  ]);
                }}
              >
                + Add Question
              </DialogTrigger>

              <div className="w-full ml-4">
                {questions.map((question, index) => {
                  const isOpen = openQuestionId === question.id;
                  return (
                    <div
                      key={question.id}
                      className="border-2 border-gray-300 rounded-xl p-5 mt-3 shadow-md transition-all duration-200 hover:shadow-lg hover:scale-[1.02]"
                    >
                      <div
                        className="flex justify-between cursor-pointer"
                        onClick={() => toggleQuestion(question.id)}
                      >
                        <div className="flex flex-col gap-5 ">
                          <div className="flex gap-8">
                            <div className="font-extralight">
                              Question {index + 1}
                            </div>
                            <div className="text-sm bg-gray-200 px-2 py-1 rounded-full font-extralight w-9 h-7">
                              {question.timer}s
                            </div>
                          </div>
                          <div className="text-gray-800 font-extrabold text-4xl break-all p-2">
                            {question.question}
                          </div>
                        </div>

                        <div className="flex flex-col gap-3">
                          <Button
                            onClick={() => deleteQuestion(question.id)}
                            className=" w-18 bg-[#ec2c55] text-white rounded-xl
              font-semibold text-sm flex items-center justify-center gap-2
              shadow-[0_4px_0_#b81f40] transition-all duration-300 ease-out
              hover:bg-[#ff4d6d] hover:-translate-y-0.5 hover:shadow-[0_8px_20px_rgba(236,44,85,0.45)]
              active:translate-y-0 active:shadow-[0_3px_0_#b81f40]"
                          >
                            {" "}
                            <Trash2 />{" "}
                          </Button>
                          <DialogTrigger
                            onClick={() => {
                              setEditingQuestionId(question.id);
                              setQuestion(question.question);
                              setTimer(20);
                              setOptions(question.options);
                            }}
                            className=" w-19 h-9 bg-[#0BC2CF] text-white   rounded-xl
              font-semibold text-sm flex items-center justify-center gap-2
               transition-all duration-300 ease-out
              shadow-[0_5px_0_#088d96] hover:bg-[#0bd5e3] hover:-translate-y-0.5
              hover:shadow-[0_8px_20px_rgba(236,44,85,0.45)]
              active:translate-y-0 active:shadow-[0_3px_0_#b81f40]"
                          >
                            <span>
                              {" "}
                              <PenLine />{" "}
                            </span>{" "}
                            Edit{" "}
                          </DialogTrigger>
                        </div>
                      </div>

                      {isOpen && (
                        <div className="grid grid-cols-2 gap-4 mt-5">
                          {question.options.map((opt, index) => {
                            const colors = opt.isCorrect
                              ? "bg-green-500"
                              : "bg-gray-200";

                            return (
                              <div
                                key={index}
                                className={`${colors} p-4 rounded-xl flex items-center gap-3`}
                              >
                                <span className="text-xl">
                                  {opt.isCorrect ? "✔️" : "✖️"}
                                </span>
                                <span
                                  className={`${
                                    opt.isCorrect
                                      ? "text-white"
                                      : "text-gray-800"
                                  } font-medium`}
                                >
                                  {opt.text}
                                </span>
                              </div>
                            );
                          })}
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>
            <DialogContent className="p-8 w-900">
              <DialogHeader>
                <DialogTitle className="font-bold">
                  {" "}
                  {editingQuestionId ? "Edit Question" : "Add Question"}
                </DialogTitle>
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
                        className="ml-2"
                        checked={opt.isCorrect}
                        onCheckedChange={() => setCorrectOption(index)}
                      />
                      <Input
                        className="bg-white text-black h-40 w-70 text-lg font-medium"
                        placeholder={`Option ${index + 1}`}
                        value={opt.text}
                        onChange={(e) =>
                          updateOptionText(index, e.target.value)
                        }
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
                  onClick={() => {
                    if (editingQuestionId) {
                      updateQuestion(editingQuestionId);
                    } else {
                      createQuestion();
                    }
                  }}
                  className="flex items-center gap-2 bg-[#0BC2CF] text-white px-4 py-2 rounded-xl"
                >
                  <div>
                    <DialogClose asChild>
                      <div className="flex">
                        <Save /> {editingQuestionId ? "Update" : "Save"}
                      </div>
                    </DialogClose>
                  </div>
                </button>
              </div>
            </DialogContent>
          </Dialog>
        </div>
      </div>
    </div>
  );
};

export default Page;
