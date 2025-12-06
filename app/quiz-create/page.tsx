"use client";

import { useState } from "react";

const Page = () => {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");

  const handleCreate = async () => {
    try {
      const res = await fetch("/api/quizCreate", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          title,
          description,
          classroom: "9adaad9241241",
        }),
      });

      if (!res.ok) {
        console.log("Failed to create quiz");
        return;
      }

      const data = await res.json();
      console.log("quiz vvsgegdleao");
    } catch (err) {
      console.log("aldaa garso");
    }
  };

  return (
    <div>
      <div>
        <div>Hello</div>

        <input
          placeholder="Title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
        />

        <input
          placeholder="Description"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
        />

        <button onClick={handleCreate}>Create Quiz</button>
      </div>
    </div>
  );
};

export default Page;
