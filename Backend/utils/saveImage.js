const fs = require("fs");
const path = require("path");
const crypto = require("crypto");
const { CheckAllRequiredFieldsAvailaible } = require("./functions");

const UPLOAD_DIR = path.join(__dirname, "../uploads");
fs.mkdirSync(UPLOAD_DIR, { recursive: true });

const MAX_IMAGE_BYTES = 5 * 1024 * 1024; // 5MB
const ALLOWED_MIME_TYPES = {
  "image/png": ".png",
  "image/jpeg": ".jpg",
  "image/webp": ".webp",
  "image/gif": ".gif",
};

async function saveImage(image, res) {
  try {
    const imageData = image;
    const Check = await CheckAllRequiredFieldsAvailaible(imageData, ["name", "data", "type"], res);
    if (Check) {
      return { Error: "There Was Some Issue" };
    }

    const extension = ALLOWED_MIME_TYPES[imageData?.type];
    if (!extension) {
      return { Error: "Unsupported image type. Allowed types: png, jpeg, webp, gif." };
    }

    const base64Marker = "base64,";
    const markerIndex = imageData?.data?.indexOf(base64Marker);
    if (markerIndex === -1) {
      return { Error: "Invalid image data" };
    }
    const base64Data = imageData.data.slice(markerIndex + base64Marker.length);

    const approxBytes = Math.ceil((base64Data.length * 3) / 4);
    if (approxBytes > MAX_IMAGE_BYTES) {
      return { Error: `Image exceeds the ${MAX_IMAGE_BYTES / (1024 * 1024)}MB limit` };
    }

    // Filename is generated server-side, never derived from client input, so a
    // crafted `name` (e.g. "../../app.js") can't escape the uploads directory.
    const filename = `${crypto.randomUUID()}${extension}`;
    const imagePath = path.join(UPLOAD_DIR, filename);

    fs.writeFileSync(imagePath, base64Data, "base64");
    return { filename, mimetype: imageData?.type };
  } catch (error) {
    console.error("Error uploading image:", error);
    return { Error: "There Was Some Issue" };
  }
}

module.exports = { saveImage, UPLOAD_DIR };
