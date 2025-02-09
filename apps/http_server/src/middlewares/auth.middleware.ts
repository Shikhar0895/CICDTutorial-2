import { prismaClient } from "@repo/db/client";
import { NextFunction, Request, Response } from "express";
import jwt, { JwtPayload } from "jsonwebtoken";
import { ApiResponse } from "../utils/ApiResponse";

interface CustomRequest extends Request {
  user?: {
    id: string;
    username: string;
  };
}

interface CustomPayload extends JwtPayload {
  id: string;
  username: string;
}

type CustomPayloadRequest = string | CustomPayload;

const verifyJWT = async (
  req: CustomRequest,
  res: Response,
  next: NextFunction
) => {
  const receivedToken =
    req.header("Authorization")?.replace("Bearer ", "") ||
    req.cookies?.accessToken ||
    req.cookies?.refreshToken;

  let response;
  let secret;
  console.log("From middleware", receivedToken);
  if (
    receivedToken === req.cookies?.accessToken ||
    req.header("Authorization")?.replace("Bearer ", "")
  ) {
    secret = process.env.ACCESS_TOKEN_SECRET;
  } else if (receivedToken === req.cookies?.refreshToken) {
    secret = process.env.REFRESH_TOKEN_SECRET;
  }

  try {
    const decodedPayload = jwt.verify(receivedToken, secret as string);
    const user = await prismaClient.users.findFirst({
      where: {
        id: (decodedPayload as CustomPayload)?.id,

        username: (decodedPayload as CustomPayload).username,
      },
    });
    if (!user) {
      res.status(401).json(new ApiResponse(401, {}, "Invalid Token"));
      return;
    }
    (req as CustomRequest).user = user;
    next();
  } catch (error) {
    console.error("Error while verifying your token", error);
  }
};
export { verifyJWT };
