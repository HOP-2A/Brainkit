"use client";

import { useAuth } from "@/providers/useAuth";
import { useUser } from "@clerk/nextjs";
import { useEffect, useState } from "react";
import { SideBar } from "../_components/SideBar";

import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";

import { Play, Pencil, Trash } from "lucide-react";
import { toast } from "sonner";

type ClassroomType = {
  id: string;
  title: string;
  description: string;
  coverImg: string;
};

const Page = () => {
  const [classrooms, setClassrooms] = useState<ClassroomType[]>([]);

  const { user: clerkUser } = useUser();
  const clerkId = clerkUser?.id;

  const { user } = useAuth(clerkId ?? "");
  const teacherId = user?.id;

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

  useEffect(() => {
    const fetchData = async () => await teacherClasses();
    fetchData();
  }, [teacherId]);

  console.log(classrooms);
  return (
    <div className="min-h-screen flex bg-[#f4f6ff]">
      <SideBar />

      <div className="flex-1 px-12 py-10">
        <h1 className="text-4xl font-bold mb-10">My Sets</h1>

        {/* GRID */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-6">
          {classrooms.map((classroom) => (
            <Card
              key={classroom.id}
              className="
    w-[260px]
    rounded-lg
    overflow-hidden
    bg-white
    border
    shadow-gray-400
    hover:shadow-2xl
    hover:-translate-y-2
    transition-all
    duration-200
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
                  <div className="h-full w-full bg-cyan-500 flex items-center justify-center">
                    <span className="text-white text-xl font-extrabold">
                      Blooket
                    </span>
                  </div>
                )}

                {/* 👁 QUESTIONS BADGE */}
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
                  👁 {classroom.questions?.length || 0} Quizs
                </div>
              </div>

              <div className="px-4 py-3 space-y-1">
                <h3 className="font-semibold text-sm truncate">
                  {classroom.title || "Untitled"}
                </h3>

                <p className="text-xs text-muted-foreground">
                  {classroom.plays || 0} Plays
                </p>

                <p className="text-[11px] text-muted-foreground">
                  Edited {classroom.updatedAt || "2 days ago"}
                </p>
              </div>

              {/* FOOTER */}
              <div className="border-t px-3 py-2 flex items-center justify-between">
                <Button variant="outline" size="sm" className="h-8 text-xs">
                  QUIZS
                </Button>

                <div className="flex items-center gap-1">
                  <Button size="icon" variant="ghost" className="h-8 w-8">
                    <Pencil size={14} />
                  </Button>

                  <Button
                    size="icon"
                    variant="ghost"
                    className="h-8 w-8 text-red-500"
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
            You haven’t created any sets yet.
          </p>
        )}
      </div>
    </div>
  );
};

export default Page;
