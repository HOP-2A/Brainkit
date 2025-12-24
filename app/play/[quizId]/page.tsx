"use client";
import { useParams } from "next/navigation";
import { useEffect, useState } from "react";
import { Timer } from "lucide-react";
import { useAuth } from "@/providers/useAuth";
import { useUser } from "@clerk/nextjs";
import { Spinner } from "@/components/ui/spinner";

type Option = {
  id: string;
  text: string;
  isCorrect: boolean;
};

type Question = {
  id: string;
  question: string;
  options: Option[];
};

type Quiz = {
  id: string;
  title: string;
  questions: Question[];
};

const colors = ["bg-orange-400", "bg-blue-500", "bg-green-500", "bg-red-500"];

export default function Page() {
  const params = useParams();
  const quizId = params.quizId as string;
  const { user: clerkUser } = useUser();
  const clerkId = clerkUser?.id;
  const { user } = useAuth(clerkId ?? "");
  const studentId = user?.id;

  const [quiz, setQuiz] = useState<Quiz | null>(null);
  const [timer, setTimer] = useState(0);
  const [count, setCount] = useState(0);
  const [loading, setLoading] = useState(false);
  const [score, setScore] = useState(0);
  const [attemptId, setAttemptId] = useState<string>("");

  useEffect(() => {
    const fetchQuiz = async () => {
      const res = await fetch(`/api/quizCreate/${quizId}`);
      const data = await res.json();
      setQuiz(data);
      if (data.questions?.length) setTimer(data.questions[0].timer);
      setLoading(false);
    };
    fetchQuiz();
  }, [quizId]);

  useEffect(() => {
    if (!studentId || !quizId) return;
    const createAttempt = async () => {
      setLoading(true);
      const res = await fetch("/api/student-attempt", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ studentId, quizId }),
      });
      const data = await res.json();
      setAttemptId(data.id);
      setLoading(false);
    };
    createAttempt();
  }, [studentId, quizId]);

  const studentAnswer = async (
    questionId: string,
    optionId: string,
    isCorrect: boolean
  ) => {
    if (!attemptId) return;
    setLoading(true);

    await fetch("/api/student-answerattempt", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ attemptId, questionId, optionId }),
    });

    if (isCorrect) setScore((prev) => prev + 1);

    if (count + 1 < (quiz?.questions.length || 0)) {
      setCount(count + 1);
      setTimer(quiz!.questions[count + 1].timer);
    } else {
      setTimer(0);
    }

    setLoading(false);
  };

  useEffect(() => {
    if (!quiz?.questions?.length || timer <= 0) return;
    const interval = setInterval(() => setTimer((prev) => prev - 1), 1000);
    return () => clearInterval(interval);
  }, [timer, quiz]);

  if (loading)
    return (
      <div>
        <strong className="text-5xl flex justify-center items-center text-center h-screen">
          loading...
          <Spinner className="size-10 " />
        </strong>
      </div>
    );

  const question = quiz?.questions[count];

  const question = quiz.questions[0];
  return (
    <div className="h-screen flex flex-col bg-white">
      <div className="h-12 bg-purple-600 flex items-center justify-between px-4"></div>

      <div className="flex-1 flex items-center justify-center text-4xl font-semibold">
        {question?.question}
      </div>
      <div className=" flex items-center justify-center text-4xl font-semibold border rounded-md h-30 w-90 bg-gray-500 ml-2 ">
        <Timer className="size-9" /> Time: {timer}(seconds)
      </div>

      <div className="h-[45%] grid grid-cols-2 grid-rows-2 gap-2 p-2">
        {question.options.map((opt, i) => (
          <button
            key={opt.id}
            onClick={() => studentAnswer(question.id, opt.id, opt.isCorrect)}
            className={`${colors[i]} text-white text-3xl font-semibold rounded-md flex items-center justify-center cursor-pointer
          transition-all
          hover:-translate-y-1 
          active:translate-y-1 active:shadow-[0_1px_0_#27408B]"`}
          >
            {opt.text}
            <div className="bg-amber-200">
              {opt.isCorrect === true ? (
                <div className="bg-green-400">correct</div>
              ) : (
                <div className="bg-red-500"> false</div>
              )}
            </div>
          </button>
        ))}
      </div>
    </div>
  );
}
