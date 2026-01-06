"use client";

import { Menu } from "lucide-react";
import SideBar from "../_components/SideBar";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/providers/useAuth";
import { Spinner } from "@/components/ui/spinner";
import {
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";
import { useEffect, useState } from "react";
import { useUser } from "@clerk/nextjs";

type HistoryItem = {
  quizId: string;
  title: string;
  createdAt: string;
  totalPlayers: number;
  StudentQuizAttempt: string[];
};

export default function SettingsPage() {
  const { user: clerkUser } = useUser();
  const clerkId = clerkUser?.id;
  const { user } = useAuth(clerkId ?? "");

  const [history, setHistory] = useState<HistoryItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [dateRange, setDateRange] = useState<{
    start: Date | null;
    end: Date | null;
  }>({
    start: null,
    end: null,
  });

  useEffect(() => {
    if (!user?.id) return;

    const fetchHistory = async () => {
      setLoading(true);

      const res = await fetch("/api/getStudentsAttempt", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ teacherId: user.id }),
      });

      const data = await res.json();
      setHistory(data);
      setLoading(false);
    };

    fetchHistory();
  }, [user]);

  const filteredHistory = history.filter((item) => {
    const itemDate = new Date(item.createdAt);
    if (dateRange.start && itemDate < dateRange.start) return false;
    if (dateRange.end && itemDate > dateRange.end) return false;
    return true;
  });

  return (
    <div className="min-h-screen flex bg-[#f4f6ff]">
      <SideBar />

      <div className="flex-1 p-8">
        <div className="mb-6">
          <h1 className="text-4xl font-bold text-gray-900">History</h1>
          <div className="mt-4 h-0.5 bg-gray-300 rounded -mx-8" />

          <div className="flex mt-[30px] items-center">
            <div className="font-semibold text-gray-600">Filter By:</div>

            <div className="border border-gray-300 w-100 h-[30px] rounded-lg ml-2.5 text-gray-500 font-semibold flex items-center px-2 ">
              <input
                type="date"
                className="flex-1 h-full border-none bg-transparent text-gray-700"
                onChange={(e) =>
                  setDateRange({
                    ...dateRange,
                    start: e.target.value ? new Date(e.target.value) : null,
                  })
                }
              />
              <span className="mx-1">-</span>
              <input
                type="date"
                className="flex-1 h-full border-none bg-transparent text-gray-700"
                onChange={(e) =>
                  setDateRange({
                    ...dateRange,
                    end: e.target.value ? new Date(e.target.value) : null,
                  })
                }
              />
            </div>
          </div>

          <div className="mt-[50px]">
            <div className="grid grid-cols-[40px_150px_1fr_150px_180px_200px] items-center font-bold text-gray-700">
              <input type="checkbox" />
              <span>Game Mode</span>
              <span>Title</span>
              <span>Total Players</span>
              <span>Date</span>
              <span></span>
            </div>

            <div className="mt-4 h-0.5 bg-gray-300 rounded w-full" />
          </div>

          <div className="max-h-[60vh] overflow-y-auto">
            {loading ? (
              <div className="py-10 text-center font-bold  justify-center flex scale-200 gap-1">
                Loading <Spinner className="mt-1 " />
              </div>
            ) : (
              filteredHistory.map((item) => (
                <div key={item.quizId}>
                  <div className="grid grid-cols-[40px_150px_1fr_150px_180px_200px] items-center py-4">
                    <input type="checkbox" />
                    <span className="font-bold text-gray-700">Classic</span>
                    <span className="font-bold text-gray-700">
                      {item.title}
                    </span>
                    <span className="font-bold text-gray-700">
                      {item.StudentQuizAttempt.length}
                    </span>
                    <div className="bg-gray-400 rounded-lg font-bold px-3 h-10 w-55 flex items-center text-white">
                      {new Date(item.createdAt).toLocaleString()}
                    </div>
                  </div>
                  <div className="h-0.5 bg-gray-300 rounded" />
                </div>
              ))
            )}
          </div>
        </div>

        <Pagination className="justify-end">
          <PaginationContent>
            <PaginationItem>
              <PaginationPrevious href="#" />
            </PaginationItem>
            <PaginationItem>
              <PaginationLink href="#">1</PaginationLink>
            </PaginationItem>
            <PaginationItem>
              <PaginationEllipsis />
            </PaginationItem>
            <PaginationItem>
              <PaginationNext href="#" />
            </PaginationItem>
          </PaginationContent>
        </Pagination>
      </div>
    </div>
  );
}
