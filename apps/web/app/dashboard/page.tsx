"use client";
import { Button } from "@/components/ui/button";
import { UserCircle } from "lucide-react";
import { useRouter } from "next/navigation";
import Face from "@material-design-icons/svg/filled/face.svg";
import React from "react";
import Image from "next/image";
import SvgComponent from "@/lib/SvgComponent";
import { AccountCircle } from "../assets";

const Dashboard = () => {
  //get available rooms data for the user
  //once all the rooms are fetched then render the cards until then skeleton of the cards shall be rendered
  const router = useRouter();
  return (
    <div className=" w-[calc(100vw-128px)] h-[calc(100vh-128px)]">
      <div className="flex justify-between items-center my-2.5">
        <h1>Welcome User</h1>
        <div className="flex gap-4">
          <Button className="bg-gray-600">Create Room</Button>
          {/* <UserCircle size={"40px"} /> */}
          <AccountCircle dimensions={"40px"} fill="#ffffff" />
        </div>
      </div>
      <hr />
      <h3>Your Rooms</h3>
      <div className="flex gap-5">
        <div
          className="w-[300px] h-[120px] rounded-xl border-2 border-amber-100"
          onClick={() => router.push(`/rooms/125`)}
        >
          Room1
        </div>
        <div
          className="w-[300px] h-[120px] rounded-xl border-2 border-amber-100"
          onClick={() => router.push(`/rooms/326`)}
        >
          Room2
        </div>
        <div className="w-[300px] h-[120px] rounded-xl border-2 border-amber-100">
          Room3
        </div>
        <div className="w-[300px] h-[120px] rounded-xl border-2 border-amber-100">
          Room4
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
