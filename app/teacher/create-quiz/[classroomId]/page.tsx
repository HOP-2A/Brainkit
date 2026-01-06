"use client";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Trash2,
  ImageIcon,
  UploadCloud,
  Loader2,
  Pencil,
  Trash,
} from "lucide-react";
import { useParams } from "next/navigation";
import { useUser } from "@clerk/nextjs";
import { CardContent } from "@/components/ui/card";
import { upload } from "@vercel/blob/client";
import { Button } from "@/components/ui/button";
import { useState, useEffect, ChangeEvent } from "react";
import { useAuth } from "@/providers/useAuth";
import { Input } from "@/components/ui/input";
import { useRouter } from "next/navigation";
import Link from "next/link";
import SideBar from "@/app/teacher/_components/SideBar";
import { toast } from "sonner";
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
  const { user: clerkUser } = useUser();
  const clerkId = clerkUser?.id;
  const { user } = useAuth(clerkId ?? "");
  const [title, setTitle] = useState("");
  const [code, setCode] = useState("");
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

  const { push } = useRouter();
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
      const res = await fetch(`/api/quizCreate/${clerkId}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          code,
          title,
          description,
          coverImg: imageUrl,
          creatorId: classroom.teacherId,
          classroomId,
        }),
      });

      if (!res.ok) {
        return;
      }

      toast.success("Quiz created successfully");
      GetClass();
      setTitle("");
      setCode("");
      setDescription("");
      setImgFile(null);

      setImageUrl("");
    } catch (err) {
      toast.error("Error creating quiz!");
    }
  };

  const GetClass = async () => {
    try {
      const res = await fetch(`/api/classroom-create/${classroomId}`);
      if (!res.ok) {
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
      toast.success("Quiz edited successfully");

      setNewTitle("");
      setNewDescription("");
      setEditImgFile(null);
      setEditImageUrl("");
      GetClass();
    } catch (err) {
      console.log(err);
      toast.error("Error editing quiz");
    }
  };

  useEffect(() => {
    if (classroomId) GetClass();
  }, [classroomId]);

  return (
    <div className="min-h-screen flex bg-[#f4f6ff]">
      <SideBar />

      <div className="flex-1 flex flex-col p-8">
        <div className="mb-6">
          <h1 className="text-5xl font-bold text-gray-900">Create Quiz</h1>
          <div className="mt-4 h-[2px] bg-gray-300 rounded -mx-8" />
        </div>

        <div className="flex flex-col md:flex-row gap-10">
          <div className="md:w-80 bg-white rounded-xl shadow-lg overflow-hidden">
            {classroom?.coverImg ? (
              <img
                src={classroom.coverImg}
                alt="Classroom Cover"
                className="w-full h-48 object-cover"
              />
            ) : (
              <div className="w-full h-48 bg-[#0BC2CF] flex items-center justify-center text-white text-3xl font-bold">
                BRAINKET
              </div>
            )}

            <div className="p-4 space-y-2 justify-center">
              <h2 className="text-xl font-bold">{classroom?.title}</h2>
              <p className="text-gray-500 text-sm">{classroom?.description}</p>
            </div>

            <div className="flex flex-col gap-4 p-4">
              <div className="bg-white border-2 border-[#0BC2CF] rounded-xl text-center py-4 font-semibold">
                Class has {quizzes?.length ?? 0} quizzes
              </div>

              <Dialog>
                <DialogTrigger className="w-full bg-[#0BC2CF] text-white font-bold rounded-xl py-3 flex items-center justify-center gap-2 transition-all duration-200 hover:bg-[#09AEB9] hover:scale-105">
                  <UploadCloud className="w-5 h-5" /> Add Quiz
                </DialogTrigger>
                <DialogContent className="space-y-6">
                  <DialogHeader>
                    <DialogTitle className="text-4xl font-bold">
                      Quiz Creator
                    </DialogTitle>
                  </DialogHeader>

                  <div className="flex flex-col gap-4">
                    <div className="flex flex-col gap-1">
                      <label className="font-semibold">Title</label>
                      <Input
                        placeholder="Add a descriptive title"
                        value={title}
                        onChange={(e) => setTitle(e.target.value)}
                      />
                    </div>
                    <div className="flex flex-col gap-1">
                      <label className="font-semibold">Description</label>
                      <Input
                        placeholder="Tell users about your quiz"
                        value={description}
                        onChange={(e) => setDescription(e.target.value)}
                      />
                    </div>
                    <div className="flex flex-col gap-1">
                      <label className="font-semibold">Code</label>
                      <Input
                        placeholder="Create your code..."
                        value={code}
                        onChange={(e) => setCode(e.target.value)}
                      />
                    </div>

                    <div className="border shadow-md p-4 rounded-xl">
                      <label className="font-semibold">Cover Image</label>
                      <CardContent className="flex flex-col gap-4 mt-2">
                        {imageUrl ? (
                          <img
                            src={imageUrl}
                            className="w-full h-64 object-cover rounded-xl border"
                          />
                        ) : (
                          <div className="w-full h-64 border-2 border-dashed rounded-xl flex flex-col items-center justify-center bg-gray-50 text-gray-400">
                            <ImageIcon className="w-12 h-12 opacity-50" />
                            <span className="text-sm mt-2">
                              No image uploaded
                            </span>
                            <Input
                              type="file"
                              accept="image/*"
                              onChange={handleFile}
                              className="mt-3 w-2/3 cursor-pointer"
                            />
                          </div>
                        )}
                        <Button
                          onClick={uploadedImg}
                          disabled={!imgFile || uploading}
                          className="w-full bg-[#0BC2CF] text-white font-bold rounded-xl py-3 flex items-center justify-center gap-2 transition-all duration-200 hover:bg-[#09AEB9] hover:scale-105"
                        >
                          {uploading ? (
                            <>
                              <Loader2 className="w-4 h-4 animate-spin" />{" "}
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

                    <Button
                      onClick={handleCreate}
                      className="w-full bg-[#0BC2CF] text-white font-bold rounded-xl py-3 flex items-center justify-center gap-2 transition-all duration-200 hover:bg-[#09AEB9] hover:scale-105"
                    >
                      <UploadCloud className="w-5 h-5" /> Create
                    </Button>
                  </div>
                </DialogContent>
              </Dialog>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4 flex-1 lg:h-[200px] ">
            {quizzes.map((q) => (
              <div
                key={q.id}
                className="border shadow-sm rounded-lg p-3 hover:shadow-md transition-all bg-white relative"
              >
                {q.coverImg ? (
                  <img
                    src={q.coverImg}
                    className="w-full h-28 object-cover rounded-lg mb-2"
                  />
                ) : (
                  <div className="w-full h-28 bg-gray-200 flex items-center justify-center rounded-lg mb-2 text-gray-400 text-xs">
                    No Image
                  </div>
                )}

                <h3
                  className="text-sm font-semibold mb-1 hover:underline cursor-pointer"
                  onClick={() => push(`/teacher/question-create/${q.id}`)}
                >
                  {q.title}
                </h3>

                <p className="text-gray-600 text-xs line-clamp-2">
                  {q.description}
                </p>

                <div className="absolute bottom-2 right-2">
                  <Button
                    size="icon"
                    variant="outline"
                    onClick={() => handleDelete(q.id)}
                  >
                    <Trash2 className="w-3 h-3 text-red-500" />
                  </Button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
export default Page;
