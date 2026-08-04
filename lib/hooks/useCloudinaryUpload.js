import { useState } from "react";
import { addToast } from "@heroui/toast";

const IMAGE_MAX_SIZE = 10 * 1024 * 1024; // 10MB — matches Cloudinary upload preset limit
const VIDEO_MAX_SIZE = 20 * 1024 * 1024; // 20MB

export function useCloudinaryUpload() {
  const [isUploading, setIsUploading] = useState(false);

  const uploadFile = async (file, resourceType = "image") => {
    if (!file) return null;

    const maxSize = resourceType === "video" ? VIDEO_MAX_SIZE : IMAGE_MAX_SIZE;
    const label = resourceType === "video" ? "20MB" : "10MB";

    if (file.size > maxSize) {
      addToast({
        title: "File Too Large",
        description: `${resourceType === "video" ? "Video" : "Image"} must be under ${label}.`,
        color: "danger",
      });
      return null;
    }

    setIsUploading(true);
    try {
      const formData = new FormData();
      formData.append("file", file);
      formData.append(
        "upload_preset",
        process.env.NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET,
      );

      const res = await fetch(
        `https://api.cloudinary.com/v1_1/${process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME}/${resourceType}/upload`,
        { method: "POST", body: formData },
      );

      if (!res.ok) throw new Error("Upload failed");

      const data = await res.json();

      if (!data.secure_url || !data.public_id) {
        throw new Error("Invalid response from Cloudinary");
      }

      return { url: data.secure_url, publicId: data.public_id };
    } catch {
      addToast({
        title: "Upload Error",
        description: `Failed to upload ${resourceType}. Please try again.`,
        color: "danger",
      });
      return null;
    } finally {
      setIsUploading(false);
    }
  };

  const uploadImage = (file) => uploadFile(file, "image");
  const uploadVideo = (file) => uploadFile(file, "video");

  return { uploadImage, uploadVideo, isUploading };
}
