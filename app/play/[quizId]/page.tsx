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
  timer: number;
};

type Quiz = {
  id: string;
  title: string;
  questions: Question[];
};

type Result = {
  score: number;
  quizId: string;
};

const colors = ["bg-orange-400", "bg-blue-500", "bg-green-500", "bg-red-500"];

export default function Page() {
  const params = useParams();
  const quizId = params.quizId as string;
  const { user: clerkUser } = useUser();
  const clerkId = clerkUser?.id;
  const { user } = useAuth(clerkId ?? "");
  const studentId = user?.id;

  console.log("Student ID:", studentId);
  const [quiz, setQuiz] = useState<Quiz | null>(null);
  const [timer, setTimer] = useState(0);
  const [count, setCount] = useState(0);
  const [pageLoading, setPageLoading] = useState(true);
  const [answerLoading, setAnswerLoading] = useState(false);

  const [score, setScore] = useState(0);
  const [attemptId, setAttemptId] = useState<string>("");
  const [answered, setAnswered] = useState(false);
  const [finished, setFinished] = useState(false);
  const [quizResult, setQuizResult] = useState<Result | null>(null);

  useEffect(() => {
    const fetchQuiz = async () => {
      const res = await fetch(`/api/quizCreate/${quizId}`);
      const data = await res.json();
      setQuiz(data);
      if (data.questions?.length) setTimer(data.questions[0].timer);
      setPageLoading(false);
    };
    fetchQuiz();
  }, [quizId]);

  useEffect(() => {
    if (!studentId || !quizId) return;
    const createAttempt = async () => {
      setPageLoading(true);
      const res = await fetch("/api/student-quizattempt", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ studentId, quizId, score }),
      });
      const data = await res.json();
      setAttemptId(data.id);
      setPageLoading(false);
    };
    createAttempt();
  }, [studentId, quizId]);

  const studentAnswer = async (
    questionId: string,
    optionId: string,
    isCorrect: boolean
  ) => {
    if (!attemptId || answered) return;

    setAnswered(true);
    setAnswerLoading(true);

    await fetch("/api/student-answerattempt", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ attemptId, questionId, optionId }),
    });

    if (isCorrect) {
      await fetch("/api/update-attempt", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ attemptId }),
      });
      setScore((prev) => prev + 1);
    }

   
    goToNextQuestion();

    setAnswered(false);
    setAnswerLoading(false);
  };

  const goToNextQuestion = () => {
    if (!quiz) return;

  
    if (count + 1 >= quiz.questions.length) {
      setFinished(true);
      fetchQuizResult();
      setTimer(0);
      return;
    }

 
    const next = count + 1;
    setCount(next);
    setTimer(quiz.questions[next].timer);
  };

  useEffect(() => {
    if (finished || timer <= 0) return;

    const interval = setInterval(() => {
      setTimer((t) => {
        if (t <= 1) {
          clearInterval(interval);
          goToNextQuestion(); 
          return 0;
        }
        return t - 1;
      });
    }, 1000);

    return () => clearInterval(interval);
  }, [timer, finished, count, quiz]);
  const fetchQuizResult = async () => {
    if (!attemptId) return;
    const res = await fetch(`/api/quizResult/${attemptId}`);
    const data = await res.json();
    setQuizResult(data);
  };

  console.log(attemptId, "a");
  if (pageLoading)
    return (
      <div className="flex justify-center items-center h-screen">
        <Spinner className="w-16 h-16" />
      </div>
    );

  const question = quiz?.questions[count];

  if (!question) return null;

  console.log(quizResult);
  return (
    <div className="h-screen flex flex-col bg-gray-50 p-4">
      <div className="h-12 bg-purple-600 flex items-center justify-between px-4 rounded-lg">
        <h1 className="text-2xl md:text-3xl font-bold text-white">
          {quiz?.title}
        </h1>
        <div className="flex items-center gap-2 text-xl font-semibold text-white">
          <Timer className="w-6 h-6" /> {timer}s
        </div>
      </div>

      <div className="flex-1 flex flex-col items-center justify-center mt-6">
        <div className="bg-white p-6 rounded-xl shadow-lg w-full max-w-3xl text-center text-2xl md:text-3xl font-semibold mb-6">
          {question?.question}
        </div>

        {timer === 0 ? (
          <div className="text-center mt-10">
            <h2 className="text-4xl font-bold mb-4">Quiz дууслаа!</h2>
            <p className="text-2xl mb-2">
              {quiz?.questions.length} асуултаас {quizResult?.score} оноо авлаа
            </p>
            <p className="text-xl text-gray-600">
              Та өөрийн оноогоо сервер дээр хадгалсан.
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-60 w-full max-w-3xl ">
            {question?.options.map((opt, i) => (
              <button
                key={opt.id}
                disabled={answered || answerLoading}
                onClick={() =>
                  studentAnswer(question.id, opt.id, opt.isCorrect)
                }
                className={`${colors[i]} text-white text-2xl md:text-3xl font-bold rounded-xl p-6 shadow-md hover:scale-105 transition transform disabled:opacity-50 disabled:cursor-not-allowed w-[400px] h-[400px] mr-20`}
              >
                {opt.text}
              </button>
            ))}
          </div>
        )}
      </div>

      {pageLoading && (
        <div className="absolute inset-0 flex justify-center items-center bg-white/70 z-50">
          <strong className="text-5xl flex flex-col items-center">
            loading...
            <Spinner className="w-10 h-10 mt-4" />
          </strong>
        </div>
      )}
    </div>
  );
}
