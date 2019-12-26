import mongoose from "mongoose";
import { code } from "../../config";
import {roleAuthPromise} from "../../lib/auth";
const Users = mongoose.model("Signup")
export default async req => {
  await roleAuthPromise(req);
  const users = await Users.find({role: {$ne: ['super_admin']}, deleted: false}).populate('org').sort({create_time: -1});
  return { code: code.success, data: users };
};
