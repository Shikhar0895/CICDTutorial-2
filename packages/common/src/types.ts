import { z } from "zod";
import express from "express";
const FormSchema = z.object({
  username: z.string().min(3).max(20),
  password: z.string().min(8),
});

const CreateRoomSchema = z.object({
  RoomName: z.string().min(3).max(20),
  isAdmin: z.boolean(),
});

export interface CustomRequest extends express.Request {
  user?: {
    id: string;
    username: string;
  };
}

export { FormSchema, CreateRoomSchema };
