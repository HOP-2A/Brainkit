"use client";
import { useParams } from "next/navigation";
import { useEffect, useState } from "react";
import { Timer } from "lucide-react";
import { useAuth } from "@/providers/useAuth";
import { useUser } from "@clerk/nextjs";
import { Spinner } from "@/components/ui/spinner";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

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
  const router = useRouter();
  const params = useParams();
  const quizId = params.quizId as string;
  const { user: clerkUser } = useUser();
  const clerkId = clerkUser?.id;
  const { user } = useAuth(clerkId ?? "");
  const studentId = user?.id;

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
  const [started, setStarted] = useState(false);

  useEffect(() => {
    const fetchQuiz = async () => {
      const res = await fetch(`/api/quizCreate/${quizId}`);
      const data = await res.json();
      setQuiz(data);
      setPageLoading(false);
    };
    fetchQuiz();
  }, [quizId]);

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

  useEffect(() => {
    if (!started || !studentId || !quizId) return;
    const run = () => {
      createAttempt();
    };

    run();
  }, [started, studentId, quizId]);

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
          return 0;
        }

        return t - 1;
      });
    }, 1000);

    return () => clearInterval(interval);
  }, [timer, finished, count, quiz]);

  useEffect(() => {
    if (timer !== 0 || finished) return;

    const timeout = setTimeout(() => {
      goToNextQuestion();
    }, 3000);

    return () => clearTimeout(timeout);
  }, [timer, finished]);

  const fetchQuizResult = async () => {
    if (!attemptId) return;
    const res = await fetch(`/api/quizResult/${attemptId}`);
    const data = await res.json();
    setQuizResult(data);
  };

  if (!studentId || !quizId) {
    return (
      <div className="flex justify-center items-center h-screen">
        <Spinner />
      </div>
    );
  }
  if (pageLoading)
    return (
      <div className="flex justify-center items-center h-screen">
        <Spinner className="w-16 h-16" />
      </div>
    );
  if (!started)
    return (
      <div className="min-h-screen bg-[#6ACEDF] flex flex-col">
        <div
          className="bg-[#9a49aa] text-white flex items-center justify-between px-4 sm:px-8 py-4"
          style={{ boxShadow: "0 -6px #0003 inset" }}
        >
          <span className="text-2xl sm:text-4xl font-extrabold">Brainket</span>
          <span className="hidden sm:block text-3xl font-bold">
            {quiz?.title}
          </span>
          <button
            onClick={() => router.push("/students/classroom")}
            className="sm:block text-3xl font-bold underline underline-offset-2"
          >
            Dashboard
          </button>
        </div>

        <div className="flex flex-col items-center gap-6 bg-[#6ACEDF] mt-80">
          <h1 className="text-6xl font-bold text-black">{quiz?.title}</h1>

          <button
            onClick={() => {
              setStarted(true);
              if (!quiz?.questions?.[0]) return;
              setTimer(quiz!.questions[0].timer);
            }}
            className="bg-[#9a49aa] text-white text-2xl px-10 py-4 rounded-xl hover:scale-105 transition mt-9"
          >
            Quiz эхлүүлэх
          </button>
          <img className="pb-9" src="/Classic.png" />
        </div>

        <div className="fixed bottom-0 left-0 w-full h-[284px] bg-[#E6F7F8] z-0 pointer-events-none">
          <img
            src="/penguin.gif"
            alt="penguin"
            className="absolute bg-black right-0 bottom-0 w-80 sm:w-[1000px] lg:w-[1000px]"
          />
        </div>
      </div>
    );

  const question = quiz?.questions[count];

  if (!question) return null;

  return (
    <div
      className={`h-screen flex flex-col overflow-hidden transition-colors duration-500 ${
        finished ? "bg-[#0BC2CF]" : "bg-white"
      }`}
    >
      <div
        className="bg-[#9a49aa] text-white flex items-center px-4 sm:px-8 py-4 relative"
        style={{ boxShadow: "0 -6px #0003 inset" }}
      >
        <h1 className="text-2xl md:text-3xl font-bold text-white absolute left-1/2 transform -translate-x-1/2">
          {quiz?.title}
        </h1>
        <div className="flex items-center gap-2 text-xl font-semibold ml-auto">
          <Timer className="w-6 h-6" /> {timer}s
        </div>
      </div>

      {!finished && (
        <div className="flex flex-col items-center justify-center mt-60">
          <div className="text-center text-6xl md:text-6xl font-bold mb-37 px-6">
            {question?.question}
          </div>

          {timer === 0 ? (
            <div className="text-center mt-1">
              {count + 1 < quiz!.questions.length ? (
                <div>
                  <button
                    onClick={goToNextQuestion}
                    className="bg-[#50C878] text-white text-2xl px-10 py-4 rounded-xl hover:scale-105 transition"
                  >
                    Дараагийн асуулт →
                  </button>
                  <img
                    src="/watermelon.gif"
                    className="w-[30px] h-[30px] md:w-[400px] md:h-[400px] mt-20"
                  />
                </div>
              ) : null}
            </div>
          ) : (
            <div className="grid grid-cols-2 gap-2 w-full px-2">
              {question.options.map((opt, i) => (
                <button
                  key={opt.id}
                  disabled={answered || answerLoading}
                  onClick={() =>
                    studentAnswer(question.id, opt.id, opt.isCorrect)
                  }
                  className={`${colors[i]} text-white text-3xl font-medium rounded-sm
            h-[220px] md:h-[310px] flex items-center justify-center
            hover:brightness-110 transition disabled:opacity-50`}
                >
                  {opt.text}
                </button>
              ))}
            </div>
          )}
        </div>
      )}

      {finished && (
        <div className="flex flex-col items-center justify-center h-full text-center">
          <div className="bg-white rounded-xl shadow-lg p-8 max-w-xl w-full mx-auto">
            <h1 className="text-4xl font-bold mb-4">Quiz дууслаа!</h1>
            <div className="relative flex justify-center mb-4">
              <img
                src="/pengu.gif"
                className="w-[30px] h-[30px] md:w-[200px] md:h-[200px]"
              />
            </div>

            <p className="text-xl text-gray-700 mb-6">
              {quiz?.questions.length} асуултаас {quizResult?.score} оноо авлаа
            </p>

            <div className="flex flex-col sm:flex-row gap-4 justify-center mt-4">
              <Button
                onClick={() => router.push("/students/classroom")}
                className="bg-[#9a49aa] text-white text-lg font-bold py-5 px-8
        rounded-lg shadow-[0_-6px_0_#0003_inset] hover:bg-[#9a49aa] transition-transform duration-200 ease-out
        hover:-translate-y-1 hover:shadow-[0_-6px_0_#0003_inset]"
              >
                Go To Classes
              </Button>
              <Button
                onClick={() => {
                  if (!quiz?.questions?.[0]) return;
                  setStarted(false);
                  setTimeout(() => {
                    setStarted(true);
                    setTimer(quiz!.questions[0].timer);
                    setCount(0);
                    setScore(0);
                    setFinished(false);
                    setQuizResult(null);
                  }, 0);
                }}
                className="bg-[#9a49aa] text-white text-lg font-bold py-5 px-8
        rounded-lg shadow-[0_-6px_0_#0003_inset] hover:bg-[#9a49aa]  transition-transform duration-200 ease-out
        hover:-translate-y-1 hover:shadow-[0_-6px_0_#0003_inset]"
              >
                Play Again
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
