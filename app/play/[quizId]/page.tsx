"use client";
import { useParams } from "next/navigation";
import { useEffect, useState } from "react";

type Option = {
  id: string;
  text: string;
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

  const [quiz, setQuiz] = useState<Quiz | null>(null);

  useEffect(() => {
    const fetchQuiz = async () => {
      const res = await fetch(`/api/quizCreate/${quizId}`);
      const data = await res.json();
      setQuiz(data);
    };
    fetchQuiz();
  }, [quizId]);

  if (!quiz) return null;

  const question = quiz.questions[0];
  return (
    <div className="h-screen flex flex-col bg-white">
      <div className="h-12 bg-purple-600 flex items-center justify-between px-4"></div>

      <div className="flex-1 flex items-center justify-center text-4xl font-semibold">
        {question.question}
      </div>

      <div className="h-[45%] grid grid-cols-2 grid-rows-2 gap-2 p-2">
        {question.options.map((opt, i) => (
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
