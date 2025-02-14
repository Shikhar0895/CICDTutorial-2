"use client";
import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";
import React from "react";
import { AccountCircle } from "../assets";
import { useRoom } from "@/hooks/useRoom";
import useApi from "@/hooks/useApi";
import axios from "axios";

const Dashboard = () => {
  const { loading, data, error, refresh } = useRoom();
  console.log(data);
  const createRoomApi = async () => {
    const response = await axios.post(
      `${process.env.NEXT_PUBLIC_API_URL}/api/v1/rooms/`,
      { RoomName: "Classroom 670", isAdmin: true },
      { withCredentials: true }
    );
    return response.data;
  };

  const {
    submit: createRoom,
    data: createRoomData,
    loading: createRoomApiLoading,
    error: createRoomError,
  } = useApi(createRoomApi);
  console.log({ createRoomData, createRoomError, createRoomApiLoading });
  const router = useRouter();

  if (data !== null)
    return (
      <div className=" w-[calc(100vw-128px)] h-[calc(100vh-128px)]">
        <div className="flex justify-between items-center my-2.5">
          <h1>Welcome User</h1>
          <div className="flex gap-4">
            <Button
              className="bg-gray-600"
              onClick={async () => {
                await createRoom();
                refresh();
              }}
            >
              Create Room
            </Button>
            <AccountCircle dimensions={"40px"} fill="#ffffff" />
          </div>
        </div>
        <hr />
        <div className="flex justify-between py-3 ">
          <h3>Your Rooms</h3>
          <Button onClick={refresh} className="bg-gray-400 text-gray-950">
            Refresh
          </Button>
        </div>

        {(data as any[]).length === 0 && <div>No rooms created Yet</div>}
        {(data as any[]).length > 0 && (
          <div className="flex gap-5 flex-wrap">
            {(data as any).map((roomData: any, index: number) => {
              return (
                <div
                  key={index}
                  className="w-[300px] h-[120px] rounded-xl border-2 border-amber-100"
                  onClick={() => router.push(`/rooms/125`)}
                >
                  {roomData.slug}
                  {roomData.adminUsername}
                  {roomData.MembersCount}
                </div>
              );
            })}
          </div>
        )}
        {loading && <div>...loading</div>}
      </div>
    );
};

export default Dashboard;
