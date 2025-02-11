import { Router } from "express";
import { verifyJWT } from "../middlewares/auth.middleware.js";
import {
  CreateRoom,
  GetAllRooms,
  GetSpecificRoom,
  DeleteRoom,
  sendInvite,
  sendInviteResponse,
} from "../controllers/room.controller.js";

const router: Router = Router();

router.post("/", verifyJWT, CreateRoom);
router.get("/", verifyJWT, GetAllRooms);
router.get("/:id", verifyJWT, GetSpecificRoom);
router.delete("/:id", verifyJWT, DeleteRoom);
router.post("/sendInvite", verifyJWT, sendInvite);
router.post("/sendInviteResponse", verifyJWT, sendInviteResponse);

export { router };
