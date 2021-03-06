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
    target: ["required", "string"]
  });
  const {user} = req.session
  // 指派给自己
  if (args.target === 'me') {
    args.target = user._id
  }
  const updatedProcess = await Process.findOneAndUpdate(
    { _id: args.id },
    { $set: { conductor: args.target, status: 'accepted' } },
    { new: true }
  );
  const targetUser = await Users.findOne({_id: args.target})
  const log = new Log({
    user: user._id,
    process: args.id,
    type: 'assign',
    content: `指派给${targetUser.name}`
  })
  await log.save()
  return { code: code.success, data: updatedProcess };
};
