import mongoose from "mongoose";
import { code } from "../../config";
import {roleAuthPromise} from "../../lib/auth";
const Process = mongoose.model("Process");
const Users = mongoose.model("Signup")
export default async req => {
  await roleAuthPromise(req);
  const {_id: userId} = req.session.user
  const user = await Users.findOne({_id: userId}, {name: 1});
  if (!user) {
    throw { code: code.fail, msg: '用户不存在！' };
  }
  const processList = await Process.find({creator: userId, deleted: false}).populate({
    path: 'creator',
    select: '-pass',// 返回内容不包括pass字段
    populate: {
      path: 'avatar'
    }
  }).populate('files.file').sort({create_time: -1});
  return { code: code.success, data: processList };
};
