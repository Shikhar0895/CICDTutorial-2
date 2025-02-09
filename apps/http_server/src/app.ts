import express, { Express } from "express";
import cookieParser from "cookie-parser";
import cors from "cors";
import "dotenv/config";
import { router as authRouter } from "./routes/auth.routes";
import { router as roomRouter } from "./routes/room.route";
import { router as userRouter } from "./routes/user.routes";
const app: Express = express();

app.use(
  cors({
    origin: process.env.ORIGIN,
    credentials: true,
    methods: ["POST", "GET", "PUT", "DELETE", "PATCH"],
    allowedHeaders: ["Content-Type", "Authorization"],
  })
);
app.use(express.json({ limit: "16kb" }));
app.use(express.urlencoded({ extended: true, limit: "16kb" }));
app.use(express.static("static"));
app.use(cookieParser());

app.use("/api/v1/", authRouter);
app.use("/api/v1/rooms", roomRouter);
app.use("/api/v1/users", userRouter);

app.get("/home", (req, res) => {
  res.send("Hello World");
});

export { app };
