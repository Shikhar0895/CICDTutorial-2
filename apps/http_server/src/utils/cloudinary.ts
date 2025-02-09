import { v2 as cloudinary } from "cloudinary";
import fs from "fs";

cloudinary.config({
  cloud_name: process.env.CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

const uploadOnCloudinary = async (localFilePath: string) => {
  try {
    if (!localFilePath) {
      console.log("local file path not found");
      return;
    }
    const response = await cloudinary.uploader.upload(localFilePath, {
      resource_type: "auto",
    });
    console.log("file has been uploaded successfully");
    fs.unlinkSync(localFilePath);
    return response;
  } catch (error) {
    console.error("Error while uploading to cloudinary", error);
  }
};

export { uploadOnCloudinary };
