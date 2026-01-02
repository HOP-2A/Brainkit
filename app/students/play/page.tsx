"use client";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";
import { ArrowRight } from "lucide-react";

export default function GamePlay() {
  const router = useRouter();

  return (
    <div className="min-h-screen bg-[#6ACEDF] flex flex-col">
      <div
        className="bg-[#9a49aa] text-white flex items-center justify-between px-4 sm:px-8 py-4"
        style={{ boxShadow: "0 -6px #0003 inset" }}
      >
        <span className="text-2xl sm:text-4xl font-extrabold">Brainket</span>
        <span className="hidden sm:block text-3xl font-bold">Join a Game!</span>
        <button
          onClick={() => router.push("/students/classroom")}
          className="sm:block text-3xl font-bold underline underline-offset-2"
        >
          Dashboard
        </button>
      </div>

      <div className="relative flex-1 flex flex-col items-center justify-center px-6 sm:px-12">
        <div className="flex flex-col items-center gap-6 z-10 pb-60">
          <div className="text-5xl sm:text-7xl lg:text-8xl font-extrabold text-gray-800 text-center">
            BRAINKET
          </div>

          <div className="flex items-center gap-4">
            <Input
              type="text"
              className="bg-white w-80 h-20 text-center text-9xl placeholder:text-2xl border-2 border-gray-300
              shadow-[0_6px_0_#CCCCCC] focus:outline-none focus:ring-2 focus:ring-[#0BC2CF] focus:border-[#0BC2CF]"
              placeholder="Game ID"
            />

            <Button
              className="bg-white w-20 h-20 flex items-center justify-center
               rounded-xl shadow-[0_6px_0_#CCCCCC]
               hover:bg-white hover:text-white transition-colors duration-200"
            >
              <ArrowRight className="text-black text-2xl" />
            </Button>
          </div>
        </div>

        <div className="fixed bottom-0 left-0 w-full h-[284px] bg-[#E6F7F8] z-0 pointer-events-none">
          <img
            src="/penguin.gif"
            alt="penguin"
            className="absolute bg-black right-0 bottom-0 w-80 sm:w-[1000px] lg:w-[1000px]"
          />
        </div>
      </div>
    </div>
  );
}
