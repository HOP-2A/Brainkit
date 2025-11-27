"use client";
import { useUser } from "@clerk/nextjs";

const Page = () => {
  const user = useUser();
  console.log(user.user);
  return (
    <div>
      <div>hello</div>
    </div>
  );
};

export default Page;
