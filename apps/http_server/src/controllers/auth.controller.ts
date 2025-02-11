import { CustomRequest, FormSchema } from "@repo/common/types";
import { prismaClient } from "@repo/db/client";
import { Request, Response } from "express";
import { ApiResponse } from "../utils/ApiResponse.js";
import bcrypt from "bcrypt";
import { generateTokens } from "../utils/index.js";
import { cookieOptions } from "../constants.js";
import { ApiError } from "../utils/ApiError.js";
import { RequestHandler } from "express";
import { uploadOnCloudinary } from "../utils/cloudinary.js";

const RegisterUser = async (req: Request, res: Response) => {
  const { username, password } = req.body;
  const parsedData = FormSchema.safeParse({ username, password });
  if (!parsedData.success) {
    res
      .status(401)
      .json(new ApiResponse(401, {}, "Input data invalid as per the format"));
    return;
  }
  try {
    const hashedPassword = await bcrypt.hash(parsedData.data.password, 10);

    const isUserAlreadyExist = await prismaClient.users.findFirst({
      where: {
        username,
      },
    });
    if (isUserAlreadyExist) {
      res.status(409).json(new ApiResponse(409, {}, "User already exist"));
      return;
    }

    const user = await prismaClient.users.create({
      data: {
        username,
        password: hashedPassword,
      },
    });
    const savedUser = await prismaClient.users.findFirst({
      where: {
        username,
      },
    });
    if (!savedUser) {
      res
        .status(401)
        .json(new ApiResponse(401, {}, "Unable to save user in DB"));
      return;
    }

    const { refreshToken, accessToken } = generateTokens(
      savedUser.id,
      username
    );
    const saveRefreshTokenInDB = await prismaClient.users.update({
      where: {
        id: savedUser.id,
        username: savedUser.username,
      },
      data: {
        refreshToken,
      },
    });

    res
      .status(200)
      .cookie("accessToken", accessToken, cookieOptions)
      .cookie("refreshToken", refreshToken, cookieOptions)
      .json(new ApiResponse(200, { accessToken }, "User created SuccessFully"));
  } catch (error) {
    throw new ApiError(500, "Something Went wrong");
  }
};
const SignInUser = async (req: Request, res: Response) => {
  const { username, password } = req.body;
  const parsedData = FormSchema.safeParse({ username, password });
  if (!parsedData.success) {
    res
      .status(401)
      .json(new ApiResponse(401, {}, "Input data invalid as per the format"));
    return;
  }
  try {
    const user = await prismaClient.users.findFirst({
      where: {
        username: parsedData.data.username,
      },
    });
    if (!user) {
      res.status(401).json(new ApiResponse(401, {}, "No User Found"));
      return;
    }
    const hashedPassword = user?.password;
    const isPasswordCorrect = await bcrypt.compare(
      parsedData.data.password,
      hashedPassword
    );
    if (!isPasswordCorrect) {
      res.status(401).json(new ApiResponse(401, {}, "Incorrect Password"));
      return;
    }
    const { refreshToken, accessToken } = generateTokens(user.id, username);

    const updateTokenOnDB = await prismaClient.users.update({
      where: {
        username: user.username,
        id: user.id,
      },
      data: {
        refreshToken,
      },
    });

    res
      .status(200)
      .cookie("accessToken", accessToken, cookieOptions)
      .cookie("refreshToken", refreshToken, cookieOptions)
      .json(
        new ApiResponse(200, { accessToken }, "User Signed In Successfully")
      );
    return;
  } catch (error) {
    console.log(error);
    res.status(400).json(new ApiResponse(400, { error }, "Sign In Failed"));
    return;
  }
};

const LogUserOut = async (req: CustomRequest, res: Response) => {
  try {
    const ClearTokenFromDb = await prismaClient.users.update({
      where: {
        id: req.user?.id,
        username: req.user?.username,
      },
      data: {
        refreshToken: null,
      },
    });

    res
      .status(200)
      .clearCookie("accessToken", cookieOptions)
      .clearCookie("refreshToken", cookieOptions)
      .json(new ApiResponse(200, {}, "User logged out successfully"));
    return;
  } catch (error) {
    console.error(error);
    return;
  }
};

const refreshToken = async (req: CustomRequest, res: Response) => {
  try {
    if (!req.user) {
      res.status(401).json(new ApiResponse(401, {}, "Unauthorized"));
      return;
    }
    const { refreshToken, accessToken } = generateTokens(
      req.user?.id,
      req.user?.username
    );

    const UpdateTokenOnDb = await prismaClient.users.update({
      where: {
        id: req.user?.id,
        username: req.user?.username,
      },
      data: {
        refreshToken,
      },
    });

    res
      .status(200)
      .cookie("accessToken", accessToken, cookieOptions)
      .cookie("refreshToken", refreshToken, cookieOptions)
      .json(new ApiResponse(200, {}, "Token Refreshed"));
  } catch (error) {
    console.log(error);
    res
      .status(401)
      .json(
        new ApiResponse(
          401,
          {},
          "Could not fetch new token , try signing in again"
        )
      );
  }
};

const updatePhotoUrls = async (req: CustomRequest, res: Response) => {
  try {
    const photoPath = req.file?.path;
    req.file?.fieldname;

    if (!photoPath) {
      res.status(400).json({ message: "No file found to upload" });
      return;
    }
    const savedPhoto = await uploadOnCloudinary(photoPath);
    if (!savedPhoto?.url) {
      res.status(400).json({ message: "Error while uploading photo" });
      return;
    }
    const savePhotoUrlInDB = await prismaClient.users.update({
      where: {
        id: req.user?.id,
        username: req.user?.username,
      },
      data: {
        [req.file?.fieldname as string]: savedPhoto?.url,
      },
    });
    res
      .status(200)
      .json(
        new ApiResponse(200, { url: savedPhoto.url }, "Uploaded successfully")
      );
  } catch (error) {
    throw new ApiError(400, "Error while uploading the photo");
  }
};

const updateProfileDetails = async (req: CustomRequest, res: Response) => {
  try {
    const data: { name: string | null; email: string | null } = req.body;
    const updateUserProfile = await prismaClient.users.update({
      where: {
        id: req.user?.id,
        username: req.user?.username,
      },
      data: {
        ...data,
      },
    });
    res
      .status(200)
      .json(new ApiResponse(200, {}, "Details updated successfully"));
  } catch (error) {
    throw new ApiError(400, "Error while updating profile");
  }
};

export {
  RegisterUser,
  SignInUser,
  LogUserOut,
  refreshToken,
  updatePhotoUrls,
  updateProfileDetails,
};
