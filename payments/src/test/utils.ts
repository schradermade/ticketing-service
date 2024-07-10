import mongoose from "mongoose";

export function createHexObjectId(id?: string) {
  return  id || new mongoose.Types.ObjectId().toHexString();
}
