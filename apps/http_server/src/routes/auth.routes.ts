import { Router } from "express";
import {
  RegisterUser,
  LogUserOut,
  SignInUser,
  refreshToken,
  updatePhotoUrls,
} from "../controllers/auth.controller.js";
import { verifyJWT } from "../middlewares/auth.middleware.js";
import { upload } from "../middlewares/multer.middleware.js";

const router: Router = Router();

router.post("/signup", RegisterUser);
router.post("/signin", SignInUser);
router.post("/logout", verifyJWT, LogUserOut);
router.post("/refreshToken", verifyJWT, refreshToken);
router.patch(
  "/users/updateAvatar",
  verifyJWT,
  upload.single("avatar"),
  updatePhotoUrls
);
router.patch(
  "/users/updatePhoto",
  verifyJWT,
  upload.single("photo"),
  updatePhotoUrls
);

export { router };
