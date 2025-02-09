import { Router } from "express";
import { verifyJWT } from "../middlewares/auth.middleware";
import { editProfile } from "../controllers/profile.controller";

const router: Router = Router();

router.post("/editProfile", verifyJWT, editProfile);

export { router as ProfileRouter };
