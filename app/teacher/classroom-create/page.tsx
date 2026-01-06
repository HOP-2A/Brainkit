"use client";

import { useUser } from "@clerk/nextjs";
import { useState, ChangeEvent } from "react";
import { upload } from "@vercel/blob/client";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ImageIcon, UploadCloud, Loader2 } from "lucide-react";

import { toast } from "sonner";
import { useAuth } from "@/providers/useAuth";
import { useRouter } from "next/navigation";
import SideBar from "../_components/SideBar";

type ClassroomType = {
  id: string;
};
const Page = () => {
  const { user: clerkUser } = useUser();
  const clerkId = clerkUser?.id;
  const { user } = useAuth(clerkId ?? "");
  const [classroom, setClassroom] = useState<ClassroomType | null>(null);

  const { push } = useRouter();
  const [inputValues, setInputValues] = useState({
    title: "",
    description: "",
    className: "",
    classCode: "",
  });

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
    const response = await fetch(`/api/classroom-create/${clerkId}`, {
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

    if (response.ok) {
      toast.success("Classroom successfully created!");

      const data = await response.json();

      setClassroom(data);
      push(`/teacher/create-quiz/${data.message.id}`);
    } else {
      toast.error("Error");
    }
  };

  return (
    <div className=" flex bg-[#f4f6ff]">
      <SideBar />

      <div className="flex-1 flex flex-col relative">
        <div className="p-8">
          <h1 className="text-5xl font-bold text-gray-900">Create Classes</h1>
          <div className="mt-4 h-0.5 bg-gray-300 rounded -mx-8" />
        </div>

        <div className="flex flex-col md:flex-row gap-10 px-6 md:px-8 mt-2">
          <Card className="w-full md:w-[480px] shadow-md border border-gray-200">
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
                <div className="w-full h-64 border-2 border-dashed flex flex-col items-center justify-center bg-gray-50 text-gray-400">
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
                transition-all hover:bg-blue-800"
              >
                {uploading ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin mr-2" />
                    Uploading...
                  </>
                ) : (
                  <>
                    <UploadCloud className="w-4 h-4 mr-2" />
                    Upload Image
                  </>
                )}
              </Button>
            </CardContent>
          </Card>

          <Card className="flex-1 shadow-md border border-gray-200 p-4">
            <CardContent className="space-y-6">
              <div>
                <label className="text-2xl text-gray-700 font-bold">
                  Title <span className="text-red-700">(required)</span>
                </label>
                <Input
                  placeholder="Enter classroom title"
                  value={inputValues.title}
                  name="title"
                  onChange={hangleInputs}
                  className="mt-1 h-10 border border-gray-200 rounded"
                />
              </div>

              <div>
                <label className="text-2xl text-gray-700 font-bold">
                  Description <span className="text-gray-600">(optional)</span>
                </label>
                <Input
                  placeholder="Enter a classroom description"
                  value={inputValues.description}
                  name="description"
                  onChange={hangleInputs}
                  className="mt-1 h-10 border border-gray-200 rounded"
                />
              </div>

              <div>
                <label className="text-2xl text-gray-700 font-bold">
                  Class Name <span className="text-red-700">(required)</span>
                </label>
                <Input
                  placeholder="Enter class name"
                  value={inputValues.className}
                  name="className"
                  onChange={hangleInputs}
                  className="mt-1 h-10 border border-gray-200 rounded"
                />
              </div>

              <div>
                <label className="text-2xl text-gray-700 font-bold">
                  Class Code <span className="text-red-700">(required)</span>
                </label>
                <Input
                  placeholder="Create a join code for your class"
                  value={inputValues.classCode}
                  name="classCode"
                  onChange={hangleInputs}
                  className="mt-1 h-10 border border-gray-200 rounded"
                />
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="mt-32 flex flex-col items-center gap-10">
          <Button
            onClick={createClass}
            className="bg-[#0BC2CF] text-white rounded-xl font-extrabold text-3xl
            shadow-[0_5px_0_#088d96] hover:bg-[#0bd5e3] hover:scale-105 transition-all
            w-[260px] h-[90px] md:w-[300px] md:h-[100px]"
          >
            Create Classroom
          </Button>

          <div className="absolute bottom-0 left-0 right-0 flex justify-between items-end px-10 md:px-24 pointer-events-none">
            <img
              src="/wow-cool.gif"
              className="w-[420px] h-[420px] md:w-[450px] md:h-[500px]"
            />

            <img
              src="/penguin-safari.gif"
              className="w-[360px] h-[360px] md:w-[500px] md:h-[530px]"
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default Page;
