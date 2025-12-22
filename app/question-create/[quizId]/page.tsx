"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { Input } from "@/components/ui/input";
import { Checkbox } from "@/components/ui/checkbox";
<<<<<<< HEAD
import { PenLine } from "lucide-react";
import { Trash } from "lucide-react";
import {
  Dialog,
  DialogClose,
=======
import {
  Dialog,
>>>>>>> e42c12f (question frontend)
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Save, X } from "lucide-react";
import SideBar from "@/app/_components/SideBar";
import { toast } from "sonner";
<<<<<<< HEAD
import { Button } from "@/components/ui/button";

type Questions = {
  id: string;
  quizId: string;
  question: string;
  timer: string;
  options: Option[];
=======

type Questions = {
  id: string;
  title: string;
  description: string;
  creatorId: string;
>>>>>>> e42c12f (question frontend)
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
<<<<<<< HEAD
  const [mounted, setMounted] = useState(false);
  const [openQuestionId, setOpenQuestionId] = useState<string | null>(null);
  const [editingQuestionId, setEditingQuestionId] = useState<string | null>(
    null
  );
=======
>>>>>>> e42c12f (question frontend)

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
<<<<<<< HEAD
=======

>>>>>>> e42c12f (question frontend)
  const getQuiz = async () => {
    const res = await fetch(`/api/quizCreate/${quizId}`);
    if (!res.ok) return;
    const data: Quiz = await res.json();
    setQuiz(data);
<<<<<<< HEAD
    setQuestions(data.questions ?? []);
  };

  const toggleQuestion = (id: string) => {
    setOpenQuestionId((prev) => (prev === id ? null : id));
=======
    setQuestions(data.questions);
>>>>>>> e42c12f (question frontend)
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
<<<<<<< HEAD
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

=======
      setOptions(options.map(() => ({ text: "", isCorrect: false })));
      getQuiz();
    } else {
      toast.error("Failed to create question");
    }
  };

>>>>>>> e42c12f (question frontend)
  useEffect(() => {
    const fetchData = async () => await getQuiz();
    fetchData();
  }, [quizId]);

<<<<<<< HEAD
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
  const startAdd = () => {
    setEditingQuestionId(null);
    setQuestion("");
    setTimer(20);
    setOptions([
      { text: "", isCorrect: false },
      { text: "", isCorrect: false },
      { text: "", isCorrect: false },
      { text: "", isCorrect: false },
    ]);
  };

  useEffect(() => {
    setMounted(true);
  }, []);

=======
>>>>>>> e42c12f (question frontend)
  return (
    <div className="flex gap-20">
      <SideBar />

<<<<<<< HEAD
      <div className="border shadow-lg rounded-xl p-5 w-80 bg-white h-80">
=======
      <div className="border shadow-lg rounded-xl p-5 w-80 bg-white">
>>>>>>> e42c12f (question frontend)
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

<<<<<<< HEAD
      <div className="mt-6 space-y-4 ml-25">
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
        {mounted && (
          <Dialog>
            <DialogTrigger
              className="bg-[#4169E1] text-white rounded-2xl font-semibold text-xl h-12 px-6 shadow-[0_4px_0_#27408B] hover:-translate-y-1 hover:shadow-[0_6px_0_#27408B]"
              onClick={() => {
                startAdd;
              }}
            >
              Add Question
            </DialogTrigger>
            <div className="mr-8">
              {questions.map((question, index) => {
                const isOpen = openQuestionId === question.id;
                return (
                  <div
                    key={question.id}
                    className="border-2 border-gray-300 rounded-xl p-5 mt-3 shadow-lg hover:shadow-blue-500"
                  >
                    <div
                      className="flex justify-between items-center cursor-pointer"
                      onClick={() => toggleQuestion(question.id)}
                    >
                      <div>
                        <div className="flex gap-5">
                          <div className="font-semibold">
                            Question {index + 1}
                          </div>
                          <div className="text-sm bg-gray-200 px-2 py-1 rounded-full w-9 h-7 -mt-1">
                            {question.timer}s
                          </div>
                        </div>
                        <div className="text-gray-800">{question.question}</div>
                      </div>

                      <div>
                        <Button
                          onClick={() => deleteQuestion(question.id)}
                          className="mt-3 w-18 bg-[#ec2c55] text-white rounded-xl font-bold text-lg py-3 px-4 flex items-center justify-center gap-2 shadow-[0_5px_0_#3B1FCC] hover:bg-[#ff5252] hover:-translate-y-1 active:translate-y-1 relative -right-2 transition-all"
                        >
                          {" "}
                          <Trash />{" "}
                        </Button>
                        <DialogTrigger
                          onClick={() => {
                            setEditingQuestionId(question.id);
                            setQuestion(question.question);
                            setTimer(20);
                            setOptions(question.options);
                          }}
                          className=" w-19 h-10 bg-[#492cec] text-white
                          rounded-xl font-bold text-lg py-3 px-4 flex
                          items-center justify-center gap-2
                          shadow-[0_5px_0_#3B1FCC] hover:bg-[#6A52FF]
                          hover:-translate-y-1 active:translate-y-1 relative
                          -right-2 transition-all mt-4"
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
                                  opt.isCorrect ? "text-white" : "text-gray-800"
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
            <DialogContent className="p-8 w-900">
              <DialogHeader>
                <DialogTitle>
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
=======
      <div className="mt-6 space-y-4">
        <div className="shadow border rounded-xl w-52 h-12 flex items-center justify-center text-xl font-bold">
          {questions.length} Questions
        </div>

        <Dialog>
          <DialogTrigger className="bg-[#4169E1] text-white rounded-2xl font-semibold text-xl h-12 px-6 shadow-[0_4px_0_#27408B] hover:-translate-y-1 hover:shadow-[0_6px_0_#27408B]">
            Add Question
          </DialogTrigger>

          <DialogContent className="max-w-5xl p-8">
            <DialogHeader>
              <DialogTitle>Add Question</DialogTitle>
            </DialogHeader>

            <Input
              placeholder="Type your question here..."
              className="h-20 text-lg font-semibold"
              value={question}
              onChange={(e) => setQuestion(e.target.value)}
            />

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
>>>>>>> e42c12f (question frontend)
                    h-50
                    px-2
                    py-2
                    rounded-2xl
                    flex items-center gap-4
                    shadow-md
                    hover:scale-[1.02]
                    transition`}
<<<<<<< HEAD
                    >
                      <Checkbox
                        checked={opt.isCorrect}
                        onCheckedChange={() => setCorrectOption(index)}
                      />
                      <Input
                        className="bg-white text-black h-35 w-70 text-lg font-medium"
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
                  className="flex items-center gap-2 bg-blue-600 text-white px-4 py-2 rounded-xl"
                >
                  <Save /> {editingQuestionId ? "Update" : "Save"}
                </button>
              </div>
            </DialogContent>
          </Dialog>
        )}
=======
                  >
                    <Checkbox
                      checked={opt.isCorrect}
                      onCheckedChange={() => setCorrectOption(index)}
                    />
                    <Input
                      className="bg-white text-black h-20 w-50 text-lg font-medium"
                      placeholder={`Option ${index + 1}`}
                      value={opt.text}
                      onChange={(e) => updateOptionText(index, e.target.value)}
                    />
                  </div>
                );
              })}
            </div>

            <div className="flex justify-end gap-4 mt-6">
              <button className="flex items-center gap-2 text-gray-500">
                <X /> Cancel
              </button>
              <button
                onClick={createQuestion}
                className="flex items-center gap-2 bg-blue-600 text-white px-4 py-2 rounded-xl"
              >
                <Save /> Save
              </button>
            </div>
          </DialogContent>
        </Dialog>
>>>>>>> e42c12f (question frontend)
      </div>
    </div>
  );
};

export default Page;
