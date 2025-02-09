export const config = {
  ACCESS_TOKEN_SECRET:
    process.env.ACCESS_TOKEN_SECRET || "Shikhar0895_AccessSecret",
  ACCESS_TOKEN_EXPIRY: process.env.ACCESS_TOKEN_EXPIRY || "1d",
  REFRESH_TOKEN_SECRET:
    process.env.REFRESH_TOKEN_EXPIRY || "Shikhar0895_REFRESHSecret",
  REFRESH_TOKEN_EXPIRY: process.env.REFRESH_TOKEN_EXPIRY || "7d",
};
