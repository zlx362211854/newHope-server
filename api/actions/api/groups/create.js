import mongoose from "mongoose";
import { code } from "../../config";
import { argsFilter } from "../../lib/util";

const Group = mongoose.model("Groups");
const Users = mongoose.model("Signup")
export default async req => {
  const args = await argsFilter(req.body, {
    creator: ["required", "string"],
    group_name: ["required", 'string'],
    posts: "array",
    members: "array"
  });
  const user = await Users.findOne({_id: args.creator}, {name: 1});
  if (!user) {
    throw { code: code.fail, msg: '用户不存在！' };
  }
  const group = new Group({
    ...args
  });
  await group.save();
  return { code: code.success };
};
