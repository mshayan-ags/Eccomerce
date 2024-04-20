const jwt = require("jsonwebtoken");
const { User } = require("../models/User");
const { Admin } = require("../models/Admin");

const APP_SECRET = process.env.JWT_SECRET;

if (!APP_SECRET) {
  throw new Error("JWT_SECRET is not set. Copy .env.example to .env and fill it in.");
}

function getTokenPayload(token) {
  return jwt.verify(token, APP_SECRET);
}

async function getUserId(req) {
  const authHeader = req?.headers?.authorization;
  if (!authHeader) {
    return { message: "Not authenticated" };
  }

  const token = authHeader.replace("Bearer ", "");
  if (!token) {
    return { message: "No token found" };
  }

  try {
    const { id } = getTokenPayload(token);
    const isUser = await User.findOne({ _id: id });

    if (isUser?._id) return { id };
    return { message: "Not authenticated" };
  } catch (error) {
    return { message: "Invalid or expired token" };
  }
}

async function getAdminId(req) {
  const authHeader = req?.headers?.authorization;
  if (!authHeader) {
    return { message: "Not authenticated" };
  }

  const token = authHeader.replace("Bearer ", "");
  if (!token) {
    return { message: "No token found" };
  }

  try {
    const { id, Role } = getTokenPayload(token);
    const isAdmin = await Admin.findOne({ _id: id });

    if (isAdmin?._id && isAdmin?.Role == Role) return { id, Role };
    return { message: "Not authenticated" };
  } catch (error) {
    return { message: "Invalid or expired token" };
  }
}

module.exports = {
  APP_SECRET,
  getUserId,
  getAdminId,
};
