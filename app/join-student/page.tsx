"use client";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";
export default function JoinClass() {
  const [code, setCode] = useState("");
  const { push } = useRouter();
  const joinClass = async () => {
    const res = await fetch("/api/find-classroombycode", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ code }),
    });

    const data = await res.json();

    if (!res.ok) {
      console.log("buruu code");
      return;
    }
    if (res.ok) {
      push(`/play-student/${data.id}`);
    }
    console.log(data);
  };

  return (
    <div>
      <input
        value={code}
        onChange={(e) => setCode(e.target.value)}
        placeholder="Enter class code"
      />
      <Button onClick={joinClass}>Join</Button>
    </div>
  );
}
