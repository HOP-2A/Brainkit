"use client";

import { useAuth } from "@/providers/useAuth";
import { useUser } from "@clerk/nextjs";
import { useEffect, useState, ChangeEvent } from "react";
import { ImageIcon, UploadCloud, Loader2, Search } from "lucide-react";
import { Eye } from "lucide-react";

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
      searchClassName();
    }
  }, [className]);
  return (
    <div className="min-h-screen flex bg-[#f4f6ff]">
      <SideBar />

      <div className="flex-1 px-12 py-10">
        <div className="flex justify-between items-center mb-10">
          <div className="text-4xl font-bold tracking-tight">My Classrooms</div>

          <div className="relative">
            <Search
              className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-900"
              size={16}
            />
            <Input
              placeholder="Search classrooms..."
              className="pl-9 w-72 rounded-xl text-gray-900"
              value={className}
              onChange={(e) => setClassName(e.target.value)}
            />
          </div>
        </div>
        {/* GRID */}
        <div className="grid gap-6 grid-cols-[repeat(auto-fill,minmax(260px,1fr))]">
          {classrooms.map((classroom) => (
            <Card
              key={classroom.id}
              className="
  rounded-xl
  bg-white
  border
  shadow-sm
  hover:shadow-xl
  transition-all  
  duration-300

"
            >
              <div className="relative h-36 w-full">
                {classroom.coverImg ? (
                  <img
                    src={classroom.coverImg}
                    alt={classroom.title}
                    className="h-full w-full object-cover"
                  />
                ) : (
                  <div className="h-full w-full bg-white flex items-center justify-center">
                    <span className="text-gray-800 text-lg font-bold tracking-wide">
                      No Cover Image
                    </span>
                  </div>
                )}

                <div
                  className="
    absolute bottom-2 left-2
    bg-black/75
    text-white text-xs
    px-2 py-1
    rounded-md
    flex items-center gap-1
  "
                >
                  <Eye size={14} /> {classroom.quizzes?.length || 0} Quizzes
                </div>
              </div>

              <div className="px-4 space-y-1">
                <h3 className="font-semibold text-sm truncate">
                  {classroom.name || "Untitled Classroom"}
                </h3>

                <p className="text-xs text-muted-foreground truncate">
                  {classroom.title || "No description"}
                </p>

                <p className="text-[11px] text-muted-foreground">
                  Last edited • {new Date(classroom.updatedAt).toLocaleString()}
                </p>
              </div>

              {/* FOOTER */}
              <div className="border-t px-3 py-2 flex items-center justify-between">
                <Button
                  variant="outline"
                  size="sm"
                  className="h-8 text-xs font-medium hover:bg-gray-200   cursor-pointer"
                  onClick={() => push(`/classroom/quizzes/${classroom.id}`)}
                >
                  View Quizzes
                </Button>

                <div className="flex items-center gap-1">
                  <Dialog>
                    <DialogTrigger className="h-8 w-8 hover:bg-gray-200 pl-2 rounded-lg cursor-pointer">
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
                    className="h-8 w-8 text-red-500 hover:text-red-500 hover:bg-gray-200 cursor-pointer"
                    onClick={() => deleteClass(classroom.id)}
                  >
                    <Trash size={14} />
                  </Button>
                </div>
              </div>
            </Card>
          ))}
        </div>

        {/* EMPTY STATE */}
        {classrooms.length === 0 && (
          <p className="text-muted-foreground mt-12">
            You haven’t created any classrooms yet.{" "}
          </p>
        )}
      </div>
    </div>
  );
};

export default Page;
