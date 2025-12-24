"use client";
import { useParams } from "next/navigation";
import { useState, useEffect } from "react";

const Page = () => {
  const [quiz, setQuiz] = useState<Quiz | null>(null);
  const [questions, setQuestions] = useState<Question[]>([]);
  const params = useParams();
  const quizId = params.quizId as string;

  const GetQuiz = async () => {
    try {
      const res = await fetch(`/api/quizCreate/${quizId}`);
      if (!res.ok) return;

      const data: Quiz = await res.json();
      setQuiz(data);
      setQuestions(data.questions);
    } catch (err) {
      console.log("Error fetching quiz", err);
    }
  };

  useEffect(() => {
    if (quizId) GetQuiz();
  }, [quizId]);

  if (!quiz) return <div className="text-center mt-20">Loading...</div>;

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-500 to-purple-600 p-6">
      <h1 className="text-4xl font-bold text-white text-center mb-10">
        {quiz.title}
      </h1>

      <div className="max-w-3xl mx-auto space-y-8">
        {questions.map((q, index) => (
          <div key={q.id} className="bg-white rounded-2xl shadow-xl p-6">
            <h2 className="text-2xl font-semibold mb-6">{q.question}</h2>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {q.options.map((opt) => (
                <button
                  key={opt.id}
                  className="bg-indigo-100 hover:bg-indigo-200 transition rounded-xl p-4 text-lg font-medium text-indigo-900 shadow"
                >
                  {opt.text}
                </button>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Page;
