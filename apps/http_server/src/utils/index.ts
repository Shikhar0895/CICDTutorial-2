import jwt from "jsonwebtoken";
import { config } from "@repo/backend-common/config";

const generateTokens = (id: string, username: string) => {
  const accessTokenSecret = config.ACCESS_TOKEN_SECRET;
  const refreshTokenSecret = config.REFRESH_TOKEN_SECRET;
  if (!accessTokenSecret || !refreshTokenSecret) {
    throw new Error("Missing token secrets");
  }
  const accessToken = jwt.sign({ id, username }, accessTokenSecret, {
    expiresIn: "1h",
  });
  const refreshToken = jwt.sign({ id, username }, refreshTokenSecret, {
    expiresIn: "7d",
  });
  return { accessToken, refreshToken };
};

export { generateTokens };
