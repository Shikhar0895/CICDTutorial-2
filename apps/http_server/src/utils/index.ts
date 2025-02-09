import { prismaClient } from "@repo/db/client";
import jwt from "jsonwebtoken";

const generateTokens = (id: string, username: string) => {
  const accessToken = jwt.sign(
    { id, username },
    process.env.ACCESS_TOKEN_SECRET as string,
    { expiresIn: process.env.ACCESS_TOKEN_EXPIRY }
  );
  const refreshToken = jwt.sign(
    { id, username },
    process.env.REFRESH_TOKEN_SECRET as string,
    { expiresIn: process.env.REFRESH_TOKEN_EXPIRY }
  );
  return { accessToken, refreshToken };
};

export { generateTokens };
