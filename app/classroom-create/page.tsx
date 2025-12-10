"use client";

import { useUser } from "@clerk/nextjs";
import { useState, ChangeEvent } from "react";
import { upload } from "@vercel/blob/client";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useAuth } from "../api/providers/useAuth";

const Page = () => {
  const { user:clerkUser } = useUser();
  const clerkId = clerkUser?.id;

   const {user}   = useAuth(clerkId ?? "")

   
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

  const createClass = async() => {
    const response = await fetch("/api/classroom-create", {
      method:"POST",
      headers : {
        "Content-type":"application/json"
      },

      body : JSON.stringify({
        title:inputValues.title,
        description:inputValues.description,
        coverImg:imageUrl,
        teacherId: ,
        name:inputValues.className,
        code : inputValues.classCode

      })

    })
  }

  console.log(inputValues.className, "qw");
  return (
    <div>
      <div>
        <label className="font-semibold text-gray-700">
          Upload an cover image
        </label>
        <Input
          type="file"
          accept="image/*"
          onChange={handleFile}
          className="w-full cursor-pointer"
        />
        <Button onClick={uploadedImg}>add</Button>
      </div>
      <div>
        <Input
          placeholder="write a classroom title"
          value={inputValues.title}
          name="title"
          onChange={(e) => hangleInputs(e)}
        />
        <Input
          placeholder="write a classroom description"
          value={inputValues.description}
          name="description"
          onChange={(e) => hangleInputs(e)}
        ></Input>
        <Input
          placeholder="write a classroom name"
          value={inputValues.className}
          name="className"
          onChange={(e) => hangleInputs(e)}
        ></Input>
        <Input
          placeholder="write a classroom enter code"
          value={inputValues.classCode}
          name="classCode"
          onChange={(e) => hangleInputs(e)}
        ></Input>
      </div>
      <Button onClick={createClass}>create a classroom</Button>
    </div>
  );
};

export default Page;
