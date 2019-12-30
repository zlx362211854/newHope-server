import mongoose from "mongoose";
import { code } from "../../config";
import { argsFilter } from "../../lib/util";
import {roleAuthPromise} from "../../lib/auth";
const Process = mongoose.model("Process");
const Log = mongoose.model("ProcessLog");
const Users = mongoose.model("Signup");
export default async req => {
  await roleAuthPromise(req);
  const args = await argsFilter(req.body, {
    id: ["required", "string"],
    type: ["required", "string"]
  });
  const {user} = req.session
  const updatedProcess = await Process.findOneAndUpdate(
    { _id: args.id },
    { $set: { status: args.type } },
    { new: true }
  );
  const targetUser = await Users.findOne({_id: args.target})
  const log = new Log({
    user: user._id,
    process: args.id,
    type: args.type,
    content: `将状态变更为:${args.type}`
  })
  await log.save()
  return { code: code.success, data: updatedProcess };
};
