import mongoose from "mongoose";
import { code } from "../../config";
import {roleAuthPromise} from "../../lib/auth";
import { argsFilter } from '../../lib/util';
const Logs = mongoose.model("ProcessLog");
export default async req => {
  await roleAuthPromise(req);
  const args = await argsFilter(req.query, {
    id: ['required', 'string']
  });
  const logs = await Logs.find({process: args.id}).populate({
    path: 'user',
    select: '-pass'// 返回内容不包括pass字段
  }).sort({create_time: -1})
  return { code: code.success, data: logs };
};
