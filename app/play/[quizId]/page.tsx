"use client";
import { useParams } from "next/navigation";
import { useEffect, useState } from "react";

import { Spinner } from "@/components/ui/spinner";
type Option = {
  id: string;
  text: string;
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

const colors = ["bg-orange-400", "bg-blue-500", "bg-green-500", "bg-red-500"];

export default function Page() {
  const params = useParams();
  const quizId = params.quizId as string;

  const [quiz, setQuiz] = useState<Quiz | null>(null);
  const [timer, setTimer] = useState(0);
  const [count, setCount] = useState(0);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchQuiz = async () => {
      setLoading(true);
      const res = await fetch(`/api/quizCreate/${quizId}`);
      const data = await res.json();
      setQuiz(data);
      if (data.questions?.length) {
        setTimer(data.questions[0].timer);
      }
      setLoading(false);
    };
    fetchQuiz();
  }, [quizId]);

  useEffect(() => {
    if (!quiz?.questions?.length) return;
    if (timer === 0) return;

    const interval = setInterval(() => {
      setTimer((prevTimer) => prevTimer - 1);
    }, 1000);

    return () => clearInterval(interval);
  }, [timer, quiz]);

  useEffect(() => {
    if (!quiz?.questions?.length) return;
    if (timer !== 0) return;

    const id = setTimeout(() => {
      setCount((prevCount) => {
        const nextCount = prevCount + 1;
        if (nextCount >= quiz.questions.length) return prevCount;
        return nextCount;
      });
    }, 0);

    return () => clearTimeout(id);
  }, [timer, quiz]);
  useEffect(() => {
    if (!quiz?.questions?.length) return;

    let currentCount = count;
    let currentTimer = timer;

    const interval = setInterval(() => {
      if (currentTimer > 1) {
        currentTimer -= 1;
        setTimer(currentTimer);
      } else {
        if (currentCount + 1 < quiz.questions.length) {
          currentCount += 1;
          setCount(currentCount);
          currentTimer = quiz.questions[currentCount].timer;
          setTimer(currentTimer);
        } else {
          clearInterval(interval);
          setTimer(0);
        }
      }
    }, 1000);

    return () => clearInterval(interval);
  }, [quiz]);

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

  return (
    <div className="h-screen flex flex-col bg-white">
      <div className="h-12 bg-purple-600 flex items-center justify-between px-4"></div>

      <div className="flex-1 flex items-center justify-center text-4xl font-semibold">
        {question?.question}
      </div>
      <div className=" flex items-center justify-center text-4xl font-semibold border rounded-2xl h-30 w-30 bg-yellow-900">
        {timer}
      </div>
      <div className="h-[45%] grid grid-cols-2 grid-rows-2 gap-2 p-2">
        {question?.options.map((opt, i) => (
          <button
            key={opt.id}
            className={`${colors[i]} text-white text-3xl font-semibold rounded-md flex items-center justify-center cursor-pointer
          transition-all
          hover:-translate-y-1 
          active:translate-y-1 active:shadow-[0_1px_0_#27408B]"`}
          >
            {opt.text}
          </button>
        ))}
      </div>
    </div>
  );
}
