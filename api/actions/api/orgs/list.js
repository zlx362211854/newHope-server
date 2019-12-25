import mongoose from "mongoose";
import { code } from "../../config";
import {roleAuthPromise} from "../../lib/auth";
const Orgs = mongoose.model("Orgs");
export default async req => {
  await roleAuthPromise(req);
  const orgsList = await Orgs.find({deleted: false}).sort({create_time: -1});
  return { code: code.success, data: orgsList };
};
