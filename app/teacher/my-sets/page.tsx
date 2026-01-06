"use client";

import { useAuth } from "@/providers/useAuth";
import { useUser } from "@clerk/nextjs";
import { useEffect, useState, ChangeEvent } from "react";
import { ImageIcon, UploadCloud, Loader2, Search } from "lucide-react";
import { Eye } from "lucide-react";
import { Spinner } from "@/components/ui/spinner";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";

import { Button } from "@/components/ui/button";

import { Play, Pencil, Trash } from "lucide-react";
import { toast } from "sonner";
import { Input } from "@/components/ui/input";
import { upload } from "@vercel/blob/client";
import { useRouter } from "next/navigation";
import SideBar from "../_components/SideBar";

type ClassroomType = {
  id: string;
  title: string;
  description: string;
  coverImg: string;
  quizzes: string[];
  name: string;
  updatedAt: string;
};

const Page = () => {
  const [classrooms, setClassrooms] = useState<ClassroomType[]>([]);
  const [uploading, setUploading] = useState(false);

  const [className, setClassName] = useState("");
  const { push } = useRouter();
  const [inputValues, setInputValues] = useState({
    newTitle: "",
    newDescription: "",
    className: "",
  });

  const [imgFile, setImgFile] = useState<File | null>(null);
  const [newCoverImg, setNewCoverImg] = useState("");

  const { user: clerkUser } = useUser();
  const clerkId = clerkUser?.id;
  const { user } = useAuth(clerkId ?? "");
  const teacherId = user?.id;

  const handleFile = (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setImgFile(file);
  };

  const uploadedImg = async () => {
    if (!imgFile) return;
    setUploading(true);
    const uploaded = await upload(imgFile.name, imgFile, {
      access: "public",
      handleUploadUrl: "/api/upload",
    });

    setNewCoverImg(uploaded.url);
    if (uploaded) {
      toast.success("successfully added img");
    }
    setUploading(false);
  };

  const teacherClasses = async () => {
    if (!teacherId) return;
    try {
      const response = await fetch(`/api/my-sets/${teacherId}`);
      if (!response.ok) return;

      const data = await response.json();
      setClassrooms(data.message.createdClasses ?? []);
    } catch (err) {
      console.error("Failed to fetch classes", err);
    }
  };

  const deleteClass = async (id: string) => {
    const response = await fetch("/api/classroom-deleted", {
      method: "DELETE",
      headers: {
        "Content-type": "application/json",
      },
      body: JSON.stringify({
        id,
      }),
    });

    if (response.ok) {
      toast.success("successfully deleted");
      teacherClasses();
    }
  };

  const editClassroom = async (id: string) => {
    const response = await fetch("/api/classroom-edit", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        id,
        newTitle: inputValues.newTitle,
        newDescription: inputValues.newDescription,
        newCoverImg: newCoverImg,
        className: inputValues.className,
      }),
    });

    if (response.ok) {
      toast.success("successfully edited");
      teacherClasses();
      setInputValues({
        newTitle: "",
        newDescription: "",
        className: "",
      });
    }
  };

  const handleInputs = (e: ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setInputValues({ ...inputValues, [name]: value });
  };

  const searchClassName = async () => {
    const res = await fetch(`/api/classroom-search/${className}`);
    if (res.ok) {
      const data = await res.json();
      setClassrooms(data);
    }
  };
  useEffect(() => {
    const fetchData = async () => await teacherClasses();
    fetchData();
  }, [teacherId]);

  useEffect(() => {
    if (className) {
      const run = () => {
        searchClassName();
      };

      run();
    }
  }, [className]);
  return (
    <div className="min-h-screen flex bg-[#f4f6ff]">
      <SideBar />

      <div className="flex-1 p-8">
        <div className="flex items-center justify-between pr-6">
          <h1 className="text-5xl font-bold text-gray-900">My Classrooms</h1>

          <div className="relative pr-6">
            <Search
              className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400"
              size={18}
            />
            <Input
              placeholder="Search your classrooms..."
              className="h-12 w-64 rounded-full bg-white pl-11 pr-4 text-sm
              border border-gray-300 shadow-sm focus:outline-none focus:ring-1
              focus:ring-[#0BC2CF] focus:border-[#0BC2CF] placeholder:text-gray-400
      "
              value={className}
              onChange={(e) => setClassName(e.target.value)}
            />
          </div>
        </div>
        <div className="mt-4 h-[2px] bg-gray-300 rounded -mx-8" />

        <div className="grid gap-6 grid-cols-[repeat(auto-fill,minmax(260px,1fr))]">
          {classrooms.map((classroom) => (
            <Card
              key={classroom.id}
              className="rounded-xl bg-white border shadow-sm hover:shadow-xl transition-all
              duration-300 mt-9 p-0"
            >
              <div className="relative h-36 w-full">
                {classroom.coverImg ? (
                  <img
                    src={classroom.coverImg}
                    alt={classroom.title}
                    className="h-full w-full object-cover"
                  />
                ) : (
                  <div className="relative h-40 bg-[#0BC2CF] rounded-t-xl flex items-center justify-center">
                    <span className="text-white font-extrabold text-2xl text-center">
                      No Cover Image
                    </span>
                    <div className="absolute bottom-2 right-2 bg-black/50 text-white text-xs px-2 py-1 rounded-md flex items-center gap-1">
                      <Eye size={14} /> {classroom.quizzes?.length || 0} Quizzes
                    </div>
                  </div>
                )}
              </div>
              <div className="px-3 space-y-1">
                <h3 className="font-semibold text-3xl">
                  {classroom.name || "Untitled Classroom"}
                </h3>

                <p className="text-xs text-muted-foreground truncate mt-2">
                  {classroom.title || "No description"}
                </p>

                <p className="text-[10px] text-muted-foreground mt-5">
                  Last edited • {new Date(classroom.updatedAt).toLocaleString()}
                </p>
              </div>
              <div className="border-t-2 px-3 py-2 flex items-center justify-between">
                <Button
                  className="bg-[#0BC2CF] text-white font-bold py-2 px-6 mb-2
                   shadow-[0_6px_0_#09AEB9] hover:bg-[#09AEB9] hover:-translate-y-1
                   hover:shadow-[0_10px_0_#0898A3]"
                  onClick={() => push(`/teacher/create-quiz/${classroom.id}`)}
                >
                  Open Class
                </Button>

                <div className="flex items-center gap-1">
                  <Dialog>
                    <DialogTrigger className="h-8 w-8 hover:bg-gray-200 pl-2 rounded-lg scale-145 cursor-pointer">
                      <Pencil size={14} />
                    </DialogTrigger>
                    <DialogContent>
                      <DialogHeader>
                        <DialogTitle>Edit the classroom</DialogTitle>
                        <DialogDescription className="text-gray-800">
                          You can edit the title, description, and cover image
                          of the classroom.
                        </DialogDescription>
                      </DialogHeader>
                      <Input
                        placeholder="New title"
                        value={inputValues.newTitle}
                        name="newTitle"
                        onChange={handleInputs}
                      />
                      <Input
                        placeholder="New description"
                        value={inputValues.newDescription}
                        name="newDescription"
                        onChange={handleInputs}
                      />

                      <Input
                        placeholder="Classroom name"
                        value={inputValues.className}
                        name="className"
                        onChange={handleInputs}
                      />

                      <Input
                        type="file"
                        accept="image/*"
                        onChange={handleFile}
                        className="mt-3 w-[70%] cursor-pointer"
                      />

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
                            Uploading image…
                          </>
                        ) : (
                          <>
                            <UploadCloud className="w-4 h-4" />
                            Upload Cover Image
                          </>
                        )}
                      </Button>
                      <Button
                        onClick={(e) => editClassroom(classroom.id)}
                        className="bg-[#4169E1] text-white rounded-3xl font-bold text-base sm:text-lg md:text-xl px-5 sm:px-6 md:px-8 py-2.5 sm:py-3 md:py-4
                     shadow-[0_4px_0_#27408B] hover:scale-105 hover:shadow-[0_6px_0_#27408B] active:translate-y-1 active:shadow-[0_2px_0_#27408B]
                     transition-all hover:bg-blue-800 hover:text-white"
                      >
                        Save Changes
                      </Button>
                    </DialogContent>
                  </Dialog>

                  <Button
                    size="icon"
                    variant="ghost"
                    className="h-8 w-8 text-red-500 hover:text-red-500 hover:bg-gray-200 scale-130 cursor-pointer"
                    onClick={() => deleteClass(classroom.id)}
                  >
                    <Trash size={14} />
                  </Button>
                </div>
              </div>
            </Card>
          ))}
        </div>

        {classrooms.length === 0 && (
          <strong className="mt-12 flex gap-1 text-4xl justify-center">
            Loading <Spinner className="mt-1 h-8 w-8" />
          </strong>
        )}
      </div>
    </div>
  );
};

export default Page;
