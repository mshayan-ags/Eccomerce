const { Image } = require("../models/Image");
const { saveImage, UPLOAD_DIR } = require("../utils/saveImage");
const { Router } = require("express");
const { existsSync } = require("fs");
const path = require("path");

async function SaveImageDB(image, rest, res) {
  try {
    const fleSaved = await saveImage(image, res);

    if (fleSaved?.filename) {
      const newImage = new Image({
        filename: fleSaved?.filename,
        mimetype: fleSaved?.mimetype,
        ...rest,
      });

      const saved = await newImage.save();

      return { file: saved };
    } else {
      return { Error: fleSaved?.Error };
    }
  } catch (error) {
    return { Error: error?.message || "There Was Some Issue" };
  }
}

// Resolves a client-supplied filename against UPLOAD_DIR and refuses to serve
// anything that resolves outside it (blocks "../" path traversal).
function resolveUploadPath(filename) {
  const safeName = path.basename(filename || "");
  const resolved = path.join(UPLOAD_DIR, safeName);
  if (!resolved.startsWith(UPLOAD_DIR)) {
    return null;
  }
  return resolved;
}

const router = Router();

router.get("/GetImage/:filename", async (req, res) => {
  try {
    const imagePath = resolveUploadPath(req?.params?.filename);
    if (imagePath && existsSync(imagePath)) return res.download(imagePath);
    res.status(404).json({ status: 404, message: "Image Not Found" });
  } catch (error) {
    res.status(500).json({ status: 500, message: error?.message || "Something went wrong" });
  }
});

router.get("/GetImageById/:id", async (req, res) => {
  try {
    const FindImage = await Image.findOne({ _id: req.params.id });
    const imagePath = FindImage && resolveUploadPath(FindImage.filename);
    if (imagePath && existsSync(imagePath)) return res.download(imagePath);
    res.status(404).json({ status: 404, message: "Image Not Found" });
  } catch (error) {
    res.status(500).json({ status: 500, message: error?.message || "Something went wrong" });
  }
});

module.exports = { SaveImageDB, GetImage: router };
