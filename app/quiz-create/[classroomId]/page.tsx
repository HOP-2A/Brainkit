"use client";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Trash2 } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ImageIcon, UploadCloud, Loader2 } from "lucide-react";
import { upload } from "@vercel/blob/client";
import { Button } from "@/components/ui/button";
import { useState, useEffect, ChangeEvent } from "react";
import { Input } from "@/components/ui/input";
import Link from "next/link";
const Page = () => {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [Quiz, setQuiz] = useState([
    {
      description: "Hi",
      title: "hi title",
      id: "9Bv_uctV-voe_wlKF3M7E",
      coverImg: "fwfwfwqe",
    },
  ]);
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
  const handleCreate = async () => {
    try {
      const res = await fetch("/api/quizCreate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          title,
          description,
          coverImg: imageUrl,
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

      console.log("delete hiigdse");
    } catch (err) {
      console.log("aldaa garso");
    }
  };
  const handleEdit = async (
    id: string,
    description: string,
    title: string,
    coverImg: string
  ) => {
    try {
      const res = await fetch("api/quiz-updated", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          id,
          newTitle: title,
          newDescription: description,
          newCoverImg: coverImg,
        }),
      });

      if (!res.ok) {
        console.log("Failed to edit quiz");
        return;
      }
      console.log("edit hiigdev.");
    } catch (err) {
      console.log("aldaa");
    }
  };
  return (
    <div className="flex w-full">
      <div className="border shadow-lg rounded-xl p-5 w-80 bg-white ml-10 mt-10">
        <div className="w-full h-40 bg-blue-500 rounded-xl flex justify-center items-center text-white text-3xl font-bold">
          BRAINKET
        </div>

        <div className="mt-4 text-xl font-semibold">classname</div>
        <div className="text-gray-600">description</div>
      </div>

      <div className="flex-1 px-10 mt-10">
        <div className="flex justify-center gap-4">
          <div className="shadow-lg border rounded-xl w-40 h-12 items-center flex justify-center text-xl font-bold">
            {Quiz?.length ?? 0} Quizzes
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
                          <UploadCloud className="w-4 h-4" />
                          Upload Image
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
          {Quiz.map((q, i) => (
            <div
              key={i}
              className="border shadow-md p-4 rounded-xl flex justify-between items-center"
            >
              <div>
                <strong className="text-xl">Title</strong>
                <div className="text-gray-600">Description</div>
              </div>

              <div className="flex gap-4 items-center">
                <Dialog>
                  <DialogTrigger
                    className="bg-gray-500 text-white rounded-xl px-6 py-2
                    font-semibold cursor-pointer"
                  >
                    Edit
                  </DialogTrigger>
                  <DialogContent>
                    <DialogHeader>
                      <DialogTitle>Quiz editor</DialogTitle>
                    </DialogHeader>
                    <div className="mt-3 flex flex-col gap-4">
                      <div className="flex flex-col gap-1">
                        <strong>Title</strong>
                        <Input
                          placeholder={q.title}
                          value={title}
                          onChange={(e) => setTitle(e.target.value)}
                        />
                      </div>

                      <div className="flex flex-col gap-1">
                        <strong>Description</strong>
                        <Input
                          placeholder={q.description}
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
                              <span className="text-sm mt-2">
                                No image uploaded
                              </span>

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
                      </div>

                      <button
                        onClick={() =>
                          handleEdit(q.id, q.description, q.title, q.coverImg)
                        }
                        className="bg-[#4169E1] w-40 mx-auto text-white rounded-2xl font-semibold
                  text-xl h-16 px-6 cursor-pointer
                  shadow-[0_4px_0_#27408B] transition-all
                  hover:-translate-y-1 hover:shadow-[0_6px_0_#27408B]
                  active:translate-y-1 active:shadow-[0_1px_0_#27408B]"
                      >
                        Save Changes
                      </button>
                    </div>
                  </DialogContent>
                </Dialog>

                <Trash2
                  onClick={() => handleDelete(q)}
                  className="cursor-pointer text-red-500"
                />
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Page;
