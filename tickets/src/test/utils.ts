import mongoose from "mongoose";

export function createHexObjectId() {
  return new mongoose.Types.ObjectId().toHexString();
}
