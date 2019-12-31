import mongoose from "mongoose";
import { code } from "../../config";
import {roleAuthPromise} from "../../lib/auth";
import { argsFilter } from '../../lib/util';
const Process = mongoose.model("Process");
export default async req => {
  await roleAuthPromise(req);
  const args = await argsFilter(req.query, {
    id: ['required', 'string']
  });
  const process = await Process.findOne({_id: args.id}).populate({
    path: 'creator',
    select: '-pass',// 返回内容不包括pass字段
    populate: [
      {
        path: 'avatar'
      },
      {
        path: 'org'
      }
    ]
  }).populate({
    path: 'conductor',
    select: '-pass'
  }).populate('files.file');
  return { code: code.success, data: process };
};
