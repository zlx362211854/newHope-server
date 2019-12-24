import mongoose from "mongoose";
import { code } from "../../config";
import { argsFilter } from "../../lib/util";
import {roleAuthPromise} from "../../lib/auth";
const Process = mongoose.model("Process");
const Users = mongoose.model("Signup")
export default async req => {
  const args = await argsFilter(req.body, {
    title: ["required", "string"],
    content: ["required", 'string'],
    files: "array"
  });
  await roleAuthPromise(req);
  const {_id: userId} = req.session.user
  const user = await Users.findOne({_id: userId}, {name: 1});
  if (!user) {
    throw { code: code.fail, msg: '用户不存在！' };
  }
  const process = new Process({
    ...args
  });
  await process.save();
  return { code: code.success };
};
