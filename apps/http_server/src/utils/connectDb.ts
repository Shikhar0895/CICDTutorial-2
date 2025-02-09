import { prismaClient } from "@repo/db/client";

export const connectDB = async () => {
  try {
    const connectionInstance = await prismaClient.$connect();
    console.log("Database connected");
  } catch (error) {
    console.error("Database Connection error", error);
  }
};
