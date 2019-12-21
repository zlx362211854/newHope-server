import mongoose from "mongoose";
import { code } from "../../config";
import { argsFilter } from "../../lib/util";

const Signup = mongoose.model("Signup");

export default async req => {
  const args = await argsFilter(req.body, {
    _id: ["required", "string"],
    name: ["required", "string"]
  });
  const user = await Signup.findOne(
    {name: args.name, _id: {$ne: args._id} },
  )
  if (user) {
    throw { code: code.fail, msg: "用户名已存在！" };
  }
  const updatedUser = await Signup.findOneAndUpdate(
    { _id: args._id },
    { $set: { name: args.name } },
    { new: true, fields: { name: 1 } }
  );
  return { code: code.success, data: updatedUser };
};
