"use client";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Trash2, ImageIcon, UploadCloud, Loader2 } from "lucide-react";
import { useParams } from "next/navigation";
import { CardContent } from "@/components/ui/card";
import { upload } from "@vercel/blob/client";
import { Button } from "@/components/ui/button";
import { useState, useEffect, ChangeEvent } from "react";
import { Input } from "@/components/ui/input";
import { useRouter } from "next/navigation";
import Link from "next/link";
type Classroom = {
  id: string;
  title: string;
  coverImg: string;
  description: string;
  quizzes: Quiz[];
  teacherId: string;
};

type Quiz = {
  id: string;
  title: string;
  description: string;
  coverImg: string;
  creatorId: string;
};

const Page = () => {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [newTitle, setNewTitle] = useState("");
  const [newDescription, setNewDescription] = useState("");
  const [quizzes, setQuizzes] = useState<Quiz[]>([]);
  const [classroom, setClassroom] = useState<Classroom | null>(null);
  const [imgFile, setImgFile] = useState<File | null>(null);
  const [imageUrl, setImageUrl] = useState("");
  const [uploading, setUploading] = useState(false);
  const [editImgFile, setEditImgFile] = useState<File | null>(null);
  const [editImageUrl, setEditImageUrl] = useState("");

  const params = useParams();
  const router = useRouter();
  const classroomId = params.classroomId as string;

  const handleFile = (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setImgFile(file);
  };

  const handleEditFile = (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setEditImgFile(file);
  };

  const uploadedImg = async () => {
    if (!imgFile) return;
    setUploading(true);
    const uploaded = await upload(imgFile.name, imgFile, {
      access: "public",
      handleUploadUrl: "/api/upload",
    });
    setImageUrl(uploaded.url);
    setUploading(false);
  };

  const uploadedEditImg = async () => {
    if (!editImgFile) return;
    setUploading(true);
    const uploaded = await upload(editImgFile.name, editImgFile, {
      access: "public",
      handleUploadUrl: "/api/upload",
    });
    setEditImageUrl(uploaded.url);
    setUploading(false);
  };

  const handleCreate = async () => {
    if (!classroom?.teacherId) return console.log("Teacher ID not found");

    try {
      const res = await fetch("/api/quizCreate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          title,
          description,
          coverImg: imageUrl,
          creatorId: classroom.teacherId,
          classroomId,
        }),
      });

      if (!res.ok) {
        console.log("Failed to create quiz");
        return;
      }

      console.log("Quiz created successfully");
      GetClass();
      setTitle("");
      setDescription("");
      setImgFile(null);
      setImageUrl("");
    } catch (err) {
      console.log("Error creating quiz", err);
    }
  };

  const GetClass = async () => {
    try {
      const res = await fetch(`/api/classroom-create/${classroomId}`);
      if (!res.ok) {
        console.log("Failed to get classroom");
        return;
      }
      const data: Classroom = await res.json();
      setClassroom(data);
      setQuizzes(data.quizzes);
    } catch (err) {
      console.log("Error fetching classroom", err);
    }
  };

  const handleDelete = async (id: string) => {
    try {
      const res = await fetch("/api/quiz-delete", {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id }),
      });

      if (!res.ok) {
        console.log("Failed to delete quiz");
        return;
      }

      console.log("Quiz deleted successfully");
      setQuizzes((prev) => prev.filter((q) => q.id !== id));
    } catch (err) {
      console.log("Error deleting quiz", err);
    }
  };

  const handleEdit = async (quiz: Quiz) => {
    try {
      const res = await fetch("/api/quiz-updated", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          id: quiz.id,
          newTitle: newTitle || quiz.title,
          newDescription: newDescription || quiz.description,
          newCoverImg: editImageUrl || quiz.coverImg,
        }),
      });

      if (!res.ok) {
        console.log("Failed to edit quiz");
        return;
      }

      console.log("Quiz edited successfully");
      // reset edit states
      setNewTitle("");
      setNewDescription("");
      setEditImgFile(null);
      setEditImageUrl("");
      GetClass();
    } catch (err) {
      console.log("Error editing quiz", err);
    }
  };

  useEffect(() => {
    if (classroomId) GetClass();
  }, [classroomId]);

  return (
    <div className="flex w-full">
      <div className="border shadow-lg rounded-xl p-5 w-80 bg-white ml-10 mt-10">
        <div>
          {classroom?.coverImg ? (
            <img
              src={classroom.coverImg}
              alt="Classroom Cover"
              className="w-full h-40 object-cover rounded-xl"
            />
          ) : (
            <div className="w-full h-40 bg-blue-500 rounded-xl flex justify-center items-center text-white text-3xl font-bold">
              BRAINKET
            </div>
          )}
        </div>
        <div className="mt-4 text-xl font-semibold">{classroom?.title}</div>
        <div className="text-gray-600">{classroom?.description}</div>
      </div>

      <div className="flex-1 px-10 mt-10">
        <div className="flex justify-center gap-4">
          <div className="shadow-lg border rounded-xl w-40 h-12 items-center flex justify-center text-xl font-bold">
            {quizzes?.length ?? 0} Quizzes
          </div>

          <Dialog>
            <DialogTrigger
              className="bg-[#4169E1] w-40 text-white rounded-2xl font-semibold
                text-xl h-12 px-6 cursor-pointer
                shadow-[0_4px_0_#27408B] transition-all
                hover:-translate-y-1 hover:shadow-[0_6px_0_#27408B]
                active:translate-y-1 active:shadow-[0_1px_0_#27408B]"
            >
              Add Quiz
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
                  <CardContent className="flex flex-col gap-4">
                    {imageUrl ? (
                      <img
                        src={imageUrl}
                        className="w-full h-64 object-cover rounded-xl border"
                      />
                    ) : (
                      <div className="w-full h-64 border-2 border-dashed rounded-xl flex flex-col items-center justify-center bg-gray-50 text-gray-400">
                        <ImageIcon className="w-12 h-12 opacity-50" />
                        <span className="text-sm mt-2">No image uploaded</span>
                        <Input
                          type="file"
                          accept="image/*"
                          onChange={handleFile}
                          className="mt-3 w-[70%] cursor-pointer"
                        />
                      </div>
                    )}

                    <Button
                      onClick={uploadedImg}
                      disabled={!imgFile || uploading}
                      className="bg-[#4169E1] text-white rounded-3xl font-bold text-base sm:text-lg md:text-xl px-5 sm:px-6 md:px-8 py-2.5 sm:py-3 md:py-4
                     shadow-[0_4px_0_#27408B] hover:scale-105 hover:shadow-[0_6px_0_#27408B] active:translate-y-1 active:shadow-[0_2px_0_#27408B]
                     transition-all hover:bg-blue-800 hover:text-white"
                    >
                      {uploading ? (
                        <>
                          <Loader2 className="w-4 h-4 animate-spin" />
                          Uploading...
                        </>
                      ) : (
                        <>
                          <UploadCloud className="w-4 h-4" /> Upload Image
                        </>
                      )}
                    </Button>
                  </CardContent>
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
          {quizzes.map((q) => (
            <div
              key={q.id}
              className="border shadow-md p-4 rounded-xl flex justify-between items-center"
            >
              <div>
                <strong
                  className="text-xl font-bold cursor-pointer hover:underline"
                  onClick={() => router.push(`/quiz/${q.id}`)}
                >
                  {q.title}
                </strong>
                <div className="text-gray-600">{q.description}</div>
              </div>

              <div className="flex gap-4 items-center"></div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
//if i click quiz name it pushes me to localhost/quiz/quiz.id
export default Page;
