import mongoose from "mongoose";
import { code } from "../../config";
import { argsFilter } from "../../lib/util";
import {roleAuthPromise} from "../../lib/auth";
const Process = mongoose.model("Process");
const Log = mongoose.model("ProcessLog");
const maps = {
  accepted: '待办',
  processing: '处理中',
  done: '完成'
}
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
  const log = new Log({
    user: user._id,
    process: args.id,
    type: args.type,
    content: `将状态变更为:${maps[args.type]}`
  })
  await log.save()
  return { code: code.success, data: updatedProcess };
};
