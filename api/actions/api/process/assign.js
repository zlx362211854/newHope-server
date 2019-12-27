import mongoose from "mongoose";
import { code } from "../../config";
import { argsFilter } from "../../lib/util";
import {roleAuthPromise} from "../../lib/auth";
const Process = mongoose.model("Process");
const Log = mongoose.model("ProcessLog");
export default async req => {
  await roleAuthPromise(req);
  const args = await argsFilter(req.body, {
    id: ["required", "string"],
    target: ["required", "string"]
  });
  const {user} = req.session
  // 指派给自己
  if (args.target === 'me') {
    args.target = user._id
  }
  const updatedProcess = await Process.findOneAndUpdate(
    { _id: args.id },
    { $set: { conductor: args.target } },
    { new: true }
  );
  const log = new Log({
    user: user._id,
    process: args.id,
    type: 'assign'
  })
  await log.save()
  return { code: code.success, data: updatedProcess };
};
