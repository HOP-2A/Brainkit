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
import SideBar from "@/app/_components/SideBar";
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
      const res = await fetch(`/api/quizCreate${clerkId}`, {
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
    <div className="min-h-screen flex bg-gray-100">
      <SideBar />

      <main className="flex-1 p-10 space-y-10">
        <div className="flex flex-col md:flex-row gap-8 items-start">
          <div className="w-full md:w-80 border shadow-lg rounded-xl bg-white overflow-hidden">
            {classroom?.coverImg ? (
              <img
                src={classroom.coverImg}
                alt="Classroom Cover"
                className="w-full h-48 object-cover"
              />
            ) : (
              <div className="w-full h-48 bg-blue-500 flex justify-center items-center text-white text-3xl font-bold">
                BRAINKET
              </div>
            )}

            <div className="p-4 space-y-2">
              <h2 className="text-xl font-semibold">{classroom?.title}</h2>
              <p className="text-gray-600 text-sm">{classroom?.description}</p>
            </div>
          </div>

          <div className="flex-1 flex flex-col gap-6">
            <div className="flex gap-4 flex-wrap items-center">
              <div className="w-40 h-12 bg-white shadow-md rounded-xl flex items-center justify-center font-bold text-lg">
                {quizzes?.length ?? 0} Quizzes
              </div>

              <Dialog>
                <DialogTrigger className="mb-2 w-40 bg-[#5B3FFF] text-white rounded-xl font-bold text-lg py-2 px-2 flex items-center justify-center gap-2 shadow-[0_5px_0_#3B1FCC] hover:bg-[#6A52FF] hover:-translate-y-1 active:translate-y-1 transition-all">
                  <UploadCloud className="w-5 h-5" /> Add Quiz
                </DialogTrigger>

                <DialogContent className="space-y-6">
                  <DialogHeader>
                    <DialogTitle className="text-2xl font-bold">
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
                    <div>
                      <label>Code</label>
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
                          className="bg-blue-600 hover:bg-blue-700 text-white rounded-xl font-bold px-5 py-2 shadow flex items-center justify-center gap-2 transition-all hover:scale-105 active:translate-y-1"
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
                      className="mb-6 w-40 bg-[#5B3FFF] text-white rounded-xl font-bold text-lg py-3 flex items-center justify-center gap-2 shadow-[0_5px_0_#3B1FCC] hover:bg-[#6A52FF] hover:-translate-y-1 active:translate-y-1 transition-all"
                    >
                      <UploadCloud className="w-5 h-5" /> Create
                    </Button>
                  </div>
                </DialogContent>
              </Dialog>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {quizzes.map((q) => (
            <div
              key={q.id}
              className="border shadow-md rounded-xl p-4 hover:shadow-lg transition-all relative bg-white"
            >
              {q.coverImg ? (
                <img
                  src={q.coverImg}
                  className="w-full h-40 object-cover rounded-xl mb-3"
                />
              ) : (
                <div className="w-full h-40 bg-gray-200 flex items-center justify-center rounded-xl mb-3 text-gray-400">
                  No Cover Image
                </div>
              )}

              <h3
                className="text-lg font-bold mb-1 hover:underline cursor-pointer"
                onClick={() => router.push(`/quiz/${q.id}`)}
              >
                {q.title}
              </h3>
              <p className="text-gray-600 text-sm">{q.description}</p>

              <div className="absolute bottom-3 right-3 flex gap-2">
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => {
                    handleDelete(q.id);
                  }}
                >
                  <Trash2 className="w-4 h-4 text-red-500" />
                </Button>

                <div className="flex items-center gap-1">
                  <Dialog>
                    <DialogTrigger className="h-8 w-8 hover:bg-gray-200 pl-2 rounded-lg cursor-pointer">
                      <Pencil className="w-4 h-4 text-blue-500" />
                    </DialogTrigger>
                    <DialogContent>
                      <DialogHeader>
                        <DialogTitle className="text-center">
                          Edit the quiz
                        </DialogTitle>
                        <DialogDescription className="text-gray-800">
                          You can edit the title, description, and cover image
                          of the quiz.
                        </DialogDescription>
                      </DialogHeader>
                      <Input
                        placeholder="New title"
                        value={newTitle}
                        onChange={(e) => setNewTitle(e.target.value)}
                      />
                      <Input
                        placeholder="New description"
                        value={newDescription}
                        onChange={(e) => setNewDescription(e.target.value)}
                      />

                      <Input
                        type="file"
                        accept="image/*"
                        onChange={handleEditFile}
                        className="mt-3 w-[70%] cursor-pointer"
                      />

                      <Button
                        onClick={uploadedEditImg}
                        disabled={!editImgFile || uploading}
                        className="bg-[#4169E1] text-white rounded-3xl font-bold text-base sm:text-lg md:text-xl px-5 sm:px-6 md:px-8 py-2.5 sm:py-3 md:py-4
                     shadow-[0_4px_0_#27408B] hover:scale-105 hover:shadow-[0_6px_0_#27408B] active:translate-y-1 active:shadow-[0_2px_0_#27408B]
                     transition-all hover:bg-blue-800 hover:text-white"
                      >
                        {uploading ? (
                          <Loader2 className="w-4 h-4 animate-spin" />
                        ) : (
                          <>
                            <UploadCloud className="w-4 h-4" /> Upload Cover
                            Image
                          </>
                        )}
                      </Button>

                      <Button
                        onClick={(e) => handleEdit(q)}
                        className="bg-[#4169E1] text-white rounded-3xl font-bold text-base sm:text-lg md:text-xl px-5 sm:px-6 md:px-8 py-2.5 sm:py-3 md:py-4
                     shadow-[0_4px_0_#27408B] hover:scale-105 hover:shadow-[0_6px_0_#27408B] active:translate-y-1 active:shadow-[0_2px_0_#27408B]
                     transition-all hover:bg-blue-800 hover:text-white"
                      >
                        Save Changes
                      </Button>
                    </DialogContent>
                  </Dialog>
                </div>
              </div>
            </div>
          ))}
        </div>
      </main>
    </div>
  );
};
export default Page;
