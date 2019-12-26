import mongoose from "mongoose";
import { code } from "../../config";
import { argsFilter } from "../../lib/util";
import {roleAuthPromise} from "../../lib/auth";
const Process = mongoose.model("Process");
export default async req => {
  const args = await argsFilter(req.body, {
    title: ["required", "string"],
    content: ["required", 'string'],
    files: "array"
  });
  await roleAuthPromise(req);
  const {_id: userId} = req.session.user
  const process = new Process({
    ...args,
    creator: userId,
    status: 'submitted'
  });
  await process.save();
  return { code: code.success };
};
