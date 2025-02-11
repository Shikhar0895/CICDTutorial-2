import { Router } from "express";
import { verifyJWT } from "../middlewares/auth.middleware.js";
import { upload } from "../middlewares/multer.middleware.js";
import {
  updatePhotoUrls,
  updateProfileDetails,
} from "../controllers/auth.controller.js";

const router: Router = Router();

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
router.patch("/users/updateProfile", verifyJWT, updateProfileDetails);

export { router };
