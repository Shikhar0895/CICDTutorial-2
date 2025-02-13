import { CreateRoomSchema, CustomRequest } from "@repo/common/types";
import { prismaClient } from "@repo/db/client";
import { Request, Response } from "express";
import { ApiResponse } from "../utils/ApiResponse";
import { date } from "zod";

// model Rooms {
//     id           String   @id @unique @default(cuid())
//     slug         String   @unique
//     adminId      String    @unique
//     createdAt    DateTime @default(now())
//     MembersCount Int?
//     messages     messages[]
//     roomMembers  RoomMembers[]
//   }

const CreateRoom = async (req: CustomRequest, res: Response) => {
  try {
    const parsedData = CreateRoomSchema.safeParse(req.body);
    if (!parsedData.success) {
      res
        .status(400)
        .json(
          new ApiResponse(
            400,
            { error: parsedData.error },
            "Incorrect Inputs to Create Room"
          )
        );
      return;
    }

    const slug = parsedData.data?.RoomName.replaceAll(
      " ",
      "_"
    ).toLowerCase() as string;
    const createdRoom = await prismaClient.rooms.create({
      data: {
        slug,
        adminId: req.user?.id as string,
        adminUsername: req.user?.username as string,
        MembersCount: 1,
      },
    });
    const addMember = await prismaClient.roomMembers.create({
      data: {
        roomId: createdRoom.id,
        userId: req.user?.id as string,
      },
    });
    if (!(createdRoom && addMember)) {
      res
        .status(400)
        .json(new ApiResponse(400, {}, "Room Creation failed from line 54"));
      return;
    }
    res
      .status(200)
      .json(new ApiResponse(200, { roomId: createdRoom.id }, "Room Created"));
    return;
  } catch (error) {
    res
      .status(400)
      .json(new ApiResponse(200, null, "Room Creation Failed from line 64"));
    return;
  }
};

const GetAllRooms = async (req: CustomRequest, res: Response) => {
  try {
    console.log("running get all rooms");
    const rooms = await prismaClient.rooms.findMany({
      where: {
        adminId: req.user?.id,
      },
    });
    res.status(200).json(new ApiResponse(200, { rooms }, "All rooms fetched"));
    return;
  } catch (error) {
    console.log(error);
    res.status(400).json(new ApiResponse(200, null, "Operation failed"));
    return;
  }
};

const GetSpecificRoom = async (req: CustomRequest, res: Response) => {
  try {
    const specificRoom = await prismaClient.rooms.findFirst({
      where: {
        id: req.params.id,
        adminId: req.user?.id,
      },
    });
    if (!specificRoom) {
      res.status(400).json(new ApiResponse(400, {}, "Room not found"));
      return;
    }
    res
      .status(200)
      .json(new ApiResponse(200, { specificRoom }, "Room fetched"));
    return;
  } catch (error) {
    console.log(error);
    res
      .status(400)
      .json(new ApiResponse(400, null, "Room fetching operation failed"));
    return;
  }
};

const DeleteRoom = async (req: CustomRequest, res: Response) => {
  try {
    const roomToDelete = await prismaClient.rooms.findFirst({
      where: {
        id: req.params.id,
      },
    });
    if (!roomToDelete) {
      res
        .status(400)
        .json(new ApiResponse(400, null, "Invalid room id, operation failed"));
      return;
    }
    await prismaClient.roomMembers.deleteMany({
      where: {
        roomId: req.params.id,
      },
    });

    await prismaClient.rooms.delete({
      where: {
        id: req.params.id,
      },
    });
    res
      .status(200)
      .json(new ApiResponse(200, null, "Room deleted successfully"));
    return;
  } catch (error) {
    console.log(error);
    res
      .status(400)
      .json(new ApiResponse(400, null, "Room deleting operation failed"));
    return;
  }
};

const sendInvite = async (req: CustomRequest, res: Response) => {
  try {
    const { to, fromRoom } = req.query;
    const recepientUser = await prismaClient.users.findFirst({
      where: {
        username: to as string,
      },
    });
    console.log({ recipientData: recepientUser });
    console.log({ sender: req.user });
    const Room = await prismaClient.rooms.findUnique({
      where: {
        slug: fromRoom as string,
      },
    });
    const createInviteObject = await prismaClient.invites.create({
      data: {
        sender: req.user?.id as string,
        recipient: recepientUser?.id as string,
        roomId: Room?.id as string,
      },
    });
    res.status(200).json(new ApiResponse(200, {}, "Invite Sent"));
  } catch (error) {
    console.error("Error while sending invite", error);
  }
};

const sendInviteResponse = async (req: CustomRequest, res: Response) => {
  console.log({ recipientsFromjwt: req.user });
  try {
    const { InviteSender, slug, response } = req.body;
    const SenderUserdetails = await prismaClient.users.findFirst({
      where: {
        username: InviteSender as string,
      },
    });
    console.log({ SenderUserdetails });
    const Room = await prismaClient.rooms.findUnique({
      where: {
        slug: slug as string,
      },
    });
    console.log({ Room });
    console.log({ recipient: req.user?.id });

    const inviteDetail = await prismaClient.invites.findFirst({
      where: {
        sender: SenderUserdetails?.id as string,
        recipient: req.user?.id as string,
        roomId: Room?.id as string,
      },
    });
    console.log({ inviteDetail });
    if (!inviteDetail) {
      res.status(200).json({ message: "No such invite found" });
      return;
    } else if (inviteDetail.status !== "Pending") {
      res
        .status(200)
        .json(new ApiResponse(200, {}, "invite already responded with"));
      return;
    }
    const inviteResponse = await prismaClient.invites.update({
      where: {
        id: inviteDetail?.id,
      },
      data: {
        status: req.body.response,
      },
    });
    res
      .status(200)
      .json(new ApiResponse(200, {}, "invite response sent successfully"));
  } catch (error) {
    console.log("Error while sending invite response", error);
  }
};
export {
  CreateRoom,
  GetAllRooms,
  GetSpecificRoom,
  DeleteRoom,
  sendInvite,
  sendInviteResponse,
};
