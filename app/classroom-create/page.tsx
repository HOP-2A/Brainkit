"use client";

import { useUser } from "@clerk/nextjs";
import { useState, ChangeEvent } from "react";
import { upload } from "@vercel/blob/client";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ImageIcon, UploadCloud, Loader2 } from "lucide-react";
import { SideBar } from "../_components/SideBar";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { useAuth } from "@/providers/useAuth";

type ClassroomType = {
  id: string;
};
const Page = () => {
  const { user: clerkUser } = useUser();
  const clerkId = clerkUser?.id;
  const { user } = useAuth(clerkId ?? "");

  const [classroom, setClassroom] = useState<ClassroomType>();
  const [inputValues, setInputValues] = useState({
    title: "",
    description: "",
    className: "",
    classCode: "",
  });

  const { push } = useRouter();

  const hangleInputs = (e: ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setInputValues({ ...inputValues, [name]: value });
  };

  const [imgFile, setImgFile] = useState<File | null>(null);
  const [imageUrl, setImageUrl] = useState("");
  const [uploading, setUploading] = useState(false);

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
    setImageUrl(uploaded.url);
    setUploading(false);
  };

  const createClass = async () => {
    const response = await fetch("/api/classroom-create", {
      method: "POST",
      headers: { "Content-type": "application/json" },
      body: JSON.stringify({
        title: inputValues.title,
        description: inputValues.description,
        coverImg: imageUrl,
        teacherId: user?.id,
        name: inputValues.className,
        code: inputValues.classCode,
      }),
    });
    console.log(response);
    if (response.ok) {
      toast.success("Classroom successfully created!");

      const res = await response.json();
      setClassroom(res.message);
      if (classroom) {
        push(`/quiz-create/${classroom.id}`);
      }
    } else {
      toast.error("Please use a different class code.");
    }
  };

  console.log(classroom);
  return (
    <div className="min-h-screen flex bg-[#f4f6ff]">
      <SideBar />

      <div className="flex-1 p-10">
        <div className="flex gap-10">
          <Card className="w-[480px] shadow-md border border-gray-200">
            <CardHeader>
              <CardTitle className="text-2xl font-bold text-gray-700">
                Cover Image (optional)
              </CardTitle>
            </CardHeader>
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
                    <UploadCloud className="w-4 h-4" />
                    Upload Image
                  </>
                )}
              </Button>
            </CardContent>
          </Card>

          {/* FORM SECTION */}
          <Card className="flex-1 shadow-md border border-gray-200 p-6 mr-20">
            <CardContent className="space-y-6">
              <div>
                <label className="text-2xl text-gray-700 font-bold">
                  Title <label className="text-red-700">(required)</label>
                </label>
                <Input
                  placeholder="Enter classroom title"
                  value={inputValues.title}
                  name="title"
                  onChange={hangleInputs}
                  className="mt-1 h-10 border-solid border-gray-200 border-3"
                />
              </div>

              <div>
                <label className="text-2xl text-gray-700 font-bold">
                  Description{" "}
                  <label className="text-gray-600">(optional)</label>
                </label>
                <Input
                  placeholder="Enter a classroom description"
                  value={inputValues.description}
                  name="description"
                  onChange={hangleInputs}
                  className="mt-1 h-15 border-solid border-gray-200 border-3"
                />
              </div>

              <div>
                <label className="text-2xl text-gray-700 font-bold">
                  Class Name <label className="text-red-700">(required)</label>
                </label>
                <Input
                  placeholder="Enter class name"
                  value={inputValues.className}
                  name="className"
                  onChange={hangleInputs}
                  className="mt-1 h-10 border-solid border-gray-200 border-3"
                />
              </div>

              <div>
                <label className="text-2xl text-gray-700 font-bold ">
                  Class Code <label className="text-red-700">(required)</label>
                </label>
                <Input
                  placeholder="Create a join code for your class"
                  value={inputValues.classCode}
                  name="classCode"
                  onChange={hangleInputs}
                  className="mt-1 h-10 border-solid border-gray-200 border-3"
                />
              </div>
            </CardContent>
          </Card>
        </div>
        <Button
          onClick={createClass}
          className="bg-[#4169E1] text-white rounded-3xl font-bold text-base sm:text-lg md:text-xl px-5 sm:px-6 md:px-8 py-2.5 sm:py-3 md:py-4
                     shadow-[0_4px_0_#27408B] hover:scale-105 hover:shadow-[0_6px_0_#27408B] active:translate-y-1 active:shadow-[0_2px_0_#27408B]
                     transition-all hover:bg-blue-800 hover:text-white mt-20"
        >
          Create Classroom
        </Button>
      </div>
    </div>
  );
};

export default Page;
