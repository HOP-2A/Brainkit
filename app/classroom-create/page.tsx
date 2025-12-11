"use client";

import { useUser } from "@clerk/nextjs";
import { useState, ChangeEvent } from "react";
import { upload } from "@vercel/blob/client";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useAuth } from "../api/providers/useAuth";
import { SideBar } from "../_components/SideBar";

const Page = () => {
  const { user: clerkUser } = useUser();
  const clerkId = clerkUser?.id;

  console.log(clerkUser);
  const { user } = useAuth(clerkId ?? "");

  const [inputValues, setInputValues] = useState({
    title: "",
    description: "",
    className: "",
    classCode: "",
  });

  const hangleInputs = (e: ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setInputValues({
      ...inputValues,
      [name]: value,
    });
  };

  const [imgFile, setImgFile] = useState<File | null>(null);
  const [imageUrl, setImageUrl] = useState("");

  const handleFile = (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setImgFile(file);
  };

  const uploadedImg = async () => {
    if (!imgFile) return;
    const uploaded = await upload(imgFile.name, imgFile, {
      access: "public",
      handleUploadUrl: "/api/upload",
    });
    setImageUrl(uploaded.url);
  };

  const createClass = async () => {
    const response = await fetch("/api/classroom-create", {
      method: "POST",
      headers: {
        "Content-type": "application/json",
      },

      body: JSON.stringify({
        title: inputValues.title,
        description: inputValues.description,
        coverImg: imageUrl,
        teacherId: "p6W6kKgN_YmoA9_lKDLJv",
        name: inputValues.className,
        code: inputValues.classCode,
      }),
    });
  };

  console.log(inputValues.className, "qw");
  return (
    <div className="min-h-screen flex bg-[#f4f6ff]">
      <SideBar />
      <div className="flex-1 p-6">
        <div className="flex col gap-10">
          <div className="w-[70px] h-[100px] border-dashed border-2 rounded-xl pt-1.5 p-2">
            <div className="font-semibold text-gray-700">
              Upload an cover image (optional)
            </div>
            <Input
              type="file"
              accept="image/*"
              onChange={handleFile}
              className="w-[15px] cursor-pointer"
            />
            <button
              onClick={uploadedImg}
              className="bg-[#4169E1] text-white px-4 py-2 rounded-xl font-bold shadow-[0_4px_0_#27408B]"
            >
              add
            </button>
          </div>
          <div>
            {imageUrl ? (
              <img src={imageUrl} className="w-[200px] h-[200px]" />
            ) : (
              <div>ta zurag upload hiigeegui baina </div>
            )}
            <div>
              <div>required</div>
              <Input
                placeholder="write a classroom title"
                value={inputValues.title}
                name="title"
                onChange={(e) => hangleInputs(e)}
              />
              <div>description optional</div>
              <Input
                placeholder="write a classroom description"
                value={inputValues.description}
                name="description"
                onChange={(e) => hangleInputs(e)}
              ></Input>
              <div>required</div>
              <Input
                placeholder="write a classroom name"
                value={inputValues.className}
                name="className"
                onChange={(e) => hangleInputs(e)}
              ></Input>
              <div>required </div>
              <Input
                placeholder="write a classroom enter code ta ooroo zohiono"
                value={inputValues.classCode}
                name="classCode"
                onChange={(e) => hangleInputs(e)}
              ></Input>
            </div>
          </div>

          <Button onClick={createClass}>create a classroom</Button>
        </div>
      </div>
    </div>
  );
};

export default Page;

