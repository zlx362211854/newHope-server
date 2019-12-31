import mongoose from "mongoose";
import { code } from "../../config";
import {roleAuthPromise} from "../../lib/auth";
const Process = mongoose.model("Process");
export default async req => {
  await roleAuthPromise(req);
  const {_id: userId} = req.session.user

  const processList = await Process.find({conductor: userId, deleted: false}).populate({
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
  }).populate('files.file').populate({
    path: 'conductor',
    select: '-pass'
  }).sort({create_time: -1});
  return { code: code.success, data: processList };
};
