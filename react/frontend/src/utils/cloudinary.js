// This file is used in React (browser-side) to upload images via API

export const uploadImageToCloudinary = async (file, type = "product") => {
  try {
    const formData = new FormData();
    formData.append("image", file);
    formData.append("type", type); // "profile" or "product"

    const response = await fetch(
      `${
        import.meta.env.VITE_API_URL || "http://localhost:5000"
      }/api/upload/image`,
      {
        method: "POST",
        body: formData,
      }
    );

    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(`Image upload failed: ${errorText}`);
    }

    const data = await response.json();
    return data.url; // Cloudinary image URL
  } catch (error) {
    console.error("❌ Cloudinary Upload Error:", error);
    throw error;
  }
};
