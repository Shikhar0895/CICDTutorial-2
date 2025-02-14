"use client";
import React from "react";
import { useParams } from "next/navigation";

const Page = () => {
  //create a canvas window
  //create a chat window
  //create participants
  //send invite
  const { roomId } = useParams();
  return (
    <div className="flex justify-between">
      Room {roomId}
      <div className="h-[50px] border-2 w-[400px] border-white rounded">
        Toolbar
      </div>
      <div className="h-[500px] border-2 w-[350px] border-white rounded">
        Chat window
      </div>
    </div>
  );
};

export default Page;
