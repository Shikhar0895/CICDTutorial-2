import { Router } from "express";
import { verifyJWT } from "../middlewares/auth.middleware.js";
import { editProfile } from "../controllers/profile.controller.js";

const router: Router = Router();

router.post("/editProfile", verifyJWT, editProfile);

export { router as ProfileRouter };
