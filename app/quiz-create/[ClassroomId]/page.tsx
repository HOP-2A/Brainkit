"use client";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Trash2 } from "lucide-react";
import { useState } from "react";
import { Input } from "@/components/ui/input";

const Page = () => {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [Quiz, setQuiz] = useState([
    { id: 1, title: "Quiz Name", description: "Quiz description" },
  ]);

  const handleCreate = async () => {
    try {
      const res = await fetch("/api/quizCreate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          title,
          description,
          creatorId: "p6W6kKgN_YmoA9_lKDLJv",
          classroomId: "vr8yXSL4XoZ3Y8r8Szx_J",
        }),
      });

      if (!res.ok) {
        console.log("Failed to create quiz");
        return;
      }

      console.log("quiz vvsgegdleao");
    } catch (err) {
      console.log("aldaa garso");
    }
  };

  return (
    <div className="flex w-full">
      {/* LEFT CARD LIKE BLOOKET */}
      <div className="border shadow-lg rounded-xl p-5 w-80 bg-white ml-10 mt-10">
        <div className="w-full h-40 bg-blue-500 rounded-xl flex justify-center items-center text-white text-3xl font-bold">
          BRAINKET
        </div>

        <div className="mt-4 text-xl font-semibold">classname</div>
        <div className="text-gray-600">description</div>
      </div>

      {/* RIGHT SIDE CONTENT */}
      <div className="flex-1 px-10 mt-10">
        {/* TOP CONTROLS */}
        <div className="flex justify-center gap-4">
          <div className="shadow-lg border rounded-xl w-40 h-12 items-center flex justify-center text-xl font-bold">
            {Quiz?.length ?? 0} Quizzes
          </div>

          <Dialog>
            <DialogTrigger>
              <button
                className="bg-[#4169E1] w-40 text-white rounded-2xl font-semibold 
                text-xl h-12 px-6 cursor-pointer
                shadow-[0_4px_0_#27408B] transition-all
                hover:-translate-y-1 hover:shadow-[0_6px_0_#27408B]
                active:translate-y-1 active:shadow-[0_1px_0_#27408B]"
              >
                Add Quiz
              </button>
            </DialogTrigger>

            <DialogContent>
              <DialogHeader>
                <DialogTitle className="text-2xl font-bold">
                  Quiz Creator
                </DialogTitle>
              </DialogHeader>

              <div className="mt-3 flex flex-col gap-4">
                <div className="flex flex-col gap-1">
                  <strong>Title</strong>
                  <Input
                    placeholder="Add a descriptive title"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                  />
                </div>

                <div className="flex flex-col gap-1">
                  <strong>Description</strong>
                  <Input
                    placeholder="Tell users about your quiz"
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                  />
                </div>

                <div className="border shadow-md p-4 rounded-xl">
                  <strong>Cover Image</strong>
                  <input type="file" accept="image/*" className="mt-2" />
                </div>

                <button
                  onClick={handleCreate}
                  className="bg-[#4169E1] w-40 mx-auto text-white rounded-2xl font-semibold 
                  text-xl h-12 px-6 cursor-pointer
                  shadow-[0_4px_0_#27408B] transition-all
                  hover:-translate-y-1 hover:shadow-[0_6px_0_#27408B]
                  active:translate-y-1 active:shadow-[0_1px_0_#27408B]"
                >
                  Create
                </button>
              </div>
            </DialogContent>
          </Dialog>
        </div>

        <div className="mt-12 flex flex-col gap-5 w-[70%] mx-auto">
          {Quiz.map((q) => (
            <div
              key={q.id}
              className="border shadow-md p-4 rounded-xl flex justify-between items-center"
            >
              <div>
                <strong className="text-xl">{q.title}</strong>
                <div className="text-gray-600">{q.description}</div>
              </div>

              <div className="flex gap-4 items-center">
                <button className="bg-gray-500 text-white rounded-xl px-6 py-2 font-semibold">
                  Edit
                </button>

                <Trash2 className="cursor-pointer text-red-500" />
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Page;
